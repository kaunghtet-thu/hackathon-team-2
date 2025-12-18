export const metadata = {
	title: "Image Identifier • AstraSemi AI Helper",
	description:
		"Get a general, non-technical explanation of a semiconductor image.",
};
import ImagesClient from "./ImagesClient";

export default function ImagesPage() {
	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<header>
				<h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					Semiconductor Image Identifier
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Upload a sample image to receive a general description and its role in the process.
					This is not a technical assessment.
				</p>
			</header>
			<ImagesClient />
		</div>
	);
}
