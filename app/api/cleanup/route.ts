// imports

//cloudinary config

//check if secret token present and authorized

//connect to db 
//set variable with time now - 24 hr
// check with db if the record is created more than 24hr ago 
//use cloudinary.uploader.destroy image from cloudinary and inc delcount++
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import Media from '@/app/models/media';
import { connectToDatabase } from '@/lib/dbConnect';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request) {
  // Protect the route
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const oldMedia = await Media.find({
      createdAt: { $lt: twentyFourHoursAgo },
    });

    let deletedCount = 0;

    for (const media of oldMedia) {
      await cloudinary.uploader.destroy(media.publicId, {
        resource_type: 'image',
      });
      deletedCount++;
    }

    await Media.deleteMany({
      createdAt: { $lt: twentyFourHoursAgo },
    });

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      message: `Deleted ${deletedCount} old files`,
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}  