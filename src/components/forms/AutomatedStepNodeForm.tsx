import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input, Select } from '../ui/Input';
import { useAutomations } from '../../hooks/useAutomations';
import type { AutomatedStepNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

export const AutomatedStepNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as AutomatedStepNodeData;
  const { automations, loading } = useAutomations();

  const update = (patch: Partial<AutomatedStepNodeData>) => updateNodeData(nodeId, patch);

  const selectedAction = automations.find((a) => a.id === d.actionId);

  const handleActionChange = (actionId: string) => {
    const action = automations.find((a) => a.id === actionId);
    // Reset params when action changes
    const params: Record<string, string> = {};
    action?.params.forEach((p) => (params[p] = d.params?.[p] || ''));
    update({ actionId, params, label: action?.label || 'Automated Step' });
  };

  const actionOptions = [
    { value: '', label: loading ? 'Loading actions…' : 'Select an action…' },
    ...automations.map((a) => ({ value: a.id, label: a.label })),
  ];

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Automation</div>
        <Input
          label="Step Title"
          value={d.title || ''}
          onChange={(e) => update({ title: e.target.value, label: e.target.value || 'Automated Step' })}
          placeholder="e.g. Send Welcome Email"
          id={`auto-title-${nodeId}`}
        />
        <Select
          label="Action"
          value={d.actionId || ''}
          onChange={(e) => handleActionChange(e.target.value)}
          options={actionOptions}
          id={`auto-action-${nodeId}`}
        />
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Action Parameters</div>
          {selectedAction.params.map((param) => (
            <Input
              key={param}
              label={param.replace(/_/g, ' ')}
              value={d.params?.[param] || ''}
              onChange={(e) =>
                update({ params: { ...d.params, [param]: e.target.value } })
              }
              placeholder={`Enter ${param}`}
              id={`auto-param-${nodeId}-${param}`}
            />
          ))}
        </div>
      )}

      {!d.actionId && (
        <div className={styles.hint}>Select an action from the API to configure its parameters.</div>
      )}

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
