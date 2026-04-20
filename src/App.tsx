import React, { useState, useEffect, useRef } from 'react';
import { NodeSidebar } from './components/canvas/NodeSidebar';
import { CanvasToolbar } from './components/canvas/CanvasToolbar';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { SandboxPanel } from './components/sandbox/SandboxPanel';
import { InsightPanel } from './components/panels/InsightPanel';
import { StatusBar } from './components/canvas/StatusBar';
import { ToastContainer, showToast } from './components/ui/Toast';
import { useWorkflowStore } from './hooks/useWorkflowStore';
import { importWorkflow, serializeForSimulation } from './utils/workflowSerializer';
import { applyAutoLayout } from './utils/autoLayout';
import type { Node, Edge } from '@xyflow/react';
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData,
  AutomatedStepNodeData, EndNodeData, ConditionNodeData,
  EmailNodeData, TimerNodeData, WebhookNodeData
} from './types/workflow';
import { WaitlistHero } from './components/ui/WaitlistHero';
import styles from './App.module.css';

// ─── Built-in workflow templates ─────────────────────────────────────────────
function makeOnboardingTemplate(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    { id: 't1', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Onboarding Start', startTitle: 'Onboarding Start', metadata: { department: 'Engineering' } } as StartNodeData },
    { id: 't2', type: 'taskNode', position: { x: 0, y: 0 }, data: { label: 'Collect Documents', title: 'Collect Documents', description: 'Gather ID, contracts, tax forms', assignee: 'hr@company.com', dueDate: '', customFields: {} } as TaskNodeData },
    { id: 't3', type: 'conditionNode', position: { x: 0, y: 0 }, data: { label: 'Is Manager?', conditionExpression: 'role == "Manager"', truePathLabel: 'Yes', falsePathLabel: 'No' } as ConditionNodeData },
    { id: 't4_true', type: 'webhookNode', position: { x: 0, y: 0 }, data: { label: 'IT Ticket (Laptop)', url: 'https://jira.company.com/api/ticket', method: 'POST', payloadTemplate: '{"issue": "Macbook Pro"}', headers: {} } as WebhookNodeData },
    { id: 't4_false', type: 'taskNode', position: { x: 0, y: 0 }, data: { label: 'Standard Setup', title: 'Standard Setup', description: 'Standard employee docs', assignee: 'hr', dueDate: '', customFields: {} } as TaskNodeData },
    { id: 't5', type: 'timerNode', position: { x: 0, y: 0 }, data: { label: 'Wait 1 Day', durationMinutes: 1440 } as TimerNodeData },
    { id: 't6', type: 'emailNode', position: { x: 0, y: 0 }, data: { label: 'Welcome Email', toParams: '{{emp.email}}', subject: 'Welcome on board!', body: 'We are excited to have you.' } as EmailNodeData },
    { id: 't7', type: 'endNode', position: { x: 0, y: 0 }, data: { label: 'Onboarding Complete', endMessage: 'Onboarding Complete', showSummary: true } as EndNodeData },
  ];
  const edges: Edge[] = [
    { id: 'e1', source: 't1', target: 't2', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'e2', source: 't2', target: 't3', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'e3', source: 't3', target: 't4_true', type: 'smoothstep', animated: true, label: 'Yes', style: { strokeWidth: 2, stroke: '#22c55e' } },
    { id: 'e4', source: 't3', target: 't4_false', type: 'smoothstep', animated: true, label: 'No', style: { strokeWidth: 2, stroke: '#ef4444' } },
    { id: 'e5', source: 't4_true', target: 't5', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'e6', source: 't4_false', target: 't5', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'e7', source: 't5', target: 't6', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'e8', source: 't6', target: 't7', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  ];
  return { nodes: applyAutoLayout(nodes, edges), edges };
}

function makeLeaveApprovalTemplate(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    { id: 'l1', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Leave Request', startTitle: 'Leave Request', metadata: { type: 'Annual Leave' } } as StartNodeData },
    { id: 'l2', type: 'conditionNode', position: { x: 0, y: 0 }, data: { label: 'Leave > 3 Days?', conditionExpression: 'days > 3', truePathLabel: 'True', falsePathLabel: 'False' } as ConditionNodeData },
    { id: 'l3_true', type: 'approvalNode', position: { x: 0, y: 0 }, data: { label: 'Manager Approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 5 } as ApprovalNodeData },
    { id: 'l3_false', type: 'automatedStepNode', position: { x: 0, y: 0 }, data: { label: 'Auto-Approve', title: 'Auto-Approve', actionId: 'system_approve', params: {} } as AutomatedStepNodeData },
    { id: 'l4', type: 'webhookNode', position: { x: 0, y: 0 }, data: { label: 'Timesheet API', url: 'https://api.timesheet.app/leave', method: 'PUT', payloadTemplate: '', headers: {} } as WebhookNodeData },
    { id: 'l5', type: 'emailNode', position: { x: 0, y: 0 }, data: { label: 'Notify Employee', toParams: '{{requester.email}}', subject: 'Leave Update', body: 'Your leave has been processed.' } as EmailNodeData },
    { id: 'l6', type: 'endNode', position: { x: 0, y: 0 }, data: { label: 'Leave Approved', endMessage: 'Leave request approved', showSummary: false } as EndNodeData },
  ];
  const edges: Edge[] = [
    { id: 'le1', source: 'l1', target: 'l2', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'le2_t', source: 'l2', target: 'l3_true', type: 'smoothstep', animated: true, label: 'Yes', style: { strokeWidth: 2, stroke: '#22c55e' } },
    { id: 'le2_f', source: 'l2', target: 'l3_false', type: 'smoothstep', animated: true, label: 'No', style: { strokeWidth: 2, stroke: '#ef4444' } },
    { id: 'le3_t', source: 'l3_true', target: 'l4', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'le3_f', source: 'l3_false', target: 'l4', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'le4', source: 'l4', target: 'l5', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'le5', source: 'l5', target: 'l6', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  ];
  return { nodes: applyAutoLayout(nodes, edges), edges };
}

function makeDocVerificationTemplate(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    { id: 'd1', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Doc Submitted', startTitle: 'Document Submitted', metadata: { doc_type: 'ID Verification' } } as StartNodeData },
    { id: 'd2', type: 'webhookNode', position: { x: 0, y: 0 }, data: { label: 'AI OCR API', url: 'https://ai-ocr.intranet/verify', method: 'POST', payloadTemplate: '{"docId":"123"}', headers: {} } as WebhookNodeData },
    { id: 'd3', type: 'conditionNode', position: { x: 0, y: 0 }, data: { label: 'Verify Pass?', conditionExpression: 'ocr_confidence > 0.90', truePathLabel: 'True', falsePathLabel: 'False' } as ConditionNodeData },
    { id: 'd4_false', type: 'taskNode', position: { x: 0, y: 0 }, data: { label: 'Manual Review', title: 'Manual Review', description: 'HR reviews uploaded document', assignee: 'hr-team', dueDate: '', customFields: { priority: 'High' } } as TaskNodeData },
    { id: 'd4_true', type: 'automatedStepNode', position: { x: 0, y: 0 }, data: { label: 'Generate Cert', title: 'Generate Certificate', actionId: 'generate_doc', params: { template: 'verification_cert', recipient: '' } } as AutomatedStepNodeData },
    { id: 'd5', type: 'emailNode', position: { x: 0, y: 0 }, data: { label: 'Success Email', toParams: '{{user.email}}', subject: 'Verified', body: 'Verified!' } as EmailNodeData },
    { id: 'd6', type: 'endNode', position: { x: 0, y: 0 }, data: { label: 'Verification Done', endMessage: 'Document verified successfully', showSummary: true } as EndNodeData },
  ];
  const edges: Edge[] = [
    { id: 'de1', source: 'd1', target: 'd2', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'de2', source: 'd2', target: 'd3', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'de3_t', source: 'd3', target: 'd4_true', type: 'smoothstep', animated: true, label: 'Pass', style: { strokeWidth: 2, stroke: '#22c55e' } },
    { id: 'de3_f', source: 'd3', target: 'd4_false', type: 'smoothstep', animated: true, label: 'Fail', style: { strokeWidth: 2, stroke: '#ef4444' } },
    { id: 'de4_f', source: 'd4_false', target: 'd4_true', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'de4_t', source: 'd4_true', target: 'd5', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'de5', source: 'd5', target: 'd6', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  ];
  return { nodes: applyAutoLayout(nodes, edges), edges };
}
function makePerformanceReviewTemplate(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    { id: 'p1', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Review Start', startTitle: 'Annual Performance Review', metadata: { cycle: 'Q4' } } as StartNodeData },
    { id: 'p2', type: 'timerNode', position: { x: 0, y: 0 }, data: { label: 'Wait 3 Months', durationMinutes: 129600 } as TimerNodeData },
    { id: 'p3', type: 'taskNode', position: { x: 0, y: 0 }, data: { label: 'Self Review', title: 'Employee Self Review', description: 'Employee evaluates their performance', assignee: 'employee', dueDate: '', customFields: {} } as TaskNodeData },
    { id: 'p4', type: 'taskNode', position: { x: 0, y: 0 }, data: { label: 'Manager Review', title: 'Manager Review', description: 'Manager evaluates performance', assignee: 'manager', dueDate: '', customFields: {} } as TaskNodeData },
    { id: 'p5', type: 'webhookNode', position: { x: 0, y: 0 }, data: { label: 'Update HRIS', url: 'https://hris.local/api/performance', method: 'PUT', payloadTemplate: '{"rating": "{{manager_rating}}"}', headers: {} } as WebhookNodeData },
    { id: 'p6', type: 'endNode', position: { x: 0, y: 0 }, data: { label: 'Review Complete', endMessage: 'Performance review concluded', showSummary: true } as EndNodeData },
  ];
  const edges: Edge[] = [
    { id: 'pe1', source: 'p1', target: 'p2', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'pe2', source: 'p2', target: 'p3', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'pe3', source: 'p3', target: 'p4', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'pe4', source: 'p4', target: 'p5', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'pe5', source: 'p5', target: 'p6', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  ];
  return { nodes: applyAutoLayout(nodes, edges), edges };
}

function makeExpenseReimbursementTemplate(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    { id: 'ex1', type: 'startNode', position: { x: 0, y: 0 }, data: { label: 'Expense Submission', startTitle: 'Expense Reimbursement', metadata: { type: 'Travel' } } as StartNodeData },
    { id: 'ex2', type: 'taskNode', position: { x: 0, y: 0 }, data: { label: 'Upload Receipts', title: 'Upload Receipts', description: 'Employee provides proof of expense', assignee: 'employee', dueDate: '', customFields: {} } as TaskNodeData },
    { id: 'ex3', type: 'conditionNode', position: { x: 0, y: 0 }, data: { label: 'Amount > $500?', conditionExpression: 'amount > 500', truePathLabel: 'True', falsePathLabel: 'False' } as ConditionNodeData },
    { id: 'ex4_true', type: 'approvalNode', position: { x: 0, y: 0 }, data: { label: 'VP Approval', title: 'VP Approval', approverRole: 'VP', autoApproveThreshold: 10 } as ApprovalNodeData },
    { id: 'ex4_false', type: 'approvalNode', position: { x: 0, y: 0 }, data: { label: 'Manager Approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 5 } as ApprovalNodeData },
    { id: 'ex5', type: 'webhookNode', position: { x: 0, y: 0 }, data: { label: 'ERP Integration', url: 'https://erp.local/api/reimburse', method: 'POST', payloadTemplate: '{}', headers: {} } as WebhookNodeData },
    { id: 'ex6', type: 'emailNode', position: { x: 0, y: 0 }, data: { label: 'Status Email', toParams: '{{employee.email}}', subject: 'Reimbursement Processed', body: 'Payment is on the way.' } as EmailNodeData },
    { id: 'ex7', type: 'endNode', position: { x: 0, y: 0 }, data: { label: 'Reimbursed', endMessage: 'Expense processed successfully', showSummary: false } as EndNodeData },
  ];
  const edges: Edge[] = [
    { id: 'exe1', source: 'ex1', target: 'ex2', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'exe2', source: 'ex2', target: 'ex3', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'exe3_t', source: 'ex3', target: 'ex4_true', type: 'smoothstep', animated: true, label: 'Yes', style: { strokeWidth: 2, stroke: '#22c55e' } },
    { id: 'exe3_f', source: 'ex3', target: 'ex4_false', type: 'smoothstep', animated: true, label: 'No', style: { strokeWidth: 2, stroke: '#ef4444' } },
    { id: 'exe4_t', source: 'ex4_true', target: 'ex5', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'exe4_f', source: 'ex4_false', target: 'ex5', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'exe5', source: 'ex5', target: 'ex6', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
    { id: 'exe6', source: 'ex6', target: 'ex7', type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  ];
  return { nodes: applyAutoLayout(nodes, edges), edges };
}


const TEMPLATE_MAP: Record<string, () => { nodes: Node[]; edges: Edge[] }> = {
  'Onboarding': makeOnboardingTemplate,
  'Leave Approval': makeLeaveApprovalTemplate,
  'Doc Verification': makeDocVerificationTemplate,
  'Performance Review': makePerformanceReviewTemplate,
  'Expense Reimbursement': makeExpenseReimbursementTemplate,
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark') ? 'dark' : 'light';
  });
  const [workflowName, setWorkflowName] = useState('User Automation');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [customTemplates, setCustomTemplates] = useState<Record<string, { nodes: Node[]; edges: Edge[] }>>({});
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { nodes, edges, setWorkflow, undo, redo, isSidebarOpen } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // App initialization loader
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load custom templates on mount
  useEffect(() => {
    const saved = localStorage.getItem('hr_custom_templates');
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse custom templates', e);
      }
    }
  }, []);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo]);

  const handleTemplateLoad = (name: string) => {
    const factory = TEMPLATE_MAP[name];
    if (factory) {
      const { nodes, edges } = factory();
      setWorkflow(nodes, edges);
      setWorkflowName(name + ' Workflow');
      showToast(`Template loaded: ${name}`, 'info');
      return;
    }
    
    // Check custom templates
    const custom = customTemplates[name];
    if (custom) {
      // Create new clone for state safety
      const clonedNodes = JSON.parse(JSON.stringify(custom.nodes));
      const clonedEdges = JSON.parse(JSON.stringify(custom.edges));
      setWorkflow(clonedNodes, clonedEdges);
      setWorkflowName(name);
      showToast(`Custom Template loaded: ${name}`, 'info');
      return;
    }
  };

  const handleSaveAsTemplate = () => {
    const name = window.prompt("Enter a name for your custom template:");
    if (!name || name.trim() === '') return;
    
    const trimmedName = name.trim();
    if (TEMPLATE_MAP[trimmedName]) {
      showToast(`Cannot overwrite built-in template.`, 'error');
      return;
    }

    const payload = serializeForSimulation(nodes, edges);
    const newTemplates = { 
      ...customTemplates, 
      [trimmedName]: { 
        nodes: payload.nodes as unknown as Node[], 
        edges: payload.edges as unknown as Edge[] 
      } 
    };
    setCustomTemplates(newTemplates);
    localStorage.setItem('hr_custom_templates', JSON.stringify(newTemplates));
    showToast(`Template saved: ${trimmedName}`, 'success');
  };

  const handleNewWorkflow = () => {
    if (nodes.length > 0) {
      if (!window.confirm("Are you sure you want to clear the canvas? Unsaved changes will be lost.")) return;
    }
    setWorkflow([], []);
    setWorkflowName('Untitled Workflow');
    showToast('New workflow started', 'info');
  };

  const handleSave = () => {
    try {
      const payload = serializeForSimulation(nodes, edges);
      const blob = new Blob([JSON.stringify({ name: workflowName, ...payload }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workflowName.replace(/\s+/g, '_').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setLastSaved(new Date());
      showToast('Workflow saved!', 'success');
    } catch {
      showToast('Save failed', 'error');
    }
  };

  const handleDeploy = () => {
    if (nodes.length === 0) { showToast('Nothing to deploy — add nodes first', 'warn'); return; }
    showToast('Deploying workflow…', 'info');
    setTimeout(() => showToast('Workflow deployed successfully!', 'success'), 1500);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { nodes, edges } = await importWorkflow(file);
      setWorkflow(nodes, edges);
    } catch (err) {
      alert('Failed to import: ' + (err as Error).message);
    }
    e.target.value = '';
  };

  if (isAppLoading) {
    return <WaitlistHero />;
  }

  return (
    <div className={`${styles.app} ${isSidebarOpen ? 'sidebarOpen' : ''}`}>
      <NodeSidebar 
        onTemplateLoad={handleTemplateLoad} 
        customTemplateKeys={Object.keys(customTemplates)} 
      />

      {isSidebarOpen && (
        <div 
          className={styles.sidebarBackdrop} 
          onClick={() => useWorkflowStore.getState().setSidebarOpen(false)} 
        />
      )}
      
      <div className={styles.main}>
        <CanvasToolbar
          onNew={handleNewWorkflow}
          onSimulate={() => setSandboxOpen(true)}
          onImport={handleImportClick}
          onSave={handleSave}
          onSaveAsTemplate={handleSaveAsTemplate}
          onDeploy={handleDeploy}
          workflowName={workflowName}
          onNameChange={setWorkflowName}
          onTogglePanel={() => setPanelOpen(!panelOpen)}
          theme={theme}
          onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          lastSaved={lastSaved}
        />
        
        <div className={styles.canvasWrap}>
          <WorkflowCanvas theme={theme} />
          {panelOpen && <InsightPanel onClose={() => setPanelOpen(false)} />}
        </div>

        <StatusBar />
      </div>

      <SandboxPanel open={sandboxOpen} onClose={() => setSandboxOpen(false)} />
      <ToastContainer />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="workflow-import-input"
      />
    </div>
  );
};

export default App;
