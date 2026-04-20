import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { EmailNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const EmailNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as EmailNodeData;
  const { simulationState } = useWorkflowStore();

  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;

  return (
    <BaseNode
      accentColor="#3b82f6"
      icon="✉️"
      label={d.label || 'Email Notification'}
      subtitle={d.subject ? `Subj: ${d.subject}` : 'Send Email'}
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      nodeType="emailNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Sending</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Sent</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}
        {d.toParams && <span className={`${styles.chip} ${styles.chipGray}`}>To: {d.toParams}</span>}
      </div>
    </BaseNode>
  );
};
