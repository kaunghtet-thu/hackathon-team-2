'use client';

import { useState } from 'react';

export default function AudioTranscriber() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    transcription: string;
    summary: string;
    analysis: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to transcribe audio');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while transcribing the audio');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-slate-50 flex items-start justify-center pt-16 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Audio Transcriber
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="audio"
            className="block text-sm font-semibold text-slate-800 mb-2"
          >
            Upload Audio File
          </label>

          <input
            type="file"
            id="audio"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="
              block w-full text-sm text-slate-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200
            "
          />
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="
            w-full py-2.5 px-4 rounded-md
            font-semibold text-white
            bg-blue-600 hover:bg-blue-700
            disabled:bg-slate-300 disabled:text-slate-600
            disabled:cursor-not-allowed
            transition
          "
        >
          {loading ? 'Transcribing…' : 'Transcribe Audio'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Transcription
            </h2>
            <p className="text-slate-800 leading-relaxed">
              {result.transcription}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Summary
            </h2>
            <p className="text-slate-800 leading-relaxed">
              {result.summary}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Analysis
            </h2>
            <p className="text-slate-800 leading-relaxed">
              {result.analysis}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

}
