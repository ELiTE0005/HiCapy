import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import type { HistorySnapshot } from '../types/workflow';

const MAX_HISTORY = 50;

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Undo / Redo
  history: HistorySnapshot[];
  future: HistorySnapshot[];

  // Simulation state (shared across nodes + insight panel)
  simulationState: {
    isRunning: boolean;
    executedNodes: string[];
    currentNodeId?: string;
  };
  setSimulationState: (state: Partial<WorkflowState['simulationState']>) => void;

  // Zoom level (set by WorkflowCanvas, read by StatusBar)
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;

  // React Flow callbacks
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node actions
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<Node['data']>) => void;
  addNode: (node: Node) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;

  // Import / full reset
  setWorkflow: (nodes: Node[], edges: Edge[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

function snapshot(nodes: Node[], edges: Edge[]): HistorySnapshot {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
  };
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  history: [],
  future: [],

  simulationState: {
    isRunning: false,
    executedNodes: [],
  },
  setSimulationState: (state) => set((s) => ({
    simulationState: { ...s.simulationState, ...state }
  })),

  zoomLevel: 100,
  setZoomLevel: (zoom) => set({ zoomLevel: Math.round(zoom * 100) }),

  saveSnapshot: () => {
    const { nodes, edges, history } = get();
    const snap = snapshot(nodes, edges);
    const newHistory = [...history, snap].slice(-MAX_HISTORY);
    set({ history: newHistory, future: [] });
  },

  onNodesChange: (changes) => {
    const significant = changes.some((c) => c.type === 'remove' || c.type === 'add');
    if (significant) get().saveSnapshot();
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) }));
  },

  onEdgesChange: (changes) => {
    const significant = changes.some((c) => c.type === 'remove' || c.type === 'add');
    if (significant) get().saveSnapshot();
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) }));
  },

  onConnect: (connection) => {
    get().saveSnapshot();
    set((s) => ({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2 },
        },
        s.edges
      ),
    }));
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, data) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }));
  },

  addNode: (node) => {
    get().saveSnapshot();
    set((s) => ({ nodes: [...s.nodes, node] }));
  },

  deleteNode: (id) => {
    get().saveSnapshot();
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }));
  },

  deleteEdge: (id) => {
    get().saveSnapshot();
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
    }));
  },

  undo: () => {
    const { history, nodes, edges } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      history: newHistory,
      future: [snapshot(nodes, edges), ...get().future].slice(0, MAX_HISTORY),
      selectedNodeId: null,
    });
  },

  redo: () => {
    const { future, nodes, edges } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      nodes: next.nodes,
      edges: next.edges,
      history: [...get().history, snapshot(nodes, edges)].slice(-MAX_HISTORY),
      future: newFuture,
      selectedNodeId: null,
    });
  },

  setWorkflow: (nodes, edges) => {
    get().saveSnapshot();
    set({ nodes, edges, selectedNodeId: null });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
}));
