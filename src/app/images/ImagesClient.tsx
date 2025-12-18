"use client";

import { useMemo, useState } from "react";

type IdentifyOk = {
  ok: true;
  explanation: { what: string; use: string; role: string };
  disclaimer: string;
  confidence: "low" | "medium" | "high";
  cautions?: string[];
  model?: string;
  usedFallback?: boolean;
};

type IdentifyErr = { ok: false; error: string };

type IdentifyRes = IdentifyOk | IdentifyErr;

export default function ImagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyOk | null>(null);

  function onPick(f: File | null) {
    setResult(null);
    setError(null);
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  async function identify() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/images/identify", { method: "POST", body: fd });
      const data = (await res.json()) as IdentifyRes;
      if (!res.ok || !data.ok) {
        setError((data as IdentifyErr).error || `Request failed (${res.status})`);
        return;
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const confidenceStyle = useMemo(() => {
    const c = result?.confidence;
    if (c === "high") return "bg-emerald-600 text-white";
    if (c === "medium") return "bg-amber-500 text-white";
    return "bg-zinc-500 text-white";
  }, [result?.confidence]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <label htmlFor="img" className="block text-sm font-medium text-foreground">
              Image file
            </label>
            <input
              id="img"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-2 block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-medium file:text-background hover:file:opacity-90"
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <p className="mt-2 text-xs text-muted-foreground">JPEG, PNG, or WEBP. Up to 20MB (we compress on the server).</p>
          </div>
          <button
            type="button"
            disabled={!file || loading}
            onClick={identify}
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
          >
            {loading ? "Analyzing…" : "Identify"}
          </button>
        </div>
        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </div>
        ) : null}
      </section>

      {previewUrl ? (
        <section className="rounded-2xl border border-border bg-surface p-3 sm:p-4">
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <img src={previewUrl} alt="Selected preview" className="max-h-[360px] w-full object-contain" />
          </div>
        </section>
      ) : null}

      {result ? (
        <section className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Result</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {result.usedFallback ? <span>Using local fallback</span> : null}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">What it likely is</div>
              <p className="mt-2 text-sm leading-6 text-foreground/90">{result.explanation.what}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">What it’s used for</div>
              <p className="mt-2 text-sm leading-6 text-foreground/90">{result.explanation.use}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role in process</div>
              <p className="mt-2 text-sm leading-6 text-foreground/90">{result.explanation.role}</p>
            </div>
          </div>

          {result.cautions && result.cautions.length > 0 ? (
            <div className="mt-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cautions</div>
              <ul className="mt-2 space-y-2 text-sm text-foreground/85">
                {result.cautions.map((c, i) => (
                  <li key={i} className="rounded-lg border border-border bg-background p-3">{c}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-5 text-xs text-muted-foreground">{result.disclaimer}</p>
        </section>
      ) : null}
    </div>
  );
}
