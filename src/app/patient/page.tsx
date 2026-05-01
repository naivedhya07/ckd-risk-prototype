"use client";

import React, { useState, useEffect } from 'react';
import { LifestyleLog, calculateLifestyleScore } from '@/lib/ckdLogic';
import { HabitTracker } from '@/components/HabitTracker';
import { AnimatedScore } from '@/components/AnimatedScore';
import { UserCircle, Award, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientPortal() {
  const [history, setHistory] = useState<LifestyleLog[]>([]);
  const [score, setScore] = useState(50);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Recalculate score whenever history changes
    const newScore = calculateLifestyleScore(history);
    setScore(newScore);

    // Calculate simple streak (consecutive days logged)
    setStreak(history.length);

    // Trigger basic animation effect for logging
    if (history.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [history]);

  const handleLogSubmit = (log: LifestyleLog) => {
    setHistory(prev => [...prev, log]);
  };

  return (
    <div className="min-h-screen bg-indigo-50/50 text-gray-900 pb-20">
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 font-bold text-lg text-indigo-900">
              <UserCircle className="w-5 h-5 text-indigo-600" /> Patient Portal
            </div>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
              <TrendingUp className="w-4 h-4" /> {streak} Day Streak!
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Left Column: Health Score & Achievements */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-50 text-center relative overflow-hidden">
              <h2 className="text-lg font-bold text-gray-700 mb-6">Your Kidney Health Score</h2>
              <AnimatedScore score={score} className="scale-125 my-8" />
              <p className="text-sm text-gray-500 mt-6 max-w-xs mx-auto">
                This score updates dynamically based on your daily lifestyle choices. Keep up the good work!
              </p>
              
              <AnimatePresence>
                {showConfetti && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center bg-white/50 backdrop-blur-sm z-20 rounded-3xl"
                  >
                    <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 text-lg">
                      <Award className="w-6 h-6" /> Log Saved!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> Achievements
              </h3>
              <div className="flex gap-4">
                <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${streak >= 3 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-100 grayscale opacity-50'}`}>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                    <FlameIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-center">3 Day<br/>Streak</span>
                </div>
                <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${score >= 80 ? 'border-green-300 bg-green-50' : 'border-gray-100 grayscale opacity-50'}`}>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-center">Health<br/>Champion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Habit Tracker */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-600/20">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-indigo-300" /> Today's Log
              </h2>
              <p className="text-indigo-100 text-sm">Small daily habits compound into massive health benefits over time.</p>
            </div>
            
            <HabitTracker onLogSubmit={handleLogSubmit} />
          </div>

        </div>
      </main>
    </div>
  );
}

// Quick inline icons for badges
function FlameIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
}

function ShieldIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
