import Link from "next/link";

export default function Home() {
	return (
		<div className="space-y-12">
			<section className="mx-auto max-w-5xl pt-6 sm:pt-10">
				<div className="rounded-3xl bg-surface p-8 ring-1 ring-inset ring-border">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						Clarity for operations, documents, and images
					</h1>
					<p className="mt-3 max-w-2xl text-muted-foreground">
						AstraSemi AI Helper transforms raw inputs into clear,
						actionable insights for new and non-technical employees
						— fast and safely.
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						<Link
							href="/ops"
							className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
						>
							Get started with Operations
						</Link>
						<Link
							href="/docs"
							className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
						>
							Documents
						</Link>
						<Link
							href="/images"
							className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
						>
							Images
						</Link>
					</div>
				</div>
			</section>

			<section className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
				<div className="rounded-2xl border border-border bg-surface p-6">
					<h2 className="text-lg font-semibold">
						Operations Overview
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Upload CSVs and get a plain-English summary, unusual
						findings, and top takeaways.
					</p>
					<Link
						href="/ops"
						className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4"
					>
						Open module →
					</Link>
				</div>
				<div className="rounded-2xl border border-border bg-surface p-6">
					<h2 className="text-lg font-semibold">
						Document Interpreter
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Rewrite semiconductor-related text into simple,
						understandable language — ideal for cross-functional
						teams.
					</p>
					<Link
						href="/docs"
						className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4"
					>
						Preview module →
					</Link>
				</div>
				<div className="rounded-2xl border border-border bg-surface p-6">
					<h2 className="text-lg font-semibold">Image Identifier</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Upload a sample image to get a general, non-technical
						explanation and role in the process.
					</p>
					<Link
						href="/images"
						className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4"
					>
						Preview module →
					</Link>
				</div>
			</section>

			<section className="mx-auto max-w-5xl">
				<div className="rounded-2xl border border-border bg-surface p-6">
					<h2 className="text-lg font-semibold">
						Designed for a corporate environment
					</h2>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
						<li>
							Beginner-friendly UX and clear, consistent language
						</li>
						<li>Strict separation of concerns and safe AI usage</li>
						<li>
							No persistent storage; simple and secure by default
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
}
