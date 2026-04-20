import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { WebhookNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const WebhookNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as WebhookNodeData;
  const { simulationState } = useWorkflowStore();

  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;

  return (
    <BaseNode
      accentColor="#14b8a6"
      icon="🌐"
      label={d.label || 'Webhook'}
      subtitle={d.method && d.url ? `${d.method} ${d.url}` : 'API Request'}
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      nodeType="webhookNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Calling API</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Called</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}
        {d.method && <span className={`${styles.chip} ${styles.chipGray}`}>{d.method}</span>}
      </div>
    </BaseNode>
  );
};
