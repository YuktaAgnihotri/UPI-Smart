// node cron job scheduler is used to automate repetative tasks and perform system maintenance
//here we are using it to delete cloduniary storage files after 24 hours

import cron from 'node-cron';
import cloudinary from 'cloudinary';
import Media from '@/app/models/media';

export function startCleanupJob() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🧹 Starting Cloudinary cleanup job...');

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const oldFiles = await Media.find({ createdAt: { $lt: oneDayAgo } }); //$lt checks less than

      for (const file of oldFiles) {
        await cloudinary.v2.uploader.destroy(file.publicId, {
          resource_type: 'image',
        });
        console.log(`✅ Deleted from Cloudinary: ${file.publicId}`);
      }

      // Delete old records from DB
      await Media.deleteMany({ createdAt: { $lt: oneDayAgo } });

    } catch (error) {
      console.error('Cleanup job failed:', error);
    }
  });
}