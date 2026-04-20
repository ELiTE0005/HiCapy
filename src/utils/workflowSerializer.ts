import type { Node, Edge } from '@xyflow/react';

export interface WorkflowExport {
  version: '1.0';
  exportedAt: string;
  nodes: Node[];
  edges: Edge[];
}

export function exportWorkflow(nodes: Node[], edges: Edge[]): void {
  const data: WorkflowExport = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    nodes,
    edges,
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hr-workflow-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importWorkflow(file: File): Promise<{ nodes: Node[]; edges: Edge[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: WorkflowExport = JSON.parse(e.target?.result as string);
        if (!data.nodes || !data.edges) throw new Error('Invalid workflow file');
        resolve({ nodes: data.nodes, edges: data.edges });
      } catch (err) {
        reject(new Error('Failed to parse workflow file: ' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function serializeForSimulation(nodes: Node[], edges: Edge[]) {
  return {
    nodes: nodes.map((n) => ({ id: n.id, type: n.type || 'unknown', data: n.data })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
  };
}
