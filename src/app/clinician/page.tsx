"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';
import { generateDemoData, predictProgressionRisk, PatientData, RiskResult } from '@/lib/ckdLogic';
import { RiskBadge } from '@/components/RiskBadge';
import { ShapExplanation } from '@/components/ShapExplanation';
import { Upload, Database, ActivitySquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type PatientRow = PatientData & RiskResult;

export default function ClinicianDashboard() {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processData = (data: PatientData[]) => {
    setIsProcessing(true);
    setTimeout(() => {
      const results = data.map(p => ({
        ...p,
        ...predictProgressionRisk(p)
      }));
      setPatients(results);
      setIsProcessing(false);
    }, 600); // simulated delay for model inference
  };

  const handleDemoData = () => {
    const demo = generateDemoData();
    processData(demo);
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
          <div className="flex gap-3">
            <button
              onClick={handleDemoData}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-2 transition-colors"
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {patients.map((p, i) => (
                    <tr key={i} className={`hover:bg-gray-50 transition-colors ${isProcessing ? 'opacity-50' : 'opacity-100'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{p.id}</div>
                        <div className="text-xs text-gray-500">{p.age}y • {p.sex}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>Cr: <span className="font-medium text-gray-900">{p.creatinine}</span></div>
                        <div>UP: <span className="font-medium text-gray-900">{p.urineProtein}</span></div>
                        <div>BP: <span className="font-medium text-gray-900">{p.bloodPressure}</span></div>
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
                    </tr>
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
