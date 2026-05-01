// ckdLogic.ts
export type PatientData = {
  id: string;
  age: number;
  sex: 'M' | 'F';
  creatinine: number; // mg/dL
  urineProtein: number; // mg/dL or g/dL
  bloodPressure: string; // e.g., "120/80"
  glucose: number; // mg/dL
};

export type KDIGOStage = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

export type ShapFactor = {
  feature: string;
  contribution: number; // positive increases risk, negative decreases risk
};

export type RiskResult = {
  egfr: number;
  stage: KDIGOStage;
  riskScore: number; // 0 to 100%
  riskCategory: 'Low' | 'Moderate' | 'High';
  shapValues: ShapFactor[];
};

// CKD-EPI 2021 Equation (simplified, race omitted)
export function calculateEGFR(creatinine: number, age: number, sex: 'M' | 'F'): number {
  const kappa = sex === 'F' ? 0.7 : 0.9;
  const alpha = sex === 'F' ? -0.241 : -0.302;
  const minCr = Math.min(creatinine / kappa, 1);
  const maxCr = Math.max(creatinine / kappa, 1);
  const sexFactor = sex === 'F' ? 1.012 : 1;

  const egfr = 142 * Math.pow(minCr, alpha) * Math.pow(maxCr, -1.2) * Math.pow(0.9938, age) * sexFactor;
  return Math.round(egfr);
}

export function getKDIGOStage(egfr: number): KDIGOStage {
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 45) return 'G3a';
  if (egfr >= 30) return 'G3b';
  if (egfr >= 15) return 'G4';
  return 'G5';
}

// Mock XGBoost & SHAP computation
export function predictProgressionRisk(data: PatientData): RiskResult {
  const egfr = calculateEGFR(data.creatinine, data.age, data.sex);
  const stage = getKDIGOStage(egfr);

  // Parse systolic BP
  const systolic = parseInt(data.bloodPressure.split('/')[0]) || 120;

  // Base risk from eGFR (lower eGFR = higher risk)
  let riskScore = Math.max(0, 100 - egfr);

  // Modifiers
  if (data.urineProtein > 30) riskScore += 15;
  if (systolic > 140) riskScore += 10;
  if (data.glucose > 126) riskScore += 10;

  riskScore = Math.min(100, Math.round(riskScore));

  let riskCategory: 'Low' | 'Moderate' | 'High' = 'Low';
  if (riskScore >= 60) riskCategory = 'High';
  else if (riskScore >= 30) riskCategory = 'Moderate';

  // Generate mock SHAP values representing feature importance for THIS patient
  const shapFactors: ShapFactor[] = [
    { feature: 'eGFR', contribution: (100 - egfr) * 0.4 },
    { feature: 'Urine Protein', contribution: data.urineProtein > 30 ? 15 : 2 },
    { feature: 'Blood Pressure', contribution: systolic > 140 ? 10 : -2 },
    { feature: 'Glucose', contribution: data.glucose > 126 ? 8 : 1 },
    { feature: 'Age', contribution: data.age > 65 ? 5 : 1 }
  ];

  // Sort by absolute contribution and take top 3
  shapFactors.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const topShapValues = shapFactors.slice(0, 3);

  return {
    egfr,
    stage,
    riskScore,
    riskCategory,
    shapValues: topShapValues
  };
}

export type LifestyleLog = {
  waterIntake: number; // glasses (goal: 8+)
  saltConsumption: 'Low' | 'Medium' | 'High'; // goal: Low/Medium
  exerciseMinutes: number; // goal: 30+
  medicationAdherence: boolean;
};

// Calculate Kidney Health Score from lifestyle (0-100)
export function calculateLifestyleScore(history: LifestyleLog[]): number {
  if (history.length === 0) return 50; // default middle score
  
  let totalScore = 0;
  for (const log of history) {
    let dayScore = 0;
    // Water (max 25)
    dayScore += Math.min(25, (log.waterIntake / 8) * 25);
    // Salt (max 25)
    if (log.saltConsumption === 'Low') dayScore += 25;
    else if (log.saltConsumption === 'Medium') dayScore += 15;
    else dayScore += 5;
    // Exercise (max 25)
    dayScore += Math.min(25, (log.exerciseMinutes / 30) * 25);
    // Meds (max 25)
    if (log.medicationAdherence) dayScore += 25;

    totalScore += dayScore;
  }
  
  return Math.round(totalScore / history.length);
}

// Generate synthetic demo data
export function generateDemoData(): PatientData[] {
  return [
    { id: 'P001', age: 45, sex: 'M', creatinine: 1.1, urineProtein: 15, bloodPressure: '120/80', glucose: 95 },
    { id: 'P002', age: 62, sex: 'F', creatinine: 1.8, urineProtein: 45, bloodPressure: '145/90', glucose: 135 },
    { id: 'P003', age: 71, sex: 'M', creatinine: 2.5, urineProtein: 120, bloodPressure: '160/95', glucose: 110 },
    { id: 'P004', age: 55, sex: 'F', creatinine: 0.9, urineProtein: 10, bloodPressure: '115/75', glucose: 85 },
    { id: 'P005', age: 38, sex: 'M', creatinine: 1.5, urineProtein: 20, bloodPressure: '130/85', glucose: 105 },
  ];
}
