import { PatientData, LifestyleLog } from './ckdLogic';

// Define the shape of our mock database
export interface Database {
  patients: Record<string, PatientData>;
  logs: Record<string, LifestyleLog[]>;
}

// Ensure the global variable exists across Next.js API hot-reloads
const globalForDb = global as unknown as { db: Database };

if (!globalForDb.db) {
  globalForDb.db = {
    patients: {
      'P-123': {
        id: 'P-123',
        age: 55,
        sex: 'M',
        creatinine: 1.2,
        urineProtein: 15,
        bloodPressure: '125/80',
        glucose: 98,
        hbA1c: 5.8,
        cholesterol: 190,
        weight: 85,
        height: 175
      },
      'P-456': {
        id: 'P-456',
        age: 62,
        sex: 'F',
        creatinine: 2.1,
        urineProtein: 45,
        bloodPressure: '150/95',
        glucose: 140,
        hbA1c: 7.4,
        cholesterol: 230,
        weight: 92,
        height: 160
      }
    },
    logs: {
      'P-123': [],
      'P-456': []
    }
  };
}

export const db = globalForDb.db;
