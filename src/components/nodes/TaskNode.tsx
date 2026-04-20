import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { TaskNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const TaskNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as TaskNodeData;
  const { simulationState } = useWorkflowStore();

  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;
  const cFieldsCount = Object.keys(d.customFields || {}).length;
  return (
    <BaseNode
      accentColor="#818cf8"
      icon="📋"
      label={d.title || d.label || 'Data Collection'}
      subtitle={d.assignee ? `Assignee: ${d.assignee}` : 'Human task'}
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      nodeType="taskNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Running</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Done</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}
        
        {cFieldsCount > 0 && <span className={`${styles.chip} ${styles.chipGray}`}>📝 {cFieldsCount} fields</span>}
        {d.dueDate && <span className={`${styles.chip} ${styles.chipGray}`}>📅 {d.dueDate}</span>}
        {d.customFields?.priority && <span className={`${styles.chip} ${d.customFields.priority === 'High' ? styles.chipRed : styles.chipAmber}`}>⚡ Prio: {d.customFields.priority}</span>}
      </div>
    </BaseNode>
  );
};
