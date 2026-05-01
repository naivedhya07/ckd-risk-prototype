"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedScoreProps {
  score: number; // 0 to 100
  className?: string;
}

export function AnimatedScore({ score, className }: AnimatedScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) return;
    
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(1000 / (end - start)));
    
    const timer = setInterval(() => {
      current += increment;
      setDisplayScore(current);
      if (current === end) clearInterval(timer);
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score (higher is better for health score)
  let colorClass = 'text-green-500';
  let ringClass = 'stroke-green-500';
  if (score < 40) {
    colorClass = 'text-red-500';
    ringClass = 'stroke-red-500';
  } else if (score < 70) {
    colorClass = 'text-yellow-500';
    ringClass = 'stroke-yellow-500';
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-100"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("transition-colors duration-500", ringClass)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("text-3xl font-bold transition-colors duration-500", colorClass)}>
          {displayScore}
        </span>
        <span className="text-xs text-gray-400 font-medium tracking-wide">SCORE</span>
      </div>
    </div>
  );
}
