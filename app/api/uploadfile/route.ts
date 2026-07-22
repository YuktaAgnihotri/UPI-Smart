import { NextResponse } from "next/server";
import fs from "node:fs/promises"
import { revalidatePath } from "next/cache";


export async function POST(req:Request) {
      
      try {
        console.log("inside upload file");
        // derive data from frontend
        const formData = await req.formData();
        
        // validating that the data is file  and of jpeg type
           const file = await formData.get("file") as File;
           const arrayBuffer = await  file.arrayBuffer(); //storage space for file in  raw binary form
           const buffer =  new Uint8Array(arrayBuffer);  //this is 8bit unsigned int array .If the content is empty it selfassgines 0 to precent sitecrash.
           //It is a typed array ie an array that has binary data buffer.
           
           
            // create cloudinary URL 

            //store cloudinary URL to mongodb
           await fs.writeFile(`/public/uploads/${file.name}` , buffer);           




      } catch (error) {
        
      }
}