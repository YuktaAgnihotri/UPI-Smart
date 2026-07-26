import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedia extends Document {
  userId: string;
  hash: string;
  publicId: string;
  url: string;
  filename: string;
  format: string;
  size: number;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true, // Speeds up queries by user
    },
    hash: {
      type: String,
      required: true,
      unique: true, // Enforces unique file hashes across the DB
      index: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      default: 'jpg',
    },
    size: {
      type: Number, // File size in bytes
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// =========== TTL index ============//
MediaSchema.index(
  {"createdAt"  : 1},
   { expireAfterSeconds: 24 * 60 * 60 } //24 hr
)


// Prevent re-compiling model in Next.js hot-reloading
const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;