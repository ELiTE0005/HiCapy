import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { NodeFormPanel } from '../forms/NodeFormPanel';
import { StartNode } from '../nodes/StartNode';
import { TaskNode } from '../nodes/TaskNode';
import { ApprovalNode } from '../nodes/ApprovalNode';
import { AutomatedStepNode } from '../nodes/AutomatedStepNode';
import { EndNode } from '../nodes/EndNode';
import { ConditionNode } from '../nodes/ConditionNode';
import { EmailNode } from '../nodes/EmailNode';
import { TimerNode } from '../nodes/TimerNode';
import { WebhookNode } from '../nodes/WebhookNode';
import type { Node } from '@xyflow/react';
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData,
  AutomatedStepNodeData, EndNodeData, ConditionNodeData,
  EmailNodeData, TimerNodeData, WebhookNodeData
} from '../../types/workflow';
import styles from './WorkflowCanvas.module.css';

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedStepNode: AutomatedStepNode,
  endNode: EndNode,
  conditionNode: ConditionNode,
  emailNode: EmailNode,
  timerNode: TimerNode,
  webhookNode: WebhookNode,
};

const defaultNodeData: Record<string, any> = {
  startNode: { label: 'Start', startTitle: 'Start', metadata: {} } as StartNodeData,
  taskNode: { label: 'Task', title: 'Task', description: '', assignee: '', dueDate: '', customFields: {} } as TaskNodeData,
  approvalNode: { label: 'Approval', title: 'Approval', approverRole: '', autoApproveThreshold: 0 } as ApprovalNodeData,
  automatedStepNode: { label: 'Automated Step', title: 'Automated Step', actionId: '', params: {} } as AutomatedStepNodeData,
  endNode: { label: 'End', endMessage: 'Workflow Complete', showSummary: false } as EndNodeData,
  conditionNode: { label: 'Condition', conditionExpression: '', truePathLabel: 'True', falsePathLabel: 'False' } as ConditionNodeData,
  emailNode: { label: 'Email', toParams: '', subject: '', body: '' } as EmailNodeData,
  timerNode: { label: 'Timer', durationMinutes: 60 } as TimerNodeData,
  webhookNode: { label: 'Webhook', url: '', method: 'GET', payloadTemplate: '', headers: {} } as WebhookNodeData,
};

let nodeIdCounter = 1;
const getId = () => `node_${nodeIdCounter++}`;

interface WorkflowCanvasProps {
  theme?: 'dark' | 'light';
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ theme = 'dark' }) => {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    selectNode, selectedNodeId, addNode,
    setZoomLevel,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(null);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow');
      if (!type || !rfInstance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { ...defaultNodeData[type] },
      };

      addNode(newNode);
    },
    [rfInstance, addNode]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className={styles.canvasWrapper} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Backspace"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2, stroke: '#6366f1' },
        }}
        proOptions={{ hideAttribution: true }}
        colorMode={theme}
        onMove={(_, viewport) => setZoomLevel(viewport.zoom)}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.07)"
        />
        <Controls
          className={styles.controls}
          showFitView
          showInteractive
        />
        <MiniMap
          className={styles.minimap}
          nodeColor={(n) => {
            const colorMap: Record<string, string> = {
              startNode: '#22c55e',
              taskNode: '#818cf8',
              approvalNode: '#c084fc',
              automatedStepNode: '#fb923c',
              endNode: '#fb7185',
              conditionNode: '#eab308',
              emailNode: '#3b82f6',
              timerNode: '#64748b',
              webhookNode: '#14b8a6',
            };
            return colorMap[n.type || ''] || '#818cf8';
          }}
        />

        {nodes.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⟶</div>
            <h2 className={styles.emptyTitle}>Start building your workflow</h2>
            <p className={styles.emptyDesc}>Drag node types from the sidebar to get started, or load a template.</p>
          </div>
        )}
      </ReactFlow>

      <NodeFormPanel />
    </div>
  );
};
