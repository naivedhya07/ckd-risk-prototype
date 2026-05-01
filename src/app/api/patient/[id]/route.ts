import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fetchMockFhirLabs } from '@/lib/apiConnector';
import { PatientData } from '@/lib/ckdLogic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Try to find the patient in our in-memory DB
  let patient = db.patients[id];

  // If not found, let's create a dynamic one using the mock API for realism
  if (!patient) {
    const age = Math.floor(Math.random() * 40) + 40;
    const sex = Math.random() > 0.5 ? 'M' : 'F';
    const labs = await fetchMockFhirLabs(id);
    
    patient = {
      id,
      age,
      sex: sex as 'M' | 'F',
      creatinine: labs.creatinine || 1.0,
      urineProtein: labs.urineProtein || 0,
      bloodPressure: labs.bloodPressure || '120/80',
      glucose: labs.glucose || 100,
      hbA1c: labs.hbA1c,
      cholesterol: labs.cholesterol,
      weight: Math.floor(Math.random() * 40) + 60,
      height: 170
    };
    db.patients[id] = patient;
    db.logs[id] = [];
  }

  return NextResponse.json({
    patient,
    logs: db.logs[id] || []
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (!db.patients[id]) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  if (!db.logs[id]) {
    db.logs[id] = [];
  }

  // Ensure there's a date
  if (!body.date) {
    body.date = new Date().toISOString();
  }

  db.logs[id].push(body);

  return NextResponse.json({ success: true, log: body });
}
