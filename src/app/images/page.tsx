export const metadata = {
	title: "Image Identifier • AstraSemi AI Helper",
	description:
		"Get a general, non-technical explanation of a semiconductor image.",
};

export default function ImagesPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<header>
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					Semiconductor Image Identifier
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Upload a sample image to receive a general description and
					its role in the process. This is not a technical assessment.
				</p>
			</header>
			<div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
				Coming soon. This page will include an image upload and a
				concise, safe explanation with a confidence level and a
				mandatory disclaimer.
			</div>
		</div>
	);
}
