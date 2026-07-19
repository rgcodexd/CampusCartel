"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ModeToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMode = searchParams.get("mode") || "all";

  const setMode = (mode: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "all") {
      params.delete("mode");
    } else {
      params.set("mode", mode);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex bg-muted p-1 rounded-xl w-fit border shadow-sm">
      {["all", "rent", "buy"].map((mode) => (
        <button
          key={mode}
          onClick={() => setMode(mode)}
          className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
            currentMode === mode
              ? "bg-white dark:bg-surface text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {mode === "all" ? "Explore All" : mode}
        </button>
      ))}
    </div>
  );
}
