import React, { useEffect } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedStepNodeForm } from './AutomatedStepNodeForm';
import { EndNodeForm } from './EndNodeForm';
import { ConditionNodeForm } from './ConditionNodeForm';
import { EmailNodeForm } from './EmailNodeForm';
import { TimerNodeForm } from './TimerNodeForm';
import { WebhookNodeForm } from './WebhookNodeForm';
import { Button } from '../ui/Button';
import styles from './NodeFormPanel.module.css';

const FORM_MAP: Record<string, React.FC<{ nodeId: string; data: any }>> = {
  startNode: StartNodeForm,
  taskNode: TaskNodeForm,
  approvalNode: ApprovalNodeForm,
  automatedStepNode: AutomatedStepNodeForm,
  endNode: EndNodeForm,
  conditionNode: ConditionNodeForm,
  emailNode: EmailNodeForm,
  timerNode: TimerNodeForm,
  webhookNode: WebhookNodeForm,
};

const NODE_LABELS: Record<string, string> = {
  startNode: 'Start Node',
  taskNode: 'Task Node',
  approvalNode: 'Approval Node',
  automatedStepNode: 'Automated Step',
  endNode: 'End Node',
  conditionNode: 'Condition Node',
  emailNode: 'Email Node',
  timerNode: 'Timer Node',
  webhookNode: 'Webhook Node',
};

const NODE_COLORS: Record<string, string> = {
  startNode: '#10b981',
  taskNode: '#3b82f6',
  approvalNode: '#f59e0b',
  automatedStepNode: '#8b5cf6',
  endNode: '#ef4444',
  conditionNode: '#eab308',
  emailNode: '#3b82f6',
  timerNode: '#64748b',
  webhookNode: '#14b8a6',
};

export const NodeFormPanel: React.FC = () => {
  const { selectedNodeId, nodes, selectNode, deleteNode } = useWorkflowStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectNode(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectNode]);

  if (!selectedNode) return null;

  const nodeType = selectedNode.type || '';
  const FormComponent = FORM_MAP[nodeType];
  const accentColor = NODE_COLORS[nodeType] || '#6366f1';

  return (
    <div className={styles.panel} style={{ '--panel-accent': accentColor } as React.CSSProperties}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.colorDot} style={{ background: accentColor }} />
          <div>
            <div className={styles.nodeType}>{NODE_LABELS[nodeType] || 'Node'}</div>
            <div className={styles.nodeId}>ID: {selectedNode.id}</div>
          </div>
        </div>
        <button className={styles.close} onClick={() => selectNode(null)} aria-label="Close form panel">✕</button>
      </div>

      <div className={styles.body}>
        {FormComponent ? (
          <FormComponent nodeId={selectedNode.id} data={selectedNode.data} />
        ) : (
          <div className={styles.unknown}>No form available for this node type.</div>
        )}
      </div>
      <div className={styles.footer}>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => {
            deleteNode(selectedNode.id);
            selectNode(null);
          }}
          aria-label="Delete selected node"
        >
          Delete Node
        </Button>
      </div>
    </div>
  );
};
