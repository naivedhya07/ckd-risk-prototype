import React from 'react';
import { ShapFactor } from '@/lib/ckdLogic';

interface ShapExplanationProps {
  factors: ShapFactor[];
}

export function ShapExplanation({ factors }: ShapExplanationProps) {
  if (!factors || factors.length === 0) return <div className="text-gray-400 italic text-sm">No factors available</div>;

  return (
    <div className="space-y-2 mt-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Risk Factors (SHAP)</h4>
      <div className="space-y-1.5">
        {factors.map((factor, idx) => {
          const isPositiveRisk = factor.contribution > 0;
          return (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{factor.feature}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  {isPositiveRisk ? (
                    <div 
                      className="h-full bg-red-400 ml-auto" 
                      style={{ width: `${Math.min(100, factor.contribution * 2)}%` }} 
                    />
                  ) : (
                    <div 
                      className="h-full bg-green-400 mr-auto" 
                      style={{ width: `${Math.min(100, Math.abs(factor.contribution) * 2)}%` }} 
                    />
                  )}
                </div>
                <span className={`text-xs font-medium ${isPositiveRisk ? 'text-red-600' : 'text-green-600'}`}>
                  {isPositiveRisk ? '+' : '-'}{Math.abs(factor.contribution).toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
