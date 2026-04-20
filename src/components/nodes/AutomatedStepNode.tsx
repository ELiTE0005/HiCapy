import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { AutomatedStepNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const AutomatedStepNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as AutomatedStepNodeData;
  const { simulationState } = useWorkflowStore();
  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;
  const paramCount = Object.keys(d.params || {}).length;
  return (
    <BaseNode
      accentColor="#fb923c"
      icon="⚙️"
      label={d.title || d.label || 'Automated Step'}
      subtitle={d.actionId ? `Action: ${d.actionId}` : 'System action'}
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      nodeType="automatedStepNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Running</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Done</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}

        {d.actionId && <span className={`${styles.chip} ${styles.chipBlue}`}>🎯 {d.actionId}</span>}
        {paramCount > 0 && <span className={`${styles.chip} ${styles.chipGray}`}>{paramCount} param</span>}
      </div>
    </BaseNode>
  );
};
