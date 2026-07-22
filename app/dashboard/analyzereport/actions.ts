'use server';

import { writeFile, mkdir } from 'fs/promises';
import path, { resolve } from 'path';
import crypto from 'crypto';
import { v2 as cloudinary, UploadStream } from 'cloudinary';
import sharp from 'sharp';
import { cookies } from 'next/headers';
import { rejects } from 'assert';


// Configure Cloudinary (use environment variables - NEVER hardcode secrets)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadFile(formData: FormData) {
  console.log("got inside uploadFile in action.ts")
const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value; // Replace 'session_token' with your cookie name

  if (!token) {
    console.log("!token")
    return { success: false, error: 'Unauthorized to upload file' };
  }
   console.log("session verfied by cookies")
  const file = formData.get('file') as File;

  if (!file) {
    console.log(!file)
    return { success: false, error: 'No file provided' };
  }
  console.log("file was found correctly")

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Invalid file type only jpeg , png gif webp allowed' };
  }
  console.log("You've entered correct file format")
  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { success: false, error: 'File too large (max 5MB)' };
  }
 console.log("file sized")
  try {
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("buffer created")
// image processing with sharp : removing EXIF /metadata+ compress + optimize

 const image = sharp(buffer);
const metadata = await image.metadata();

const width = metadata.width || 1200;
const height = metadata.height || 1200;

// 2. Define top status bar crop ratio (e.g., crop out top 5% of height)
const topCropRatio = 0.05; 
const topCropPixels = Math.floor(height * topCropRatio);



const processedBuffer = await image
      .rotate()// Auto-correct orientation based on EXIF (then we'll strip it)
      .extract({
        left: 0,
        top: topCropPixels,
        width: width,
        height: height - topCropPixels,
      })
      .resize({
        width: 1200,      // Reasonable max width for web (adjust as needed)
        height: 1200,
        fit: 'inside',    // Preserve aspect ratio
        withoutEnlargement: true,
      })
      .jpeg({           // Convert to JPEG for best compression (or keep format)
        quality: 82,    // Good balance of quality/size
        mozjpeg: true,  // Better compression
      })  //by default it removes EXIF metadata
       

    const outputBuffer = await processedBuffer.toBuffer();

    // 4. Optional: Re-check size after processing
    if (outputBuffer.length > maxSize) {
      return { success: false, error: 'Processed file still too large' };
    }
    console.log("using sharp image EXIF removed and resized file")
    
    
    // Create unique filename
    const ext = path.extname(file.name) || 'jpg';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueName = `${baseName}-${crypto.randomUUID()}`;


    console.log("createding unique name" , uniqueName)
    // // Ensure upload directory exists
    // const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    // await mkdir(uploadDir, { recursive: true });

    // // Write file to disk
    // const filePath = path.join(uploadDir, uniqueName);
    // await writeFile(filePath, buffer);

    //uploading to cloud

const folderName = 'public/uploads';

    const uploadResult = await new Promise < {public_id:string}>((resolve, reject) =>{
      const uploadStream = cloudinary.uploader.upload_stream(
    {
      public_id: uniqueName,
      folder: folderName, // 'public/uploads'
      resource_type: 'image',
      type: 'authenticated',
      tags: ['user-upload'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
    (error, result) => {
      
      if (error || !result){
        console.log("error occured inside uploadResult sending fullpublicID" , error )
        return reject(error);
      } 
      if (!result) return reject(new Error("Upload succeeded but returned empty result"));
      resolve(result);
    }
  );

  uploadStream.end(outputBuffer);
    })
    

   // Get the uploaded result details (you may need to adjust based on SDK response)
    // For simplicity, we'll re-fetch or use known URL pattern
    // After successful upload
const signedUrl = cloudinary.url(uploadResult.public_id, {
  sign_url: true,
  expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
  resource_type: 'image',
  type: 'authenticated',
});
console.log('Cloudinary Saved Public ID:', uploadResult.public_id);
return {
  success: true,
  url: signedUrl,           // This is now time-limited
  publicId: uploadResult.public_id,
};
    
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Upload failed' };
  }
}