import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { ConditionNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const ConditionNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as ConditionNodeData;
  const { simulationState } = useWorkflowStore();

  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;

  return (
    <BaseNode
      accentColor="#eab308"
      icon="🔀"
      label={d.label || 'Condition'}
      subtitle={d.conditionExpression ? `If: ${d.conditionExpression}` : 'Branching Logic'}
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      nodeType="conditionNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Running</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Done</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}
        {d.truePathLabel && <span className={`${styles.chip} ${styles.chipGray}`}>True: {d.truePathLabel}</span>}
        {d.falsePathLabel && <span className={`${styles.chip} ${styles.chipGray}`}>False: {d.falsePathLabel}</span>}
      </div>
    </BaseNode>
  );
};
