import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { EndNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const EndNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as EndNodeData;
  const { simulationState } = useWorkflowStore();
  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;
  return (
    <BaseNode
      accentColor="#fb7185"
      icon="🏁"
      label={d.endMessage || d.label || 'End'}
      subtitle="Workflow completion"
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      showSource={false}
      nodeType="endNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Running</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Done</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}

        {d.showSummary && <span className={`${styles.chip} ${styles.chipBlue}`}>📊 Summary enabled</span>}
      </div>
    </BaseNode>
  );
};
