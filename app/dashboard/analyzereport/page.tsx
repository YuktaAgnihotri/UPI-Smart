'use client';

import { useState } from 'react';
import { uploadFile } from './actions';

export default function UploadPage() {
  const [status, setStatus] = useState<string>('');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [finalResult , setfinalResult] = useState<boolean>(false)
 
  async function handleSubmit(formData: FormData) {
    setStatus('Uploading...');
    setAnalysis(null);

    const result = await uploadFile(formData);

    if (result.success && result.url) {
      setStatus('Upload complete!');
      setUploadedUrl(result.url);
    } else {
      setStatus(`Error: ${result.error || 'Upload failed'}`);
    }
  }

  async function analyzeImage(withNotes = false) {
    if (!uploadedUrl) return;

    setAnalyzing(true);
    setStatus(withNotes ? 'Re-analyzing with your notes...' : 'Analyzing with AI...');

    try {
      const response = await fetch(uploadedUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result as string;

        const res = await fetch('/api/geminianalysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64data,
            notes: withNotes ? notes : '',
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setAnalysis(data);
          setStatus('Analysis complete!');
        } else {
          setStatus(`Analysis failed: ${data.error}`);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      setStatus('Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  }
  async function sendToDb() {
  if (!analysis) {
    setStatus('No analysis data to save');
    return;
  }

  setfinalResult(true); // show "saving...."

  try {
    const res = await fetch('/api/sendanalysistodb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactions: analysis.transactions,
        summary: analysis.summary,
        insights: analysis.insights,
        suggestions: analysis.suggestions || [],
        savingTips: analysis.savingTips || [],
        userNotes: notes || null,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      setStatus('Analysis saved successfully!');
      console.log('Saved:', result);
    } else {
      setStatus(`Failed to save: ${result.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(error);
    setStatus('Failed to save analysis');
  } finally {
    setfinalResult(false);
  }
}

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">UPI Transaction Analyzer</h1>

      <form action={handleSubmit} className="mb-8">
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="mb-4 block"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Upload Image
        </button>
      </form>

      <p className="mb-4 font-medium">{status}</p>

      {uploadedUrl && (
        <div className="mb-8 space-y-4">
          <p className="mb-2">Uploaded Image:</p>
          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="max-w-md rounded-lg border"
          />

          <button
            onClick={() => analyzeImage(false)}
            disabled={analyzing}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
          >
            {analyzing ? 'Analyzing...' : 'AI Analysis'}
          </button>

          {/* Notes + Re-analyze */}
          <div className="mt-6">
            <label className="block mb-2 font-medium">
              Add corrections / notes (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul = kirana shop, Aunty = vegetable vendor"
              className="w-full bg-amber-50 border border-amber-200 p-3 rounded-xl"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              onClick={() => analyzeImage(true)}
              disabled={analyzing || !notes.trim()}
              className="mt-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
            >
              {analyzing ? 'Re-analyzing...' : 'Re-analyze with Notes'}
            </button>
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl space-y-6">
          <h2 className="text-2xl font-bold">Analysis Result</h2>

          {/* Total Spent */}
          {analysis.summary && (
            <div className="bg-white p-4 rounded-xl">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{analysis.summary.totalSpent}
              </p>
            </div>
          )}

          {/* Transactions */}
          {analysis.transactions?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Transactions</h3>
              <div className="space-y-2">
                {analysis.transactions.map((t: any, i: number) => (
                  <div key={i} className="flex justify-between bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{t.merchant}</p>
                      <p className="text-sm text-gray-500">{t.date} • {t.category}</p>
                    </div>
                    <p className="font-mono font-semibold">₹{t.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {analysis.insights && (
            <div className="bg-white p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Insights</h3>
              <p>{analysis.insights}</p>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions?.length > 0 && (
            <div className="bg-white p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Suggestions</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.suggestions.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Saving Tips */}
          {analysis.savingTips?.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 text-emerald-700">💰 Saving Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-emerald-800">
                {analysis.savingTips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      { analysis &&(
         <button onClick={sendToDb}  className='p-4 bg-green-500 rounded-2xl hover:bg-green-800'> 
        {finalResult ? " saving....": "save the result "}
      </button>
      )}
     
    </div>
  );
}