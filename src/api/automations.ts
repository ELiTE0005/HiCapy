import type { AutomationAction } from '../types/workflow';

export async function fetchAutomations(): Promise<AutomationAction[]> {
  const res = await fetch('/api/automations');
  if (!res.ok) throw new Error('Failed to fetch automations');
  return res.json();
}
