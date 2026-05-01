"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { generateDemoData, predictProgressionRisk, PatientData, RiskResult, calculateLifestyleScore, LifestyleLog } from '@/lib/ckdLogic';
import { fetchMockFhirLabs } from '@/lib/apiConnector';
import { RiskBadge } from '@/components/RiskBadge';
import { ShapExplanation } from '@/components/ShapExplanation';
import { HabitTracker } from '@/components/HabitTracker';
import { AnimatedScore } from '@/components/AnimatedScore';
import { Upload, Database, ActivitySquare, ArrowLeft, Search, ChevronDown, ChevronUp, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type PatientRow = PatientData & RiskResult & { _latestLog?: LifestyleLog, _allLogs?: LifestyleLog[] };

export default function ClinicianDashboard() {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  const processData = (data: PatientData[]) => {
    setIsProcessing(true);
    setTimeout(() => {
      const results = data.map(p => ({
        ...p,
        ...predictProgressionRisk(p, []),
        _allLogs: []
      }));
      setPatients(results);
      setIsProcessing(false);
    }, 600);
  };

  const handleDemoData = () => {
    const demo = generateDemoData();
    processData(demo);
  };

  const handleFetchApi = async () => {
    if (!searchId.trim()) return;
    setIsProcessing(true);
    
    try {
      const res = await fetch(`/api/patient/${searchId.trim()}`);
      if (res.ok) {
        const data = await res.json();
        const patientData = data.patient;
        const logs = data.logs || [];
        
        const newPatient = {
          ...patientData,
          ...predictProgressionRisk(patientData, logs),
          _latestLog: logs.length > 0 ? logs[logs.length - 1] : undefined,
          _allLogs: logs
        };

        setPatients(prev => [newPatient, ...prev.filter(p => p.id !== patientData.id)]);
      }
    } catch (err) {
      console.error(err);
    }

    setIsProcessing(false);
    setSearchId('');
  };

  const handleLogSubmit = async (patientId: string, log: LifestyleLog) => {
    try {
      const res = await fetch(`/api/patient/${patientId}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
      if (res.ok) {
        // Re-fetch patient to update stats
        const fetchRes = await fetch(`/api/patient/${patientId}`);
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          const pData = data.patient;
          const logs = data.logs || [];
          const updatedPatient = {
            ...pData,
            ...predictProgressionRisk(pData, logs),
            _latestLog: logs.length > 0 ? logs[logs.length - 1] : undefined,
            _allLogs: logs
          };
          setPatients(prev => prev.map(p => p.id === patientId ? updatedPatient : p));
        }
      }
    } catch (err) {
      console.error('Failed to submit log:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: PatientData[] = results.data.map((row: any) => ({
          id: row.id || `P-${Math.floor(Math.random()*1000)}`,
          age: parseInt(row.age) || 50,
          sex: (row.sex === 'F' || row.sex === 'Female') ? 'F' : 'M',
          creatinine: parseFloat(row.creatinine) || 1.0,
          urineProtein: parseFloat(row.urineProtein) || 0,
          bloodPressure: row.bloodPressure || '120/80',
          glucose: parseFloat(row.glucose) || 100,
        }));
        processData(parsed);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 font-bold text-lg text-blue-900">
              <ActivitySquare className="w-5 h-5 text-blue-600" /> Clinician Dashboard
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition-all">
              <input 
                type="text" 
                value={searchId} 
                onChange={e => setSearchId(e.target.value)} 
                placeholder="Patient ID..." 
                className="px-3 py-2 text-sm bg-transparent outline-none w-32 focus:w-48 transition-all"
                onKeyDown={e => e.key === 'Enter' && handleFetchApi()}
              />
              <button
                onClick={handleFetchApi}
                disabled={isProcessing || !searchId.trim()}
                className="px-3 py-2 text-emerald-700 hover:bg-emerald-200 bg-emerald-100 transition-colors disabled:opacity-50 border-l border-gray-200"
                title="Fetch Patient Labs via API"
              >
                <Search className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <button
              onClick={handleDemoData}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Database className="w-4 h-4" /> Load Demo Data
            </button>
            <label className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
              <Upload className="w-4 h-4" /> Upload CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Database className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600">No Patient Data</h3>
            <p className="mt-2 text-sm max-w-md text-center">Upload a CSV file with patient labs or load synthetic demo data to begin risk analysis.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Labs</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">eGFR & KDIGO</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progression Risk</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Model Explanation</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tracker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {patients.map((p, i) => (
                    <React.Fragment key={p.id || i}>
                      <tr className={`hover:bg-gray-50 transition-colors ${isProcessing ? 'opacity-50' : 'opacity-100'} ${expandedPatientId === p.id ? 'bg-indigo-50/30' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{p.id}</div>
                          <div className="text-xs text-gray-500">{p.age}y • {p.sex}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div>Cr: <span className="font-medium text-gray-900">{p.creatinine}</span></div>
                            <div>UP: <span className="font-medium text-gray-900">{p.urineProtein}</span></div>
                            <div>Glu: <span className="font-medium text-gray-900">{p.glucose}</span></div>
                            {p.hbA1c && <div>A1c: <span className="font-medium text-gray-900">{p.hbA1c}%</span></div>}
                            {p.cholesterol && <div>Chol: <span className="font-medium text-gray-900">{p.cholesterol}</span></div>}
                            
                            {/* Real-time vitals / logs */}
                            <div className="col-span-2 border-t border-gray-100 my-1 pt-1 text-xs text-gray-400 font-semibold uppercase">Latest Vitals & Logs</div>
                            <div>BP: <span className="font-medium text-gray-900">{p._latestLog?.systolicBP ? `${p._latestLog.systolicBP}/${p._latestLog.diastolicBP}` : p.bloodPressure}</span></div>
                            <div>Wt: <span className="font-medium text-gray-900">{p._latestLog?.weight || p.weight || '--'} kg</span></div>
                            <div>Diet: <span className="font-medium text-gray-900">{p._latestLog?.diet || '--'}</span></div>
                            <div>Meds: <span className="font-medium text-gray-900">{p._latestLog?.medicationAdherence !== undefined ? (p._latestLog.medicationAdherence ? 'Yes' : 'No') : '--'}</span></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-2xl font-bold text-gray-900 flex items-baseline gap-1">
                            {p.egfr} <span className="text-xs font-normal text-gray-500">mL/min</span>
                          </div>
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Stage {p.stage}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RiskBadge category={p.riskCategory} />
                          <div className="mt-2 text-xs text-gray-500">
                            Score: <span className="font-semibold text-gray-900">{p.riskScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 min-w-[250px]">
                          <ShapExplanation factors={p.shapValues} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => setExpandedPatientId(expandedPatientId === p.id ? null : p.id)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center gap-1 font-medium text-sm"
                          >
                            {expandedPatientId === p.id ? (
                              <>Close <ChevronUp className="w-4 h-4" /></>
                            ) : (
                              <>Inspect <ChevronDown className="w-4 h-4" /></>
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedPatientId === p.id && (
                        <tr>
                          <td colSpan={6} className="bg-indigo-50/20 px-6 py-8 border-b border-indigo-100">
                            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                              {/* Left Column: Health Score & Trend Chart */}
                              <div className="space-y-6">
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-50 text-center">
                                  <h2 className="text-lg font-bold text-gray-700 mb-6">Kidney Health Score</h2>
                                  <AnimatedScore score={calculateLifestyleScore(p._allLogs || [])} className="scale-125 my-8" />
                                  <p className="text-sm text-gray-500 mt-6 max-w-xs mx-auto">
                                    Score updates dynamically based on daily lifestyle tracking logs.
                                  </p>
                                </div>
                                
                                {p._allLogs && p._allLogs.length > 0 && (
                                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                      <TrendingUp className="w-4 h-4" /> Lifestyle & BP Trends
                                    </h3>
                                    <div className="h-48 w-full">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={p._allLogs.map((log, index) => ({
                                          name: `Day ${index + 1}`,
                                          systolic: log.systolicBP,
                                          diastolic: log.diastolicBP,
                                          exercise: log.exerciseMinutes
                                        }))} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                          <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ fontSize: '12px' }}
                                          />
                                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                                          <Line yAxisId="left" type="monotone" dataKey="systolic" name="Systolic BP" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                                          <Line yAxisId="left" type="monotone" dataKey="diastolic" name="Diastolic BP" stroke="#f87171" strokeWidth={2} dot={{ r: 3 }} />
                                          <Line yAxisId="right" type="monotone" dataKey="exercise" name="Exercise (m)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right Column: Habit Tracker Form */}
                              <div className="bg-white rounded-3xl shadow-sm border border-indigo-50 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                    <Calendar className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900">Clinician Entry</h3>
                                    <p className="text-sm text-gray-500">Log vitals & habits on behalf of {p.id}</p>
                                  </div>
                                </div>
                                <HabitTracker onLogSubmit={(log) => handleLogSubmit(p.id, log)} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
