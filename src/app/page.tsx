import Link from 'next/link';
import { ActivitySquare, UserCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-2">
            CKD Risk Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced risk scoring, KDIGO staging, and dynamic lifestyle tracking powered by predictive analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Clinician Portal */}
          <Link href="/clinician" className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ActivitySquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Clinician Dashboard</h2>
            <p className="text-gray-500 mb-6">
              Upload patient labs, view eGFR & KDIGO stages, and analyze XGBoost risk predictions with SHAP explainability.
            </p>
            <div className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Enter Portal <span aria-hidden="true">&rarr;</span>
            </div>
          </Link>

          {/* Patient Portal */}
          <Link href="/patient" className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <UserCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Patient Portal</h2>
            <p className="text-gray-500 mb-6">
              Log daily habits, track your dynamic Kidney Health Score, and earn streaks for maintaining a healthy lifestyle.
            </p>
            <div className="text-indigo-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Enter Portal <span aria-hidden="true">&rarr;</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
