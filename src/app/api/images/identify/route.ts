export const runtime = "nodejs";
import sharp from "sharp";

// Response shape
export type ImageIdentifyResponse =
  | {
      ok: true;
      explanation: {
        what: string;
        use: string;
        role: string;
      };
      disclaimer: string; // must always be shown
      confidence: "low" | "medium" | "high";
      cautions?: string[];
      model?: string;
      usedFallback?: boolean;
    }
  | { ok: false; error: string };

const MANDATORY_DISCLAIMER =
  "This explanation is general and not a technical assessment.";

function makeFallback(): ImageIdentifyResponse {
  return {
    ok: true,
    explanation: {
      what: "A semiconductor-related tool or component",
      use: "Likely used for handling, processing, or inspecting wafers or parts",
      role:
        "Plays a supporting role in the overall fabrication or testing workflow",
    },
    disclaimer: MANDATORY_DISCLAIMER,
    confidence: "low",
    cautions: [
      "No defect detection or technical diagnosis is provided",
      "For accurate identification, consult a domain expert",
    ],
    usedFallback: true,
  };
}

async function compressToWebpDataUrl(f: File): Promise<string> {
  const input = Buffer.from(await f.arrayBuffer());
  // Always re-encode to WebP to strip EXIF and reduce size
  const MAX_SIDE = 1280; // keep within 1280px box
  const TARGET_BYTES = 2_800_000; // aim below ~2.8MB to leave base64 headroom
  const qualities = [80, 65, 50, 40, 30, 24];
  let out: Buffer | null = null;
  for (const q of qualities) {
    const candidate = await sharp(input)
      .rotate() // honor orientation
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: q })
      .toBuffer();
    out = candidate;
    if (candidate.byteLength <= TARGET_BYTES) break;
  }
  const b64 = (out ?? input).toString("base64");
  return `data:image/webp;base64,${b64}`;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return Response.json(
        { ok: false, error: "Expected multipart/form-data with an image file." },
        { status: 400 },
      );
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { ok: false, error: "Missing file field named 'file'." },
        { status: 400 },
      );
    }

    // Accept up to 20MB, then compress on the server to fit API constraints
    if (file.size > 20_000_000) {
      return Response.json(
        { ok: false, error: "File too large. Please upload an image under 20MB." },
        { status: 413 },
      );
    }

    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return Response.json(
        {
          ok: false,
          error: "Unsupported file type. Use JPEG, PNG, or WEBP.",
        },
        { status: 415 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(makeFallback());
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const dataUrl = await compressToWebpDataUrl(file);

    const system =
      "You are an assistant for new and non-technical employees. " +
      "Given a single image, provide a short, general description. " +
      "Do NOT perform technical assessment, defect detection, or deep claims. " +
      "Use beginner-friendly language.";

    const instruction =
      "Return ONLY valid JSON with this exact shape:\n" +
      "{\n  \"explanation\": { \"what\": string, \"use\": string, \"role\": string },\n  \"disclaimer\": string,\n  \"confidence\": \"low\"|\"medium\"|\"high\",\n  \"cautions\": string[]\n}\n\n" +
      "Rules:\n" +
      "- The disclaimer MUST be exactly: 'This explanation is general and not a technical assessment.'\n" +
      "- Keep sentences short and beginner-friendly.\n" +
      "- No defect detection or technical diagnosis.\n" +
      "- confidence must be one of: low, medium, high.\n";

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
          {
            role: "user",
            content: [
              { type: "text", text: instruction },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const fb = makeFallback() as any;
      fb.usedFallback = true;
      fb.model = model;
      fb.cautions = [
        ...(fb.cautions || []),
        `OpenAI request failed (${res.status}). ${text.slice(0, 160)}`,
      ];
      return Response.json(fb);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      const fb = makeFallback() as any;
      fb.usedFallback = true;
      fb.model = model;
      fb.cautions = [...(fb.cautions || []), "OpenAI returned empty content."];
      return Response.json(fb);
    }

    try {
      const parsed = JSON.parse(content) as {
        explanation?: { what?: unknown; use?: unknown; role?: unknown };
        disclaimer?: unknown;
        confidence?: unknown;
        cautions?: unknown;
      };

      const exp = parsed.explanation || {};
      const what = typeof exp === "object" && exp && typeof (exp as any).what === "string" ? (exp as any).what : null;
      const use = typeof exp === "object" && exp && typeof (exp as any).use === "string" ? (exp as any).use : null;
      const role = typeof exp === "object" && exp && typeof (exp as any).role === "string" ? (exp as any).role : null;
      const disclaimer = typeof parsed.disclaimer === "string" ? parsed.disclaimer : null;
      const confidence = parsed.confidence;
      const confOk = confidence === "low" || confidence === "medium" || confidence === "high";
      const cautions = Array.isArray(parsed.cautions)
        ? parsed.cautions.filter((x): x is string => typeof x === "string")
        : [];

      if (!what || !use || !role || !disclaimer || !confOk) {
        const fb = makeFallback() as any;
        fb.usedFallback = true;
        fb.model = model;
        fb.cautions = [
          ...(fb.cautions || []),
          "AI returned JSON with unexpected shape. Showing a safe fallback.",
        ];
        return Response.json(fb);
      }

      // Ensure the disclaimer matches the mandatory text
      const finalDisclaimer = MANDATORY_DISCLAIMER;

      const body: ImageIdentifyResponse = {
        ok: true,
        explanation: { what, use, role },
        disclaimer: finalDisclaimer,
        confidence: confidence as "low" | "medium" | "high",
        cautions,
        model,
      };
      return Response.json(body);
    } catch {
      const fb = makeFallback() as any;
      fb.usedFallback = true;
      fb.model = model;
      fb.cautions = [
        ...(fb.cautions || []),
        "AI returned non-JSON output. Showing a safe fallback.",
      ];
      return Response.json(fb);
    }
  } catch (err) {
    const body: ImageIdentifyResponse = {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
    return Response.json(body, { status: 500 });
  }
}
