import React from 'react';
import type { SimulationStep } from '../../types/workflow';
import styles from './ExecutionLog.module.css';

interface ExecutionLogProps {
  steps: SimulationStep[];
  summary?: string;
}

const STATUS_CONFIG = {
  completed: { color: '#10b981', icon: '✓', label: 'Completed' },
  skipped: { color: '#f59e0b', icon: '⟶', label: 'Skipped' },
  error: { color: '#ef4444', icon: '✕', label: 'Error' },
};

const TYPE_ICONS: Record<string, string> = {
  startNode: '▶',
  taskNode: '📋',
  approvalNode: '✅',
  automatedStepNode: '⚡',
  endNode: '⏹',
};

export const ExecutionLog: React.FC<ExecutionLogProps> = ({ steps, summary }) => {
  return (
    <div className={styles.log}>
      {summary && (
        <div className={styles.summary}>
          <span className={styles.summaryIcon}>📊</span>
          {summary}
        </div>
      )}

      <div className={styles.timeline}>
        {steps.map((step, index) => {
          const status = STATUS_CONFIG[step.status];
          const isLast = index === steps.length - 1;
          return (
            <div key={step.nodeId} className={styles.step} style={{ animationDelay: `${index * 0.08}s` }}>
              <div className={styles.stepLeft}>
                <div
                  className={styles.statusBadge}
                  style={{ background: status.color + '22', borderColor: status.color + '55', color: status.color }}
                >
                  {status.icon}
                </div>
                {!isLast && <div className={styles.connector} />}
              </div>

              <div className={styles.stepBody}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepIcon}>{TYPE_ICONS[step.nodeType] || '◇'}</span>
                  <span className={styles.stepLabel}>{step.label}</span>
                  <span
                    className={styles.stepStatus}
                    style={{ color: status.color, background: status.color + '18' }}
                  >
                    {status.label}
                  </span>
                </div>
                <div className={styles.stepMessage}>{step.message}</div>
                <div className={styles.stepTime}>
                  {new Date(step.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
