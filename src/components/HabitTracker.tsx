"use client";

import React, { useState } from 'react';
import { LifestyleLog } from '@/lib/ckdLogic';
import { Droplets, Activity, Pill, Flame } from 'lucide-react';

interface HabitTrackerProps {
  onLogSubmit: (log: LifestyleLog) => void;
}

export function HabitTracker({ onLogSubmit }: HabitTrackerProps) {
  const [water, setWater] = useState(4);
  const [salt, setSalt] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [exercise, setExercise] = useState(15);
  const [meds, setMeds] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogSubmit({
      waterIntake: water,
      saltConsumption: salt,
      exerciseMinutes: exercise,
      medicationAdherence: meds
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" /> Daily Check-In
      </h3>

      <div className="space-y-4">
        {/* Water Intake */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-400" /> Water Intake (glasses)</span>
            <span className="text-blue-600 font-bold">{water}</span>
          </label>
          <input
            type="range"
            min="0"
            max="15"
            value={water}
            onChange={(e) => setWater(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Salt Intake */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Salt Consumption</span>
          </label>
          <div className="flex gap-2">
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSalt(level as any)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  salt === level 
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-200' 
                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> Exercise (minutes)</span>
            <span className="text-green-600 font-bold">{exercise} min</span>
          </label>
          <input
            type="range"
            min="0"
            max="120"
            step="5"
            value={exercise}
            onChange={(e) => setExercise(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        {/* Meds */}
        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <label htmlFor="meds-toggle" className="flex items-center gap-2 text-sm font-medium text-indigo-900 cursor-pointer">
            <Pill className="w-5 h-5 text-indigo-500" /> Took Medications?
          </label>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              type="checkbox" 
              name="toggle" 
              id="meds-toggle" 
              checked={meds}
              onChange={(e) => setMeds(e.target.checked)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
              style={{ transform: meds ? 'translateX(100%)' : 'translateX(0)', borderColor: meds ? '#6366f1' : '#e5e7eb' }}
            />
            <label 
              htmlFor="meds-toggle" 
              className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out ${meds ? 'bg-indigo-500' : ''}`}
            ></label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/30 transition-all active:scale-95"
      >
        Log Today's Habits
      </button>
    </form>
  );
}
