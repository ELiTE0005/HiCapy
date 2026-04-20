import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { WebhookNodeData } from '../../types/workflow';
import styles from './FormCommon.module.css';

export const WebhookNodeForm: React.FC<{ nodeId: string; data: any }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const d = data as WebhookNodeData;

  const update = (patch: Partial<WebhookNodeData>) => updateNodeData(nodeId, patch);

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Request Configuration</div>
        <Select
          label="Method"
          value={d.method || 'GET'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => update({ method: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' })}
          options={[
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'DELETE', value: 'DELETE' },
          ]}
          id={`hook-method-${nodeId}`}
        />
        <Input
          label="Endpoint URL"
          value={d.url || ''}
          onChange={(e) => update({ url: e.target.value })}
          placeholder="https://api.example.com/v1/trigger"
          id={`hook-url-${nodeId}`}
        />
      </div>
      
      {(d.method === 'POST' || d.method === 'PUT') && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Payload</div>
          <div className={styles.inputGroup}>
            <textarea
              id={`hook-payload-${nodeId}`}
              className={styles.textarea}
              value={d.payloadTemplate || ''}
              onChange={(e) => update({ payloadTemplate: e.target.value })}
              placeholder='{ "userId": "{{user.id}}" }'
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  );
};
