import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { StartNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const StartNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as StartNodeData;
  const { simulationState } = useWorkflowStore();
  
  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;
  const metaCount = Object.keys(d.metadata || {}).length;
  return (
    <BaseNode
      accentColor="#22c55e"
      icon="✅"
      label={d.startTitle || d.label || 'Start'}
      subtitle="Workflow entry point"
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      showTarget={false}
      nodeType="startNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Running</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Done</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}

        {d.metadata?.department && <span className={`${styles.chip} ${styles.chipGray}`}>🏢 {d.metadata.department}</span>}
        {metaCount > 0 && <span className={`${styles.chip} ${styles.chipGray}`}>📝 {metaCount} fields</span>}
      </div>
    </BaseNode>
  );
};
