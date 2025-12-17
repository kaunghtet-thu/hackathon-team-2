import Papa from "papaparse";

export const runtime = "nodejs";

type NumericStats = {
	count: number;
	min: number;
	max: number;
	mean: number;
};

type OpsAiResult = {
	summary: string;
	findings: string[];
	takeaways: string[];
	model?: string;
	usedFallback?: boolean;
};

type OpsAnalyzeResponse =
	| {
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
			ai: OpsAiResult;
	  }
	| {
			ok: false;
			error: string;
	  };

function isMissing(value: unknown): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === "string") return value.trim() === "";
	return false;
}

function toNumberIfNumeric(value: unknown): number | null {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	if (trimmed === "") return null;
	const normalized = trimmed.replace(/,/g, "");
	const parsed = Number(normalized);
	if (!Number.isFinite(parsed)) return null;
	return parsed;
}

function computeNumericStats(values: number[]): NumericStats {
	let min = values[0];
	let max = values[0];
	let sum = 0;
	for (const v of values) {
		if (v < min) min = v;
		if (v > max) max = v;
		sum += v;
	}
	return {
		count: values.length,
		min,
		max,
		mean: sum / values.length,
	};
}

function fallbackAiFromStats(input: {
	columns: string[];
	rowCount: number;
	missingByColumn: Record<string, number>;
	numericByColumn: Record<string, NumericStats>;
}): OpsAiResult {
	const missingSorted = Object.entries(input.missingByColumn)
		.filter(([, count]) => count > 0)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3);

	const numericCols = Object.entries(input.numericByColumn)
		.sort((a, b) => b[1].count - a[1].count)
		.slice(0, 3);

	const findings: string[] = [];

	if (missingSorted.length > 0) {
		findings.push(
			`Missing values detected (top columns): ${missingSorted
				.map(([col, c]) => `${col} (${c})`)
				.join(", ")}.`,
		);
	} else {
		findings.push("No missing values detected in the parsed rows.");
	}

	if (numericCols.length > 0) {
		for (const [col, stats] of numericCols) {
			findings.push(
				`${col}: min=${stats.min}, max=${stats.max}, mean=${Number(stats.mean.toFixed(2))} (n=${stats.count}).`,
			);
		}
	} else {
		findings.push(
			"No numeric columns were confidently detected, so numeric stats are limited.",
		);
	}

	const takeaways: string[] = [
		`Dataset has ${input.rowCount} rows across ${input.columns.length} columns.`,
		missingSorted.length > 0
			? "Review columns with missing data before drawing conclusions."
			: "Data completeness looks good at a glance.",
		numericCols.length > 0
			? "Check the numeric ranges for outliers or unexpected values."
			: "If you expected numbers, confirm the CSV uses consistent numeric formatting.",
	];

	return {
		summary:
			"AI is not configured (missing OPENAI_API_KEY), so this is a basic local summary from computed statistics.",
		findings,
		takeaways,
		usedFallback: true,
	};
}

async function callOpenAiForOpsInsights(args: {
	columns: string[];
	rowCount: number;
	missingByColumn: Record<string, number>;
	numericByColumn: Record<string, NumericStats>;
	sampleRows: Record<string, string>[];
}): Promise<OpsAiResult> {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		return fallbackAiFromStats(args);
	}

	const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

	const promptPayload = {
		columns: args.columns,
		rowCount: args.rowCount,
		missingByColumn: args.missingByColumn,
		numericByColumn: args.numericByColumn,
		sampleRows: args.sampleRows,
	};

	const system =
		"You are an AI assistant for new and non-technical employees. " +
		"Given ONLY computed CSV statistics and a tiny sample of rows, produce a clear, beginner-friendly analysis. " +
		"Avoid speculation and keep it workplace-appropriate.";

	const user =
		"Return ONLY valid JSON with this exact shape:\n" +
		'{\n  "summary": string,\n  "findings": string[],\n  "takeaways": string[]\n}\n\n' +
		"Rules:\n" +
		"- summary: 2-4 sentences, plain English.\n" +
		"- findings: 3-7 bullets as strings; call out unusual patterns, missing data hotspots, outliers/ranges for numeric columns.\n" +
		"- takeaways: exactly 3 items, actionable and simple.\n\n" +
		"Input:\n" +
		JSON.stringify(promptPayload);

	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model,
			temperature: 0.2,
			response_format: { type: "json_object" },
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: user },
			],
		}),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		return {
			...fallbackAiFromStats(args),
			summary:
				`OpenAI request failed (${res.status}). Showing a local summary instead.` +
				(text ? ` Details: ${text.slice(0, 200)}` : ""),
			model,
			usedFallback: true,
		};
	}

	const data = (await res.json()) as {
		choices?: Array<{ message?: { content?: string } }>;
	};

	const content = data.choices?.[0]?.message?.content;
	if (!content) {
		return {
			...fallbackAiFromStats(args),
			summary:
				"OpenAI returned an empty response. Showing a local summary instead.",
			model,
			usedFallback: true,
		};
	}

	try {
		const parsed = JSON.parse(content) as {
			summary?: unknown;
			findings?: unknown;
			takeaways?: unknown;
		};

		const summary =
			typeof parsed.summary === "string" ? parsed.summary : null;
		const findings = Array.isArray(parsed.findings)
			? parsed.findings.filter((x): x is string => typeof x === "string")
			: null;
		const takeaways = Array.isArray(parsed.takeaways)
			? parsed.takeaways.filter((x): x is string => typeof x === "string")
			: null;

		if (!summary || !findings || !takeaways || takeaways.length !== 3) {
			return {
				...fallbackAiFromStats(args),
				summary:
					"OpenAI returned JSON but it didn’t match the expected shape. Showing a local summary instead.",
				model,
				usedFallback: true,
			};
		}

		return { summary, findings, takeaways, model };
	} catch {
		return {
			...fallbackAiFromStats(args),
			summary:
				"OpenAI returned non-JSON output. Showing a local summary instead.",
			model,
			usedFallback: true,
		};
	}
}

export async function POST(request: Request): Promise<Response> {
	try {
		const contentType = request.headers.get("content-type") || "";
		if (!contentType.toLowerCase().includes("multipart/form-data")) {
			const body: OpsAnalyzeResponse = {
				ok: false,
				error: "Expected multipart/form-data with a CSV file.",
			};
			return Response.json(body, { status: 400 });
		}

		const form = await request.formData();
		const file = form.get("file");

		if (!(file instanceof File)) {
			const body: OpsAnalyzeResponse = {
				ok: false,
				error: "Missing file field named 'file'.",
			};
			return Response.json(body, { status: 400 });
		}

		if (file.size > 2_000_000) {
			const body: OpsAnalyzeResponse = {
				ok: false,
				error: "File too large. Please upload a CSV under 2MB for the hackathon demo.",
			};
			return Response.json(body, { status: 413 });
		}

		const csvText = await file.text();

		const parsed = Papa.parse<Record<string, unknown>>(csvText, {
			header: true,
			skipEmptyLines: true,
		});

		if (parsed.errors?.length) {
			const body: OpsAnalyzeResponse = {
				ok: false,
				error: `CSV parse error: ${parsed.errors[0]?.message || "Unknown error"}`,
			};
			return Response.json(body, { status: 400 });
		}

		const rows = (parsed.data ?? []).filter(
			(
				r: Record<string, unknown> | undefined | null,
			): r is Record<string, unknown> => !!r && Object.keys(r).length > 0,
		);

		const columns = (parsed.meta.fields ?? []).filter(
			(c: string | undefined | null): c is string =>
				typeof c === "string" && c.trim() !== "",
		);

		const rowCount = rows.length;
		const sampleRows = rows
			.slice(0, 5)
			.map((r: Record<string, unknown>) => {
				const normalized: Record<string, string> = {};
				for (const col of columns) {
					const v = r[col];
					normalized[col] =
						v === null || v === undefined ? "" : String(v);
				}
				return normalized;
			});

		const missingByColumn: Record<string, number> = Object.fromEntries(
			columns.map((c: string) => [c, 0]),
		);

		const numericValuesByColumn: Record<string, number[]> =
			Object.fromEntries(columns.map((c: string) => [c, []]));

		for (const row of rows) {
			for (const col of columns) {
				const v = row[col];
				if (isMissing(v)) {
					missingByColumn[col] = (missingByColumn[col] || 0) + 1;
					continue;
				}

				const n = toNumberIfNumeric(v);
				if (n !== null) {
					numericValuesByColumn[col].push(n);
				}
			}
		}

		const numericByColumn: Record<string, NumericStats> = {};
		for (const col of columns) {
			const values = numericValuesByColumn[col];
			if (values.length > 0) {
				numericByColumn[col] = computeNumericStats(values);
			}
		}

		const ai = await callOpenAiForOpsInsights({
			columns,
			rowCount,
			missingByColumn,
			numericByColumn,
			sampleRows,
		});

		const body: OpsAnalyzeResponse = {
			ok: true,
			preview: { columns, rowCount, sampleRows },
			stats: { missingByColumn, numericByColumn },
			ai,
		};

		return Response.json(body);
	} catch (err) {
		const body: OpsAnalyzeResponse = {
			ok: false,
			error: err instanceof Error ? err.message : "Unknown error",
		};
		return Response.json(body, { status: 500 });
	}
}
