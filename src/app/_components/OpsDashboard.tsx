"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

type NumericStats = {
	count: number;
	min: number;
	max: number;
	mean: number;
};

type OpsAnalyzeOk = {
	ok: true;
	preview: {
		columns: string[];
		rowCount: number;
		sampleRows: Record<string, string>[];
	};
	stats: {
		missingByColumn: Record<string, number>;
		numericByColumn: Record<string, NumericStats>;
	};
	ai: {
		summary: string;
		findings: string[];
		takeaways: string[];
		model?: string;
		usedFallback?: boolean;
	};
};

type OpsAnalyzeErr = { ok: false; error: string };

type OpsAnalyzeResponse = OpsAnalyzeOk | OpsAnalyzeErr;

export function OpsDashboard() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<OpsAnalyzeOk | null>(null);

	// Full CSV view (client-side parsed)
	const [parsing, setParsing] = useState(false);
	const [fullColumns, setFullColumns] = useState<string[] | null>(null);
	const [fullRows, setFullRows] = useState<Record<string, string>[] | null>(
		null,
	);

	// Collapsible sections state
	const [open, setOpen] = useState({
		preview: false,
		insights: true,
		full: false,
		stats: false,
	});
	function toggle(section: keyof typeof open) {
		setOpen((s) => ({ ...s, [section]: !s[section] }));
	}

	const Chevron = ({ open }: { open: boolean }) => (
		<svg
			aria-hidden="true"
			className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
				open ? "rotate-180" : "rotate-0"
			}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M6 9l6 6 6-6" />
		</svg>
	);

	const sampleColumns = useMemo(() => {
		if (!result) return [];
		return result.preview.columns;
	}, [result]);

	// Parse the CSV on the client to render a full table without sending all rows to the server
	useEffect(() => {
		let cancelled = false;
		async function parseClientSide(f: File) {
			setParsing(true);
			try {
				const text = await f.text();
				const parsed = Papa.parse<Record<string, unknown>>(text, {
					header: true,
					skipEmptyLines: true,
				});

				const cols = (parsed.meta.fields ?? []).filter(
					(c: string | undefined | null): c is string =>
						typeof c === "string" && c.trim() !== "",
				);
				const rows = (parsed.data ?? []).filter(
					(
						r: Record<string, unknown> | undefined | null,
					): r is Record<string, unknown> =>
						!!r && Object.keys(r).length > 0,
				);

				const normalized = rows.map((r) => {
					const out: Record<string, string> = {};
					for (const c of cols)
						out[c] =
							r[c] === null || r[c] === undefined
								? ""
								: String(r[c]);
					return out;
				});

				if (!cancelled) {
					setFullColumns(cols);
					setFullRows(normalized);
				}
			} catch (e) {
				if (!cancelled) {
					// Do not surface as error for analysis; just show inline message
					setFullColumns(null);
					setFullRows(null);
				}
			} finally {
				if (!cancelled) setParsing(false);
			}
		}

		if (file) {
			setFullColumns(null);
			setFullRows(null);
			parseClientSide(file);
		} else {
			setFullColumns(null);
			setFullRows(null);
		}

		return () => {
			cancelled = true;
		};
	}, [file]);

	async function analyze() {
		if (!file) return;
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/ops/analyze", {
				method: "POST",
				body: formData,
			});

			const data = (await res.json()) as OpsAnalyzeResponse;

			if (!res.ok || !data.ok) {
				setError(
					(data as OpsAnalyzeErr).error ||
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

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8">
			<header className="space-y-2">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					Operations Overview Dashboard
				</h1>
				<p className="max-w-3xl text-sm leading-6 text-muted-foreground">
					Upload a CSV and get a plain-English summary, unusual
					findings, and the top 3 takeaways. Only a small sample and
					computed stats are sent to AI.
				</p>
			</header>

			<section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex-1">
						<label
							htmlFor="csv"
							className="block text-sm font-medium text-foreground"
						>
							CSV file
						</label>
						<input
							id="csv"
							type="file"
							accept=".csv,text/csv"
							className="mt-2 block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-medium file:text-background hover:file:opacity-90"
							onChange={(e) =>
								setFile(e.target.files?.[0] ?? null)
							}
						/>
						<p className="mt-2 text-xs text-muted-foreground">
							Tip: If you don’t have a CSV yet, export a
							spreadsheet as CSV.
						</p>
					</div>

					<button
						type="button"
						disabled={!file || loading}
						onClick={analyze}
						className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
					>
						{loading ? "Analyzing…" : "Analyze CSV"}
					</button>
				</div>

				{error ? (
					<div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200">
						{error}
					</div>
				) : null}
			</section>

			{result ? (
				<div className="mt-8 grid gap-6">
					{/* Highlights summary from API response */}
					<section className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
						<h2 className="text-lg font-semibold text-foreground">Highlights</h2>
						<div className="mt-3 grid gap-4 sm:grid-cols-3">
							<div className="rounded-xl border border-border bg-background p-4">
								<div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Main points</div>
								<p className="mt-2 text-sm leading-6 text-foreground/90">{result.ai.summary}</p>
							</div>
							<div className="rounded-xl border border-border bg-background p-4">
								<div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Important / unusual</div>
								<ul className="mt-2 space-y-2 text-sm text-foreground/90">
									{result.ai.findings.slice(0, 3).map((f, i) => (
										<li key={i} className="flex gap-2">
											<span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/70" />
											<span>{f}</span>
										</li>
									))}
								</ul>
							</div>
							<div className="rounded-xl border border-border bg-background p-4">
								<div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Top 3 to watch</div>
								<ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-foreground/90">
									{result.ai.takeaways.slice(0, 3).map((t, i) => (
										<li key={i}>{t}</li>
									))}
								</ol>
							</div>
						</div>
					</section>
					<section className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
						<button
							type="button"
							className="flex w-full items-center justify-between gap-3"
							onClick={() => toggle("preview")}
							aria-expanded={open.preview}
						>
							<span className="text-lg font-semibold text-foreground">Preview</span>
							<Chevron open={open.preview} />
						</button>
						<div className={open.preview ? "mt-3 grid gap-4 sm:grid-cols-2" : "mt-3 hidden sm:grid-cols-2"}>
							<div className="rounded-xl border border-border p-4">
								<div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
									Rows
								</div>
								<div className="mt-1 text-2xl font-semibold text-foreground">
									{result.preview.rowCount}
								</div>
							</div>
							<div className="rounded-xl border border-border p-4">
								<div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
									Columns
								</div>
								<div className="mt-2 flex flex-wrap gap-2">
									{result.preview.columns
										.slice(0, 12)
										.map((c) => (
											<span
												key={c}
												className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-foreground/80"
											>
												{c}
											</span>
										))}
									{result.preview.columns.length > 12 ? (
										<span className="text-xs text-muted-foreground">
											+
											{result.preview.columns.length - 12}{" "}
											more
										</span>
									) : null}
								</div>
							</div>
						</div>

						<div className={open.preview ? "mt-6" : "mt-6 hidden"}>
							<h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
								Sample rows
							</h3>
							<div className="mt-2 overflow-auto rounded-xl border border-border">
								<table className="min-w-full text-left text-sm">
									<thead className="bg-background text-xs text-muted-foreground">
										<tr>
											{sampleColumns
												.slice(0, 8)
												.map((c) => (
													<th
														key={c}
														className="whitespace-nowrap px-3 py-2"
													>
														{c}
													</th>
												))}
										</tr>
									</thead>
									<tbody className="divide-y divide-border/60">
										{result.preview.sampleRows.map(
											(row, idx) => (
												<tr
													key={idx}
													className="text-foreground/90"
												>
													{sampleColumns
														.slice(0, 8)
														.map((c) => (
															<td
																key={c}
																className="whitespace-nowrap px-3 py-2"
															>
																{row[c] || "—"}
															</td>
														))}
												</tr>
											),
										)}
									</tbody>
								</table>
							</div>
							<p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
								Showing up to 8 columns and 5 rows.
							</p>
						</div>
					</section>

					<section className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
						<button
							type="button"
							className="flex w-full items-center justify-between gap-3"
							onClick={() => toggle("insights")}
							aria-expanded={open.insights}
						>
							<span className="text-lg font-semibold text-foreground">AI Insights</span>
							<span className="flex items-center gap-3">
								{result.ai.usedFallback ? (
									<span className="text-xs font-medium text-muted-foreground">
										Using local fallback (set OPENAI_API_KEY to enable AI)
									</span>
								) : result.ai.model ? (
									<span className="text-xs font-medium text-muted-foreground">
										Model: {result.ai.model}
									</span>
								) : null}
								<Chevron open={open.insights} />
							</span>
						</button>

						<div className={open.insights ? "mt-3" : "mt-3 hidden"}>
							<div className="rounded-xl border border-border bg-background p-4 text-sm text-foreground/90">
								{result.ai.summary}
							</div>

							<div className="mt-5 grid gap-6 sm:grid-cols-2">
								<div>
									<h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
										Important / unusual findings
									</h3>
									<ul className="mt-2 space-y-2 text-sm text-foreground/85">
										{result.ai.findings.map((f, i) => (
											<li
												key={i}
												className="rounded-lg border border-border p-3"
											>
												{f}
											</li>
										))}
									</ul>
								</div>

								<div>
									<h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
										Top 3 takeaways
									</h3>
									<ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-foreground/85">
										{result.ai.takeaways.map((t, i) => (
											<li key={i}>{t}</li>
										))}
									</ol>
								</div>
							</div>
						</div>
					</section>

					{/* Full CSV (client-side preview) */}
					<section className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
						<button
							type="button"
							className="flex w-full items-center justify-between gap-3"
							onClick={() => toggle("full")}
							aria-expanded={open.full}
						>
							<span className="text-lg font-semibold text-foreground">Full CSV</span>
							<span className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
								{parsing
									? "Parsing…"
									: fullRows
										? `${fullRows.length} rows`
										: file
											? ""
											: "Upload a CSV to preview all rows"}
								<Chevron open={open.full} />
							</span>
						</button>

						<div className={open.full ? "mt-3" : "mt-3 hidden"}>
							<div className="max-h-[480px] overflow-auto rounded-xl border border-border bg-background scroll-area">
								{fullColumns && fullRows ? (
									<table className="min-w-full text-left text-sm">
										<thead className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur text-xs text-muted-foreground">
											<tr>
												{fullColumns.map((c) => (
													<th
														key={c}
														className="whitespace-nowrap px-3 py-2"
													>
														{c}
													</th>
												))}
											</tr>
										</thead>
										<tbody className="divide-y divide-border/60">
											{fullRows.map((row, idx) => (
												<tr
													key={idx}
													className="text-foreground/90"
												>
													{fullColumns.map((c) => (
														<td
															key={c}
															className="whitespace-nowrap px-3 py-2"
														>
															{row[c] || "—"}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								) : (
									<div className="p-6 text-center text-sm text-muted-foreground">
										{parsing ? "Parsing CSV…" : "No CSV parsed yet."}
									</div>
								)}
							</div>
							{fullRows &&
							result?.preview.rowCount &&
							fullRows.length < result.preview.rowCount ? (
								<p className="mt-2 text-xs text-muted-foreground">
									Showing {fullRows.length.toLocaleString()} of {result.preview.rowCount.toLocaleString()} rows.
								</p>
							) : null}
						</div>
					</section>

					<section className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
						<button
							type="button"
							className="flex w-full items-center justify-between gap-3"
							onClick={() => toggle("stats")}
							aria-expanded={open.stats}
						>
							<span className="text-lg font-semibold text-foreground">Computed stats (for transparency)</span>
							<Chevron open={open.stats} />
						</button>

						<div className={open.stats ? "mt-4 grid gap-6 sm:grid-cols-2" : "mt-4 hidden sm:grid-cols-2"}>
							<div>
								<h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
									Missing values per column
								</h3>
								<div className="mt-2 overflow-auto rounded-xl border border-border">
									<table className="min-w-full text-left text-sm">
										<thead className="bg-background text-xs text-muted-foreground">
											<tr>
												<th className="px-3 py-2">
													Column
												</th>
												<th className="px-3 py-2">
													Missing
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-border/60">
											{Object.entries(
												result.stats.missingByColumn,
											)
												.sort((a, b) => b[1] - a[1])
												.slice(0, 12)
												.map(([col, count]) => (
													<tr
														key={col}
														className="text-foreground/90"
													>
														<td className="px-3 py-2">
															{col}
														</td>
														<td className="px-3 py-2">
															{count}
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									Showing top 12 columns by missing count.
								</p>
							</div>

							<div>
								<h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
									Numeric min / max / mean
								</h3>
								<div className="mt-2 overflow-auto rounded-xl border border-border">
									<table className="min-w-full text-left text-sm">
										<thead className="bg-background text-xs text-muted-foreground">
											<tr>
												<th className="px-3 py-2">
													Column
												</th>
												<th className="px-3 py-2">
													Min
												</th>
												<th className="px-3 py-2">
													Max
												</th>
												<th className="px-3 py-2">
													Mean
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-border/60">
											{Object.entries(
												result.stats.numericByColumn,
											)
												.sort(
													(a, b) =>
														b[1].count - a[1].count,
												)
												.slice(0, 12)
												.map(([col, s]) => (
													<tr
														key={col}
														className="text-foreground/90"
													>
														<td className="px-3 py-2">
															{col}
														</td>
														<td className="px-3 py-2">
															{s.min}
														</td>
														<td className="px-3 py-2">
															{s.max}
														</td>
														<td className="px-3 py-2">
															{Number(
																s.mean.toFixed(
																	2,
																),
															)}
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									Only columns with detected numeric values
									are shown.
								</p>
							</div>
						</div>
					</section>
				</div>
			) : null}
		</div>
	);
}
