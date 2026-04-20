import { http, HttpResponse, delay } from 'msw';
import type { SimulationRequest, SimulationStep } from '../../types/workflow';

const AUTOMATIONS = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employee_id', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'subject', 'duration'] },
];

const STEP_MESSAGES: Record<string, string[]> = {
  startNode: ['Workflow initiated', 'Trigger conditions met', 'Execution started'],
  taskNode: ['Task assigned to assignee', 'Task queued for completion', 'Human task dispatched'],
  approvalNode: ['Approval request sent', 'Awaiting manager review', 'Auto-approval threshold evaluated'],
  automatedStepNode: ['Automation executed successfully', 'System action triggered', 'Background job dispatched'],
  endNode: ['Workflow completed successfully', 'All steps finalized', 'Execution summary generated'],
  conditionNode: ['Condition evaluated to true', 'Condition evaluated to false', 'Branch logic executed'],
  emailNode: ['Email successfully queued', 'Notification dispatched', 'Message sent to recipients'],
  timerNode: ['Delay period started', 'Waiting duration complete', 'Timer event triggered'],
  webhookNode: ['HTTP request sent', 'API endpoint successfully called', 'Payload delivered'],
};

function randomMessage(type: string): string {
  const messages = STEP_MESSAGES[type] || ['Step executed'];
  return messages[Math.floor(Math.random() * messages.length)];
}

function topologicalSort(
  nodes: SimulationRequest['nodes'],
  edges: SimulationRequest['edges']
): SimulationRequest['nodes'] {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  nodes.forEach((n) => {
    inDegree[n.id] = 0;
    adj[n.id] = [];
  });
  edges.forEach((e) => {
    adj[e.source].push(e.target);
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
  });

  const queue = nodes.filter((n) => inDegree[n.id] === 0);
  const sorted: SimulationRequest['nodes'] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    sorted.push(node);
    adj[node.id].forEach((neighborId) => {
      inDegree[neighborId]--;
      if (inDegree[neighborId] === 0) {
        const neighbor = nodes.find((n) => n.id === neighborId);
        if (neighbor) queue.push(neighbor);
      }
    });
  }

  return sorted.length === nodes.length ? sorted : nodes; // fallback if cycle
}

export const handlers = [
  // GET /automations
  http.get('/api/automations', async () => {
    await delay(300);
    return HttpResponse.json(AUTOMATIONS);
  }),

  // POST /simulate
  http.post('/api/simulate', async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as SimulationRequest;
    const { nodes, edges } = body;

    if (!nodes || nodes.length === 0) {
      return HttpResponse.json({ status: 'error', steps: [], summary: 'Empty workflow.' }, { status: 400 });
    }

    const sorted = topologicalSort(nodes, edges);
    const steps: SimulationStep[] = sorted.map((node, index) => {
      const type = node.type as string;
      const isLast = index === sorted.length - 1;
      const isError = false; // mock: always success

      return {
        nodeId: node.id,
        nodeType: node.type as any,
        label: (node.data as any).label || `Node ${node.id}`,
        status: isError ? 'error' : 'completed',
        message: randomMessage(type),
        timestamp: new Date(Date.now() + index * 1500).toISOString(),
      };
    });

    return HttpResponse.json({
      status: 'success',
      steps,
      summary: `Workflow executed ${steps.length} step(s) successfully.`,
    });
  }),
];
