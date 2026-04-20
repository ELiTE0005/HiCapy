// ─── Node Data Types ─────────────────────────────────────────────────────────

export interface BaseNodeData {
  label: string;
  validationErrors?: string[];
  [key: string]: unknown;
}

export interface StartNodeData extends BaseNodeData {
  startTitle: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  title: string;
  actionId: string;
  params: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  endMessage: string;
  showSummary: boolean;
}

export interface ConditionNodeData extends BaseNodeData {
  conditionExpression: string;
  truePathLabel?: string;
  falsePathLabel?: string;
}

export interface EmailNodeData extends BaseNodeData {
  toParams: string;
  subject: string;
  body: string;
}

export interface TimerNodeData extends BaseNodeData {
  durationMinutes: number;
}

export interface WebhookNodeData extends BaseNodeData {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  payloadTemplate: string;
  headers: Record<string, string>;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData
  | ConditionNodeData
  | EmailNodeData
  | TimerNodeData
  | WebhookNodeData;

// ─── Node Types Enum ──────────────────────────────────────────────────────────

export type WorkflowNodeType =
  | 'startNode'
  | 'taskNode'
  | 'approvalNode'
  | 'automatedStepNode'
  | 'endNode'
  | 'conditionNode'
  | 'emailNode'
  | 'timerNode'
  | 'webhookNode';

// ─── API Types ────────────────────────────────────────────────────────────────

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: WorkflowNodeType;
  label: string;
  status: 'completed' | 'skipped' | 'error';
  message: string;
  timestamp: string;
}

export interface SimulationRequest {
  nodes: Array<{ id: string; type: string; data: NodeData }>;
  edges: Array<{ id: string; source: string; target: string }>;
}

export interface SimulationResponse {
  status: 'success' | 'error';
  steps: SimulationStep[];
  summary?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationError {
  nodeId: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ─── History (Undo/Redo) ──────────────────────────────────────────────────────

export interface HistorySnapshot {
  nodes: any[];
  edges: any[];
}
