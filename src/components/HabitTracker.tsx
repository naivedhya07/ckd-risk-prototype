"use client";

import React, { useState } from 'react';
import { LifestyleLog } from '@/lib/ckdLogic';
import { Activity, Flame, Heart, Scale } from 'lucide-react';

interface HabitTrackerProps {
  onLogSubmit: (log: LifestyleLog) => void;
}

export function HabitTracker({ onLogSubmit }: HabitTrackerProps) {
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [salt, setSalt] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [exercise, setExercise] = useState(15);
  const [weight, setWeight] = useState<number | ''>(70);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogSubmit({
      date: new Date().toISOString(),
      waterIntake: 4, // Default required by type
      saltConsumption: salt,
      exerciseMinutes: exercise,
      medicationAdherence: true, // Default required by type
      systolicBP: systolic,
      diastolicBP: diastolic,
      weight: weight === '' ? undefined : weight,
      diet: 'Average' // Default required by type
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4">
      <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
        
        {/* Blood Pressure */}
        <div className="flex-[2] min-w-[160px]">
          <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-red-500" /> BP (Sys/Dia)
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="number" min="80" max="220" 
              value={systolic} onChange={e => setSystolic(parseInt(e.target.value))} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all" 
              placeholder="120"
            />
            <span className="text-gray-400 font-bold">/</span>
            <input 
              type="number" min="40" max="130" 
              value={diastolic} onChange={e => setDiastolic(parseInt(e.target.value))} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all" 
              placeholder="80"
            />
          </div>
        </div>

        {/* Salt */}
        <div className="flex-1 min-w-[120px]">
          <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Salt
          </label>
          <select 
            value={salt} 
            onChange={e => setSalt(e.target.value as any)} 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Exercise */}
        <div className="flex-1 min-w-[120px]">
          <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-green-500" /> Activity (min)
          </label>
          <input 
            type="number" min="0" max="300" step="5" 
            value={exercise} onChange={e => setExercise(parseInt(e.target.value))} 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" 
          />
        </div>

        {/* Weight */}
        <div className="flex-1 min-w-[100px]">
          <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-purple-500" /> Weight (kg)
          </label>
          <input 
            type="number" min="30" max="300" 
            value={weight} 
            onChange={e => { const val = e.target.value; setWeight(val === '' ? '' : parseFloat(val)); }} 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" 
          />
        </div>

        <button 
          type="submit" 
          className="px-6 py-2 h-[38px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-indigo-600/20 transition-all active:scale-95 whitespace-nowrap mb-[1px]"
        >
          Update Vitals
        </button>
      </div>
    </form>
  );
}
