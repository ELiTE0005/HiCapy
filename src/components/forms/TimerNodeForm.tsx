import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input } from '../ui/Input';
import type { TimerNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

export const TimerNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as TimerNodeData;

  const update = (patch: Partial<TimerNodeData>) => updateNodeData(nodeId, patch);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Timer Configuration</div>
        <Input
          label="Duration (Minutes)"
          type="number"
          value={(d.durationMinutes || 0).toString()}
          onChange={(e) => update({ durationMinutes: parseInt(e.target.value, 10) || 0 })}
          id={`timer-dur-${nodeId}`}
        />
        <div className={styles.hint}>
          The workflow will halt at this node for the specified duration before proceeding.
        </div>
      </div>
    </div>
  );
};
