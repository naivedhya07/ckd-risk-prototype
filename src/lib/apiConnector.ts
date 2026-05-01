import { PatientData } from './ckdLogic';

// Mock FHIR Observation
type MockObservation = {
  code: string;
  display: string;
  value: number;
  unit: string;
};

// Simulate a network call to a FHIR/HL7 endpoint
export async function fetchMockFhirLabs(patientId: string): Promise<Partial<PatientData>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate random fluctuations in labs for demonstration purposes
      const creatinine = +(Math.random() * (3.0 - 0.7) + 0.7).toFixed(1);
      const urineProtein = +(Math.random() * (150 - 10) + 10).toFixed(0);
      const hbA1c = +(Math.random() * (9.0 - 4.5) + 4.5).toFixed(1);
      const cholesterol = +(Math.random() * (260 - 140) + 140).toFixed(0);
      const systolic = +(Math.random() * (160 - 110) + 110).toFixed(0);
      const diastolic = +(Math.random() * (100 - 70) + 70).toFixed(0);
      const glucose = +(Math.random() * (150 - 80) + 80).toFixed(0);

      resolve({
        creatinine,
        urineProtein,
        hbA1c,
        cholesterol,
        bloodPressure: `${systolic}/${diastolic}`,
        glucose
      });
    }, 800); // 800ms simulated latency
  });
}
