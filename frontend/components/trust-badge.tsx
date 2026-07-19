import React from "react";
import { CheckCircle2, Award, ShieldCheck } from "lucide-react";

type TrustBadgeProps = {
  trustScore: number;
  className?: string;
};

export function TrustBadge({ trustScore, className = "" }: TrustBadgeProps) {
  // Determine tier based on score
  let tierLabel = "Student";
  let Icon = ShieldCheck;
  let gradientClass = "from-zinc-200 to-zinc-300 text-zinc-700 dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-300";
  let iconColor = "text-zinc-500 dark:text-zinc-400";

  if (trustScore >= 4.8) {
    tierLabel = "Top Renter";
    Icon = Award;
    gradientClass = "from-amber-200 to-yellow-400 text-amber-900 dark:from-amber-500/20 dark:to-amber-500/10 dark:text-amber-500";
    iconColor = "text-amber-600 dark:text-amber-400";
  } else if (trustScore >= 4.0) {
    tierLabel = "Verified Student";
    Icon = CheckCircle2;
    gradientClass = "from-emerald-200 to-green-400 text-emerald-900 dark:from-emerald-500/20 dark:to-emerald-500/10 dark:text-emerald-500";
    iconColor = "text-emerald-600 dark:text-emerald-400";
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${gradientClass} border border-white/20 shadow-sm ${className}`}>
      <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      <span className="text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1">
        {tierLabel} <span className="opacity-60 font-medium tracking-normal ml-0.5">• {trustScore.toFixed(1)}</span>
      </span>
    </div>
  );
}
