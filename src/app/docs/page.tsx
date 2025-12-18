// 

import DocsInterpreter from "@/app/_components/DocsInterpreter";

export const metadata = {
  title: "Document Interpreter • AstraSemi AI Helper",
  description:
    "Rewrite semiconductor-related text into simple, understandable language.",
};

export default function DocsPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<header>
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					Semiconductor Document Interpreter
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Paste a text snippet and receive a plain-English summary,
					key points, and suggested follow-up actions.
					Beginner-friendly language only.
				</p>
			</header>
			<div className="text-center">
				<a href="/docs/glossary" className="text-blue-500 hover:underline">
					View Semiconductor Glossary
				</a>
			</div>
			<div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
				Coming soon. This page will include a simple text input and an
				AI-generated response with structured sections.
			</div>
		</div>
	);

}

