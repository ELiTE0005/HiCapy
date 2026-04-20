import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import type { EndNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

export const EndNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as EndNodeData;

  const update = (patch: Partial<EndNodeData>) => updateNodeData(nodeId, patch);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Completion</div>
        <Input
          label="End Message"
          value={d.endMessage || ''}
          onChange={(e) => update({ endMessage: e.target.value, label: e.target.value || 'End' })}
          placeholder="e.g. Onboarding complete!"
          id={`end-message-${nodeId}`}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Options</div>
        <Toggle
          label="Generate Summary Report"
          checked={d.showSummary ?? false}
          onChange={(showSummary) => update({ showSummary })}
          id={`end-summary-${nodeId}`}
        />
        <div className={styles.hint}>
          When enabled, a summary of all completed steps will be attached to the workflow completion event.
        </div>
      </div>

      {(d.validationErrors?.length ?? 0) > 0 && (
        <div className={styles.errors}>
          {d.validationErrors!.map((e, i) => (
            <div key={i} className={styles.errorItem}>⚠ {e}</div>
          ))}
        </div>
      )}
    </div>
  );
};
