import React from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { ApprovalNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeCommon.module.css';

export const ApprovalNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const d = data as unknown as ApprovalNodeData;
  const { simulationState } = useWorkflowStore();

  const isExecuted = simulationState.executedNodes.includes(id);
  const isRunning = simulationState.currentNodeId === id;
  return (
    <BaseNode
      accentColor="#c084fc"
      icon="🛡️"
      label={d.title || d.label || 'Legal Review'}
      subtitle={d.approverRole ? `Approver: ${d.approverRole}` : 'Approval step'}
      selected={selected}
      hasErrors={(d.validationErrors?.length ?? 0) > 0}
      nodeType="approvalNode"
    >
      <div className={styles.meta}>
        {isRunning && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳ Running</span>}
        {isExecuted && <span className={`${styles.chip} ${styles.chipGreen}`}>✓ Done</span>}
        {!isRunning && !isExecuted && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>Pending...</span>}

        {d.approverRole && <span className={`${styles.chip} ${styles.chipGray}`}>👤 {d.approverRole}</span>}
        {d.autoApproveThreshold > 0 && <span className={`${styles.chip} ${styles.chipAmber}`}>Auto ≥ {d.autoApproveThreshold}</span>}
      </div>
    </BaseNode>
  );
};
