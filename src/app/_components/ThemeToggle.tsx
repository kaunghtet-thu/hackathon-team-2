/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

function resolveTheme(mode: ThemeMode): "light" | "dark" {
	if (mode === "system") {
		if (typeof window !== "undefined" && window.matchMedia) {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		}
		return "light";
	}
	return mode;
}

function applyResolvedTheme(resolved: "light" | "dark") {
	const root = document.documentElement;
	if (resolved === "dark") root.classList.add("dark");
	else root.classList.remove("dark");
}

function readStoredMode(): ThemeMode | null {
	try {
		const stored = localStorage.getItem("theme");
		if (stored === "light" || stored === "dark" || stored === "system")
			return stored;
	} catch {}
	return null;
}

function storeMode(mode: ThemeMode) {
	try {
		localStorage.setItem("theme", mode);
	} catch {}
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
			<path
				fill="currentColor"
				d="M12 4a1 1 0 0 1 1-1h0a1 1 0 0 1-1-1 1 1 0 0 1-1 1h0a1 1 0 0 1 1 1Zm0 18a1 1 0 0 1 1-1h0a1 1 0 0 1-1-1 1 1 0 0 1-1 1h0a1 1 0 0 1 1 1ZM4 12a1 1 0 0 1-1-1h0a1 1 0 0 1-1 1 1 1 0 0 1 1 1h0a1 1 0 0 1 1-1Zm18 0a1 1 0 0 1-1-1h0a1 1 0 0 1-1 1 1 1 0 0 1 1 1h0a1 1 0 0 1 1-1ZM6.2 6.2a1 1 0 0 1 1.4-1.4h0a1 1 0 0 1-1.4-1.4 1 1 0 0 1-1.4 1.4h0a1 1 0 0 1 1.4 1.4Zm12 12a1 1 0 0 1 1.4-1.4h0a1 1 0 0 1-1.4-1.4 1 1 0 0 1-1.4 1.4h0a1 1 0 0 1 1.4 1.4Zm0-12a1 1 0 0 1 1.4 1.4h0a1 1 0 0 1-1.4 1.4 1 1 0 0 1 1.4-1.4ZM6.2 17.8a1 1 0 0 1 1.4 1.4h0a1 1 0 0 1-1.4 1.4 1 1 0 0 1 1.4-1.4Z"
			/>
			<circle cx="12" cy="12" r="5" fill="currentColor" />
		</svg>
	);
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
			<path
				fill="currentColor"
				d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
			/>
		</svg>
	);
}

function SystemIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
			<path
				fill="currentColor"
				d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm2 0h12v9H6V5Zm-1 13h14v2H5v-2Z"
			/>
		</svg>
	);
}

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const [mode, setMode] = useState<ThemeMode>("system");
	const [prefersDark, setPrefersDark] = useState<boolean>(false);

	// Setup initial mode + media listener
	useEffect(() => {
		setMounted(true);
		const mql = window.matchMedia
			? window.matchMedia("(prefers-color-scheme: dark)")
			: (null as unknown as MediaQueryList);
		const handleChange = () => setPrefersDark(!!mql?.matches);
		if (mql && typeof mql.addEventListener === "function") {
			mql.addEventListener("change", handleChange);
		} else if (mql && typeof mql.addListener === "function") {
			// Safari
			mql.addListener(handleChange);
		}
		handleChange();

		const stored = readStoredMode();
		const initialMode: ThemeMode = stored ?? "system";
		setMode(initialMode);
		applyResolvedTheme(resolveTheme(initialMode));

		return () => {
			if (!mql) return;
			if (typeof mql.removeEventListener === "function")
				mql.removeEventListener("change", handleChange);
			else if (typeof mql.removeListener === "function")
				mql.removeListener(handleChange);
		};
	}, []);

	// React to OS changes when on system mode
	useEffect(() => {
		if (!mounted) return;
		const resolved = resolveTheme(mode);
		applyResolvedTheme(resolved);
	}, [mode, prefersDark, mounted]);

	function cycleMode() {
		const next: ThemeMode =
			mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
		setMode(next);
		storeMode(next);
		applyResolvedTheme(resolveTheme(next));
	}

	const label = useMemo(
		() =>
			mode === "system" ? "System" : mode === "dark" ? "Dark" : "Light",
		[mode],
	);

	const icon = useMemo(() => {
		if (mode === "system") return <SystemIcon className="h-4 w-4" />;
		if (resolveTheme(mode) === "dark")
			return <MoonIcon className="h-4 w-4" />;
		return <SunIcon className="h-4 w-4" />;
	}, [mode]);

	return (
		<button
			type="button"
			onClick={cycleMode}
			aria-label="Toggle color theme"
			title="Click to cycle Light/Dark/System"
			className="inline-flex w-28 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:hover:bg-zinc-900"
		>
			{icon}
			<span suppressHydrationWarning>{mounted ? label : "Theme"}</span>
		</button>
	);
}
