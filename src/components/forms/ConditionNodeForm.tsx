import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input } from '../ui/Input';
import type { ConditionNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

export const ConditionNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as ConditionNodeData;

  const update = (patch: Partial<ConditionNodeData>) => updateNodeData(nodeId, patch);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Branch Logic</div>
        <Input
          label="Condition Expression"
          value={d.conditionExpression || ''}
          onChange={(e) => update({ conditionExpression: e.target.value })}
          placeholder="e.g. EmployeeLevel > 3"
          id={`cond-expr-${nodeId}`}
        />
        <div className={styles.hint}>
          Specify a logical expression. Connected edges should use the true/false paths.
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Path Labels</div>
        <Input
          label="True Path Label"
          value={d.truePathLabel || 'True'}
          onChange={(e) => update({ truePathLabel: e.target.value })}
          id={`cond-true-${nodeId}`}
        />
        <Input
          label="False Path Label"
          value={d.falsePathLabel || 'False'}
          onChange={(e) => update({ falsePathLabel: e.target.value })}
          id={`cond-false-${nodeId}`}
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
