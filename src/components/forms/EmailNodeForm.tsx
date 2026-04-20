import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input } from '../ui/Input';
import type { EmailNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

export const EmailNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as EmailNodeData;

  const update = (patch: Partial<EmailNodeData>) => updateNodeData(nodeId, patch);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Email Configuration</div>
        <Input
          label="To (Address or Variables)"
          value={d.toParams || ''}
          onChange={(e) => update({ toParams: e.target.value })}
          placeholder="user@example.com or {{employee.email}}"
          id={`email-to-${nodeId}`}
        />
        <Input
          label="Subject"
          value={d.subject || ''}
          onChange={(e) => update({ subject: e.target.value })}
          placeholder="Welcome to the team!"
          id={`email-subj-${nodeId}`}
        />
        
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor={`email-body-${nodeId}`}>Body</label>
          <textarea
            id={`email-body-${nodeId}`}
            className={styles.textarea}
            value={d.body || ''}
            onChange={(e) => update({ body: e.target.value })}
            placeholder="Hello {{employee.name}},&#10;Welcome aboard."
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};
