import React from 'react';
import { Handle, Position } from '@xyflow/react';
import styles from './BaseNode.module.css';

interface BaseNodeProps {
  children?: React.ReactNode;
  accentColor: string;
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  selected?: boolean;
  hasErrors?: boolean;
  showSource?: boolean;
  showTarget?: boolean;
  nodeType?: string;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  children,
  accentColor,
  icon,
  label,
  subtitle,
  selected,
  hasErrors,
  showSource = true,
  showTarget = true,
  nodeType = 'taskNode',
}) => {

  const typeClassMap: Record<string, string> = {
    startNode: styles.ntStart,
    taskNode: styles.ntTask,
    approvalNode: styles.ntApproval,
    automatedStepNode: styles.ntAuto,
    endNode: styles.ntEnd,
    conditionNode: styles.ntCondition,
    emailNode: styles.ntEmail,
    timerNode: styles.ntTimer,
    webhookNode: styles.ntWebhook,
  };

  const currentTypeClass = typeClassMap[nodeType] || styles.ntTask;

  return (
    <div
      className={[
        styles.nodeCard,
        currentTypeClass,
        selected ? styles.selected : '',
        hasErrors ? styles.hasErrors : '',
      ].filter(Boolean).join(' ')}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div className={styles.nodeStrip}></div>
      
      {showTarget && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className={`${styles.handle} ${styles.handleTop}`}
          />
          <Handle
            type="target"
            id="left"
            position={Position.Left}
            className={`${styles.handle} ${styles.handleLeft}`}
          />
        </>
      )}
      
      <div className={styles.nodeHeader}>
        <div className={styles.nodeIcon}>
          {icon}
        </div>
        <div className={styles.nodeTitleGroup}>
          <div className={styles.nodeTitle}>{label}</div>
          <div className={styles.nodeSub}>{subtitle}</div>
        </div>
        {hasErrors ? (
          <div className={styles.errorBadge} title="Fix form errors">!</div>
        ) : (
          <button className={styles.nodeMenu}>⋯</button>
        )}
      </div>

      {children && (
        <div className={styles.nodeBody}>
          {children}
        </div>
      )}

      {showSource && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            className={`${styles.handle} ${styles.handleBottom}`}
          />
          <Handle
            type="source"
            id="right"
            position={Position.Right}
            className={`${styles.handle} ${styles.handleRight}`}
          />
        </>
      )}
    </div>
  );
};
