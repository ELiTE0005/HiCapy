import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input, Textarea } from '../ui/Input';
import { KeyValueEditor } from '../ui/KeyValueEditor';
import type { TaskNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

export const TaskNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as TaskNodeData;

  const update = (patch: Partial<TaskNodeData>) => updateNodeData(nodeId, patch);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Task Details</div>
        <Input
          label="Title *"
          value={d.title || ''}
          onChange={(e) => update({ title: e.target.value, label: e.target.value || 'Task' })}
          placeholder="e.g. Collect Documents"
          id={`task-title-${nodeId}`}
          required
        />
        <Textarea
          label="Description"
          value={d.description || ''}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="What does this task involve?"
          id={`task-desc-${nodeId}`}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Assignment</div>
        <Input
          label="Assignee"
          value={d.assignee || ''}
          onChange={(e) => update({ assignee: e.target.value })}
          placeholder="e.g. hr-manager@company.com"
          id={`task-assignee-${nodeId}`}
        />
        <Input
          label="Due Date"
          type="date"
          value={d.dueDate || ''}
          onChange={(e) => update({ dueDate: e.target.value })}
          id={`task-due-${nodeId}`}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Custom Fields</div>
        <KeyValueEditor
          value={d.customFields || {}}
          onChange={(customFields) => update({ customFields })}
          keyPlaceholder="Field name"
          valuePlaceholder="Field value"
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
