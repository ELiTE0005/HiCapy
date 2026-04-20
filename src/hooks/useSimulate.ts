import { useState } from 'react';
import { simulateWorkflow } from '../api/simulate';
import { serializeForSimulation } from '../utils/workflowSerializer';
import { validateWorkflow } from '../utils/graphValidation';
import type { Node, Edge } from '@xyflow/react';
import type { SimulationResponse, ValidationResult } from '../types/workflow';
import { useWorkflowStore } from './useWorkflowStore';

export function useSimulate() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runSimulation(nodes: Node[], edges: Edge[]) {
    setError(null);
    setResult(null);

    // Validate first
    const val = validateWorkflow(nodes, edges);
    setValidation(val);
    if (!val.valid) return;

    setLoading(true);
    try {
      const payload = serializeForSimulation(nodes, edges);
      const res = await simulateWorkflow(payload as any);
      
      // Visual simulation playback
      const store = useWorkflowStore.getState();
      store.setSimulationState({ isRunning: true, executedNodes: [], currentNodeId: undefined });
      
      for (const step of res.steps) {
        store.setSimulationState({ currentNodeId: step.nodeId });
        await new Promise(r => setTimeout(r, 800)); // Visual delay
        const currentExecuted = useWorkflowStore.getState().simulationState.executedNodes;
        store.setSimulationState({ executedNodes: [...currentExecuted, step.nodeId], currentNodeId: undefined });
      }

      setResult(res);
      store.setSimulationState({ isRunning: false });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setValidation(null);
    setError(null);
    useWorkflowStore.getState().setSimulationState({ isRunning: false, executedNodes: [], currentNodeId: undefined });
  }

  return { loading, result, validation, error, runSimulation, reset };
}
