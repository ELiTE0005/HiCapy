import type { SimulationRequest, SimulationResponse } from '../types/workflow';

export async function simulateWorkflow(payload: SimulationRequest): Promise<SimulationResponse> {
  const res = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ summary: 'Unknown error' }));
    throw new Error(err.summary || 'Simulation failed');
  }
  return res.json();
}
