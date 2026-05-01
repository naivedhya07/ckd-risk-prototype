import React from 'react';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  category: 'Low' | 'Moderate' | 'High';
  className?: string;
}

export function RiskBadge({ category, className }: RiskBadgeProps) {
  const colors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium border shadow-sm',
        colors[category],
        className
      )}
    >
      {category} Risk
    </span>
  );
}
