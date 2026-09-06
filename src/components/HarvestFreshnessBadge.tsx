'use client';

import React, { useEffect, useState } from 'react';

interface Props {
  harvestDate: string | Date;
  className?: string;
}

export function HarvestFreshnessBadge({ harvestDate, className = '' }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const d = new Date(harvestDate);
  const formattedDate = !isNaN(d.getTime())
    ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recent harvest';

  const harvestTime = !isNaN(d.getTime()) ? d.getTime() : Date.now();
  const now = Date.now();
  const diffHours = Math.max(0, Math.round((now - harvestTime) / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);

  let text = 'Harvested today';
  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let dotColor = 'bg-emerald-500';

  if (diffHours < 12) {
    text = `Harvested ${diffHours || 1}h ago`;
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
  } else if (diffDays === 1) {
    text = 'Harvested yesterday';
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (diffDays > 1) {
    text = `Harvested ${diffDays} days ago`;
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  }

  return (
    <span
      suppressHydrationWarning
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${badgeColor} ${className}`}
      title={`Harvested on ${formattedDate}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      {mounted ? text : 'Farm Fresh'}
    </span>
  );
}

