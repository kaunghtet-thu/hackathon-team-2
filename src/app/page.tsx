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
						<Link
							href="/audio"
							className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
						>
							Audio
						</Link>
					</div>
				</div>
			</section>

			<section className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-4">
				<Link
					aria-label="Open Operations Overview module"
					href="/ops"
					className="group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/10 hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
				>
					<div className="flex items-start gap-3">
						<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
							<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<rect x="3.5" y="5" width="17" height="14" rx="2" />
								<path d="M3.5 9h17M8.5 9v10M14.5 9v10" />
							</svg>
						</span>
						<h2 className="text-lg font-semibold">Operations Overview</h2>
					</div>
					<div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 transition-transform">
						Open module <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
					</div>
				</Link>
				<Link
					aria-label="Open Document Interpreter module"
					href="/docs"
					className="group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/10 hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
				>
					<div className="flex items-start gap-3">
						<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
							<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z" />
								<path d="M14 3.5V8h4.5" />
								<path d="M8.5 12h7M8.5 15h7M8.5 18h5" />
							</svg>
						</span>
						<h2 className="text-lg font-semibold">Document Interpreter</h2>
					</div>
					<div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 transition-transform">
						Open module <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
					</div>
				</Link>
				<Link
					aria-label="Open Image Identifier module"
					href="/images"
					className="group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/10 hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
				>
					<div className="flex items-start gap-3">
						<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
							<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M4 8.5h3l1.5-2h7L17 8.5h3A2.5 2.5 0 0 1 22.5 11v6A2.5 2.5 0 0 1 20 19.5H4A2.5 2.5 0 0 1 1.5 17v-6A2.5 2.5 0 0 1 4 8.5z" />
								<circle cx="12" cy="14" r="3.2" />
							</svg>
						</span>
						<h2 className="text-lg font-semibold">Image Identifier</h2>
					</div>
					<div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 transition-transform">
						Open module <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
					</div>
				</Link>
				<Link
					aria-label="Open Audio Transcriber module"
					href="/audio"
					className="group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/10 hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
				>
					<div className="flex items-start gap-3">
						<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
							<svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<rect x="9" y="4" width="6" height="10" rx="3" />
								<path d="M12 14v4" />
								<path d="M8 11a4 4 0 0 0 8 0" />
							</svg>
						</span>
						<h2 className="text-lg font-semibold">Audio Transcriber</h2>
					</div>
					<div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 transition-transform">
						Open module <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
					</div>
				</Link>
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
