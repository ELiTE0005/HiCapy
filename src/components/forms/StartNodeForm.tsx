import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input } from '../ui/Input';
import { KeyValueEditor } from '../ui/KeyValueEditor';
import type { StartNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

export const StartNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as StartNodeData;

  const update = (patch: Partial<StartNodeData>) => updateNodeData(nodeId, patch);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Basic Info</div>
        <Input
          label="Start Title"
          value={d.startTitle || ''}
          onChange={(e) => update({ startTitle: e.target.value, label: e.target.value || 'Start' })}
          placeholder="e.g. Onboarding Start"
          id={`start-title-${nodeId}`}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Metadata</div>
        <KeyValueEditor
          label="Key-Value Pairs"
          value={d.metadata || {}}
          onChange={(metadata) => update({ metadata })}
          keyPlaceholder="e.g. department"
          valuePlaceholder="e.g. Engineering"
        />
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
