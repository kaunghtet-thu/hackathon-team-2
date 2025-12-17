import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/_components/Navbar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "AstraSemi AI Helper",
	description: "AI-powered summaries for operations CSVs (Module 1)",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(()=>{try{var t=localStorage.getItem('theme');var isDark=false; if(t==='dark'){isDark=true;} else if(t==='light'){isDark=false;} else {isDark=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);} var root=document.documentElement; if(isDark){root.classList.add('dark');} else {root.classList.remove('dark');}}catch(e){}})();`,
					}}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
				suppressHydrationWarning
			>
				{/* Soft background accents for a subtle “liquid glass” feel */}
				<div
					aria-hidden
					className="pointer-events-none fixed inset-0 -z-10"
					style={{
						background:
							"radial-gradient(800px 400px at 20% -10%, rgba(0,0,0,0.06), transparent 60%), radial-gradient(700px 350px at 80% 0%, rgba(0,0,0,0.05), transparent 55%)",
					}}
				/>
				<Navbar />
				<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
					{children}
				</main>
			</body>
		</html>
	);
}
