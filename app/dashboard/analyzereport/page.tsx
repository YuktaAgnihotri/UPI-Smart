'use client';

import { useState } from 'react';
import { uploadFile } from './actions';
import { 
  Upload, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  TrendingDown, 
  Lightbulb, 
  IndianRupee, 
  CheckCircle2, 
  Save, 
  Zap, 
  Edit3 
} from "lucide-react";

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

  // return (
  //   <div className="p-8 max-w-4xl mx-auto">
  //     <h1 className="text-3xl font-bold mb-8">UPI Transaction Analyzer</h1>

  //     <form action={handleSubmit} className="mb-8">
  //       <input
  //         type="file"
  //         name="file"
  //         accept="image/*"
  //         required
  //         className="mb-4 block"
  //       />
  //       <button
  //         type="submit"
  //         className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
  //       >
  //         Upload Image
  //       </button>
  //     </form>

  //     <p className="mb-4 font-medium">{status}</p>

  //     {uploadedUrl && (
  //       <div className="mb-8 space-y-4">
  //         <p className="mb-2">Uploaded Image:</p>
  //         <img
  //           src={uploadedUrl}
  //           alt="Uploaded"
  //           className="max-w-md rounded-lg border"
  //         />

  //         <button
  //           onClick={() => analyzeImage(false)}
  //           disabled={analyzing}
  //           className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
  //         >
  //           {analyzing ? 'Analyzing...' : 'AI Analysis'}
  //         </button>

  //         {/* Notes + Re-analyze */}
  //         <div className="mt-6">
  //           <label className="block mb-2 font-medium">
  //             Add corrections / notes (optional)
  //           </label>
  //           <input
  //             type="text"
  //             placeholder="e.g. Rahul = kirana shop, Aunty = vegetable vendor"
  //             className="w-full bg-amber-50 border border-amber-200 p-3 rounded-xl"
  //             value={notes}
  //             onChange={(e) => setNotes(e.target.value)}
  //           />
  //           <button
  //             onClick={() => analyzeImage(true)}
  //             disabled={analyzing || !notes.trim()}
  //             className="mt-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
  //           >
  //             {analyzing ? 'Re-analyzing...' : 'Re-analyze with Notes'}
  //           </button>
  //         </div>
  //       </div>
  //     )}

  //     {analysis && (
  //       <div className="mt-8 p-6 bg-gray-50 rounded-2xl space-y-6">
  //         <h2 className="text-2xl font-bold">Analysis Result</h2>

  //         {/* Total Spent */}
  //         {analysis.summary && (
  //           <div className="bg-white p-4 rounded-xl">
  //             <p className="text-sm text-gray-500">Total Spent</p>
  //             <p className="text-3xl font-bold text-green-600">
  //               ₹{analysis.summary.totalSpent}
  //             </p>
  //           </div>
  //         )}

  //         {/* Transactions */}
  //         {analysis.transactions?.length > 0 && (
  //           <div>
  //             <h3 className="font-semibold mb-2">Transactions</h3>
  //             <div className="space-y-2">
  //               {analysis.transactions.map((t: any, i: number) => (
  //                 <div key={i} className="flex justify-between bg-white p-3 rounded-lg">
  //                   <div>
  //                     <p className="font-medium">{t.merchant}</p>
  //                     <p className="text-sm text-gray-500">{t.date} • {t.category}</p>
  //                   </div>
  //                   <p className="font-mono font-semibold">₹{t.amount}</p>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         )}

  //         {/* Insights */}
  //         {analysis.insights && (
  //           <div className="bg-white p-4 rounded-xl">
  //             <h3 className="font-semibold mb-2">Insights</h3>
  //             <p>{analysis.insights}</p>
  //           </div>
  //         )}

  //         {/* Suggestions */}
  //         {analysis.suggestions?.length > 0 && (
  //           <div className="bg-white p-4 rounded-xl">
  //             <h3 className="font-semibold mb-2">Suggestions</h3>
  //             <ul className="list-disc pl-5 space-y-1">
  //               {analysis.suggestions.map((s: string, i: number) => (
  //                 <li key={i}>{s}</li>
  //               ))}
  //             </ul>
  //           </div>
  //         )}

  //         {/* Saving Tips */}
  //         {analysis.savingTips?.length > 0 && (
  //           <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
  //             <h3 className="font-semibold mb-2 text-emerald-700">💰 Saving Tips</h3>
  //             <ul className="list-disc pl-5 space-y-1 text-emerald-800">
  //               {analysis.savingTips.map((tip: string, i: number) => (
  //                 <li key={i}>{tip}</li>
  //               ))}
  //             </ul>
  //           </div>
  //         )}
  //       </div>
  //     )}
  //     { analysis &&(
  //        <button onClick={sendToDb}  className='p-4 bg-green-500 rounded-2xl hover:bg-green-800'> 
  //       {finalResult ? " saving....": "save the result "}
  //     </button>
  //     )}
     
  //   </div>
  // );



  /* ==========================================================================
     (Keep all your existing state hooks and functions here above the return)
     e.g., const [status, setStatus] = useState(...); ...
     ========================================================================== */

  return (
    <div className="min-h-screen bg-[#070c09] text-slate-100 p-4 sm:p-8 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-b from-emerald-600/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title & Subtitle */}
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Receipt OCR & Expense Extraction</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text text-transparent">
            UPI Transaction Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Upload your UPI payment screenshot for private, instant AI-driven spending insights.
          </p>
        </div>

        {/* Upload Card / Form */}
        <div className="bg-[#0b130e] border border-emerald-800/40 rounded-2xl p-5 sm:p-8 shadow-2xl shadow-emerald-950/50 relative">
          <form action={handleSubmit} className="mb-4 space-y-4">
            <label className="block text-xs font-semibold text-emerald-200/90 tracking-wide uppercase">
              Select Receipt Screenshot
            </label>
            
            <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-emerald-800/60 group-hover:border-emerald-500/60 rounded-xl p-6 bg-[#0e1a12] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-emerald-400 group-hover:text-amber-400 transition-colors mb-2" />
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-slate-300 font-medium text-center">
                Click or drag & drop image here (GPay, PhonePe, Paytm, BHIM)
              </span>
              <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, or WEBP up to 10MB</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-900/40 hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Upload Image
            </button>
          </form>

          {/* Status Message */}
          {status && (
            <div className="mt-4 p-3 rounded-xl bg-[#0e1a12] border border-emerald-800/40 flex items-center gap-2 text-xs text-amber-300 font-mono">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{status}</span>
            </div>
          )}
        </div>

        {/* Uploaded Image & Analysis Action Card */}
        {uploadedUrl && (
          <div className="bg-[#0b130e] border border-emerald-800/40 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-emerald-200/90 tracking-wide uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Uploaded Receipt Preview
              </p>
              <div className="relative max-w-md overflow-hidden rounded-xl border border-emerald-800/50 bg-[#0e1a12]">
                <img
                  src={uploadedUrl}
                  alt="Uploaded"
                  className="w-full object-contain max-h-80 rounded-lg"
                />
              </div>

              <button
                onClick={() => analyzeImage(false)}
                disabled={analyzing}
                className="mt-4 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Run AI Analysis
                  </>
                )}
              </button>
            </div>

            {/* Notes + Re-analyze */}
            <div className="pt-6 border-t border-emerald-900/40 space-y-3">
              <label className="block text-xs font-semibold text-emerald-200/90 tracking-wide uppercase flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                Add corrections / notes (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul = kirana shop, Aunty = vegetable vendor"
                className="w-full bg-[#0e1a12] border border-emerald-800/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 p-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                onClick={() => analyzeImage(true)}
                disabled={analyzing || !notes.trim()}
                className="w-full sm:w-auto bg-[#14241a] hover:bg-[#1a3022] border border-emerald-700/60 disabled:opacity-50 text-emerald-200 hover:text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-emerald-200 border-t-transparent rounded-full animate-spin" />
                    Re-analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-400" /> Re-analyze with Notes
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ANALYSIS RESULT DISPLAY */}
        {analysis && (
          <div className="p-5 sm:p-8 bg-[#0b130e] border border-emerald-800/50 rounded-2xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Analysis Result
              </h2>
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/50">
                Verified Engine
              </span>
            </div>

            {/* Total Spent */}
            {analysis.summary && (
              <div className="bg-[#0e1a12] border border-emerald-800/40 p-4 sm:p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400/80">Total Spent</p>
                  <p className="text-2xl sm:text-4xl font-extrabold text-white mt-1 flex items-center">
                    <IndianRupee className="w-6 h-6 text-amber-400" />
                    {analysis.summary.totalSpent}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-amber-400">
                  <IndianRupee className="w-6 h-6" />
                </div>
              </div>
            )}

            {/* Transactions List */}
            {analysis.transactions?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-emerald-200/90">Transactions</h3>
                <div className="space-y-2">
                  {analysis.transactions.map((t: any, i: number) => (
                    <div 
                      key={i} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0e1a12] border border-emerald-900/60 p-3.5 rounded-xl gap-2 hover:border-emerald-700/50 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-sm text-white">{t.merchant}</p>
                        <p className="text-xs text-slate-400">{t.date} • <span className="text-amber-300">{t.category}</span></p>
                      </div>
                      <p className="font-mono font-extrabold text-emerald-400 text-sm sm:text-base">
                        ₹{t.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {analysis.insights && (
              <div className="bg-[#0e1a12] border border-emerald-800/40 p-4 rounded-xl space-y-1.5">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Insights
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{analysis.insights}</p>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions?.length > 0 && (
              <div className="bg-[#0e1a12] border border-emerald-800/40 p-4 rounded-xl space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Suggestions</h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {analysis.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-1">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Saving Tips */}
            {analysis.savingTips?.length > 0 && (
              <div className="bg-emerald-950/40 border border-emerald-700/50 p-4 rounded-xl space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-300 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-amber-400" /> Saving Tips
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-200">
                  {analysis.savingTips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Save Result Button */}
        {analysis && (
          <div className="flex justify-end pt-2">
            <button
              onClick={sendToDb}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-900/40 hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {finalResult ? "Saving..." : "Save Result to Private Database"}
            </button>
          </div>
        )}

        {/* Privacy Note Footer */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>All screenshot processing runs on an isolated server. No data is shared with 3rd parties.</span>
        </div>

      </div>
    </div>
  );
}
