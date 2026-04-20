import { useEffect, useState } from 'react';
import { fetchAutomations } from '../api/automations';
import type { AutomationAction } from '../types/workflow';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAutomations()
      .then(setAutomations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { automations, loading, error };
}
