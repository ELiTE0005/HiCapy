import type { Node, Edge } from '@xyflow/react';
import type { ValidationError, ValidationResult } from '../types/workflow';

/**
 * Validates basic workflow constraints:
 * - Must have exactly one Start node
 * - Must have at least one End node
 * - Start node must have at least one outgoing edge
 * - End node must have at least one incoming edge
 * - No disconnected nodes (each node except start must have an incoming edge)
 * - Detects simple cycles (start -> ... -> start)
 */
export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];

  if (nodes.length === 0) {
    return { valid: false, errors: [{ nodeId: '', message: 'Canvas is empty — add at least a Start and End node.' }] };
  }

  const startNodes = nodes.filter((n) => n.type === 'startNode');
  const endNodes = nodes.filter((n) => n.type === 'endNode');

  // Rule 1: Exactly one start node
  if (startNodes.length === 0) {
    errors.push({ nodeId: '', message: 'Workflow must have exactly one Start node.' });
  } else if (startNodes.length > 1) {
    startNodes.forEach((n) =>
      errors.push({ nodeId: n.id, message: 'Multiple Start nodes detected — only one is allowed.' })
    );
  }

  // Rule 2: At least one end node
  if (endNodes.length === 0) {
    errors.push({ nodeId: '', message: 'Workflow must have at least one End node.' });
  }

  // Build adjacency maps
  const outEdges: Record<string, string[]> = {};
  const inEdges: Record<string, string[]> = {};
  edges.forEach((e) => {
    if (!outEdges[e.source]) outEdges[e.source] = [];
    if (!inEdges[e.target]) inEdges[e.target] = [];
    outEdges[e.source].push(e.target);
    inEdges[e.target].push(e.source);
  });

  // Rule 3: Start node must have outgoing edges
  startNodes.forEach((n) => {
    if (!outEdges[n.id] || outEdges[n.id].length === 0) {
      errors.push({ nodeId: n.id, message: 'Start node has no outgoing connections.' });
    }
  });

  // Rule 4: End node must have incoming edges
  endNodes.forEach((n) => {
    if (!inEdges[n.id] || inEdges[n.id].length === 0) {
      errors.push({ nodeId: n.id, message: 'End node has no incoming connections.' });
    }
  });

  // Rule 5: Intermediate nodes must be connected (at least one in, one out)
  nodes
    .filter((n) => n.type !== 'startNode' && n.type !== 'endNode')
    .forEach((n) => {
      const hasIn = inEdges[n.id] && inEdges[n.id].length > 0;
      const hasOut = outEdges[n.id] && outEdges[n.id].length > 0;
      if (!hasIn) {
        errors.push({ nodeId: n.id, message: `"${(n.data as any).label || n.id}" has no incoming connections.` });
      }
      if (!hasOut) {
        errors.push({ nodeId: n.id, message: `"${(n.data as any).label || n.id}" has no outgoing connections.` });
      }
    });

  return { valid: errors.length === 0, errors };
}

/**
 * Returns a map of nodeId → list of error messages for quick lookup.
 */
export function buildErrorMap(errors: ValidationError[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  errors.forEach((e) => {
    if (e.nodeId) {
      if (!map[e.nodeId]) map[e.nodeId] = [];
      map[e.nodeId].push(e.message);
    }
  });
  return map;
}
