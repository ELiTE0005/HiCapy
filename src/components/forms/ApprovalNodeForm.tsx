import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input, Select } from '../ui/Input';
import type { ApprovalNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

const APPROVER_ROLES = [
  { value: '', label: 'Select role…' },
  { value: 'Manager', label: 'Manager' },
  { value: 'HRBP', label: 'HR Business Partner (HRBP)' },
  { value: 'Director', label: 'Director' },
  { value: 'VP', label: 'VP / Head of Department' },
  { value: 'CEO', label: 'CEO / Executive' },
  { value: 'Legal', label: 'Legal Counsel' },
];

export const ApprovalNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as ApprovalNodeData;

  const update = (patch: Partial<ApprovalNodeData>) => updateNodeData(nodeId, patch);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Approval Details</div>
        <Input
          label="Title"
          value={d.title || ''}
          onChange={(e) => update({ title: e.target.value, label: e.target.value || 'Approval' })}
          placeholder="e.g. Manager Sign-off"
          id={`approval-title-${nodeId}`}
        />
        <Select
          label="Approver Role"
          value={d.approverRole || ''}
          onChange={(e) => update({ approverRole: e.target.value })}
          options={APPROVER_ROLES}
          id={`approval-role-${nodeId}`}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Auto-Approve</div>
        <Input
          label="Auto-Approve Threshold (days)"
          type="number"
          min={0}
          value={d.autoApproveThreshold ?? 0}
          onChange={(e) => update({ autoApproveThreshold: Number(e.target.value) })}
          id={`approval-threshold-${nodeId}`}
        />
        <div className={styles.hint}>
          If no action is taken within this many days, the step is auto-approved. Set to 0 to disable.
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
