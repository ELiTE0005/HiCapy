import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { TimerNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const TimerNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as TimerNodeData;
  const { simulationState } = useWorkflowStore();

  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;

  return (
    <BaseNode
      accentColor="#64748b"
      icon="⏱️"
      label={d.label || 'Timer Delay'}
      subtitle={`Wait ${d.durationMinutes || 0} min`}
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      nodeType="timerNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Waiting...</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Completed</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}
      </div>
    </BaseNode>
  );
};
