import mongoose from 'mongoose'


const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    console.log("mongodb uri do not exsits");
  throw new Error('Please define MONGODB_URI in your environment variables.');
}

let cached = (global as any).mongoose;

if (!cached) {
    console.log("no cache found");
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  console.log("db connect called");
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  console.log("db connect passed successfully")
  return cached.conn;
}