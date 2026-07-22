// app/upload/page.tsx
'use client';

import { useState } from 'react';
import { uploadFile } from './actions';

export default function UploadPage() {
  const [status, setStatus] = useState<string>('');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  async function handleSubmit(formData: FormData) {
    setStatus('Uploading...');

    const result = await uploadFile(formData);

    if (result.success) {
      setStatus('Upload complete!');
      // result.url may be undefined, ensure we always set a string
      setUploadedUrl(result.url ?? '');
    } else {
      setStatus(`Error: ${result.error}`);
    }
  }

  return (
    <div>
      <h1 className='text-2xl font-black'>File Upload</h1>

      <form action={handleSubmit}>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
        />
        <button type="submit" className='bg-green-500 rounded-2xl p-4'>Upload</button>
      </form>

      <p>{status}</p>

      {uploadedUrl && (
        <div>
          <p>Uploaded file:</p>
          <img src={uploadedUrl} alt="Uploaded" className='w-3/4 align-middle'/>
        </div>
      )}
    </div>
  );
}