"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/app/_components/ThemeToggle";

const nav = [
	{ href: "/", label: "Home" },
	{ href: "/ops", label: "Operations" },
	{ href: "/docs", label: "Documents" },
	{ href: "/images", label: "Images" },
    { href: "/audio", label: "Audio" },
];

function clsx(...parts: Array<string | false | null | undefined>): string {
	return parts.filter(Boolean).join(" ");
}

export default function Navbar() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur">
			<div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
				<div className="flex items-center gap-3">
					<div
						className="h-6 w-6 rounded bg-foreground"
						aria-hidden
					/>
					<span className="text-sm font-semibold tracking-tight text-foreground">
						AstraSemi AI Helper
					</span>
				</div>
				<nav className="hidden gap-1 sm:flex">
					{nav.map((item) => {
						const active =
							pathname === item.href ||
							(item.href !== "/" &&
								pathname?.startsWith(item.href));
						return (
							<Link
								key={item.href}
								href={item.href}
								className={clsx(
									"rounded-full px-3 py-1.5 text-sm font-medium",
									active
										? "bg-foreground text-background"
										: "text-muted-foreground hover:bg-surface",
								)}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2 shrink-0">
					<ThemeToggle />
					<a
						href="/ops"
						className="hidden rounded-full bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90 sm:inline-flex"
					>
						Get Started
					</a>
				</div>
			</div>
		</header>
	);
}
