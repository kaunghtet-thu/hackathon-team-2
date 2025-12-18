"use client";

import { useRef, useState } from "react";

type DocsAnalyzeOk = {
  ok: true;
  ai: {
    summary: string;
    keyPoints: string[];
    actions: string[];
    model?: string;
  };
};

type DocsAnalyzeErr = {
  ok: false;
  error: string;
};

type DocsAnalyzeResponse = DocsAnalyzeOk | DocsAnalyzeErr;

export default function DocsInterpreter() {
  const [text, setText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocsAnalyzeOk | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [converted, setConverted] = useState<string | null>(null);
  const [convertLoading, setConvertLoading] = useState(false);


  async function onPickFile(file: File | null) {
    if (!file) return;

    const isText =
      file.type === "text/plain" ||
      file.name.toLowerCase().endsWith(".txt") ||
      file.name.toLowerCase().endsWith(".log") ||
      file.name.toLowerCase().endsWith(".md");

    if (!isText) {
      setError("Please upload a text file (.txt, .log, .md).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setError(null);
      const content = await file.text();
      setText(content);
      setUploadedFileName(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to read file");
    }
  }

  function clearInput() {
    setText("");
    setUploadedFileName(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function analyze() {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
	setConverted(null);


    try {
      const res = await fetch("/api/docs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = (await res.json()) as DocsAnalyzeResponse;

      if (!res.ok || !data.ok) {
        setError(
          (data as DocsAnalyzeErr).error ||
            `Request failed with status ${res.status}`,
        );
        return;
      }

      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

	async function convert(mode: "email" | "manager") {
	if (!text.trim()) return;

	setConvertLoading(true);
	setConverted(null);

	try {
		const res = await fetch("/api/docs/analyze", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text, mode }),
		});

		const data = await res.json();

		if (!res.ok || !data.output) {
		throw new Error("Conversion failed");
		}

		setConverted(data.output);
	} catch {
		setConverted("Failed to generate content.");
	} finally {
		setConvertLoading(false);
	}
	}


  return (
	    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Semiconductor Document Interpreter
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Paste a short semiconductor-related message and receive a
          plain-English summary, key points, and suggested follow-up actions.
        </p>
      </header>

      {/* Input */}
	      <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-6">
	        <label className="block text-sm font-medium text-foreground">
	          Work message
	        </label>

	        <div className="mt-3 flex flex-wrap items-center gap-3">
	          <input
	            ref={fileInputRef}
	            type="file"
	            accept=".txt,.log,.md,text/plain"
	            className="hidden"
	            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
	          />
	          <button
	            type="button"
	            onClick={() => fileInputRef.current?.click()}
	            disabled={loading}
	            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted"
	          >
	            Upload text file
	          </button>
	          {uploadedFileName ? (
	            <div className="text-sm text-muted-foreground">
	              Using: {uploadedFileName}
	            </div>
	          ) : (
	            <div className="text-sm text-muted-foreground">
	              or paste text below
	            </div>
	          )}
	          <button
	            type="button"
	            onClick={clearInput}
	            disabled={loading || (!text && !uploadedFileName)}
	            className="ml-auto inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted"
	          >
	            Clear
	          </button>
	        </div>
	        <textarea
	          rows={6}
	          value={text}
	          onChange={(e) => setText(e.target.value)}
          placeholder="Example: Tool PM completed at Bay 3, wafer lot W234 held for QA review..."
          className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />

	        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={analyze}
            disabled={!text.trim() || loading}
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
          >
            {loading ? "Analyzing…" : "Interpret Message"}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
      </section>

      {/* Results */}
      {result ? (
        <section className="mt-8 grid gap-6">
          <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="mt-3 rounded-xl border border-border bg-background p-4 text-sm">
              {result.ai.summary}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
              <h2 className="text-lg font-semibold">Key Points</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {result.ai.keyPoints.map((p, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-border p-3"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
              <h2 className="text-lg font-semibold">Suggested Actions</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {result.ai.actions.length > 0 ? (
                  result.ai.actions.map((a, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-border p-3"
                    >
                      {a}
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">
                    No immediate action required.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
		{/* Convert Message */}
		{result ? (
		<section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-6">
			<h2 className="text-lg font-semibold">Convert Message</h2>

			<div className="mt-4 flex flex-wrap gap-3">
			<button
				onClick={() => convert("email")}
				disabled={convertLoading}
				className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
			>
				{convertLoading ? "Generating…" : "Convert to Professional Email"}
			</button>

			<button
				onClick={() => convert("manager")}
				disabled={convertLoading}
				className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-background disabled:opacity-50"
			>
				{convertLoading ? "Generating…" : "Manager-Friendly Update"}
			</button>
			</div>

			{converted && (
			<div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm whitespace-pre-line">
				{converted}
			</div>
			)}
		</section>
		) : null}

    </div>
  );
}

