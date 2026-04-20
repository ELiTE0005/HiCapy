import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './StatusBar.module.css';

export const StatusBar: React.FC = () => {
  const { nodes, edges, selectedNodeId, zoomLevel } = useWorkflowStore();
  
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const selectedText = selectedNode ? `${(selectedNode.data as any).label || selectedNode.id} selected` : 'No selection';

  return (
    <div className={styles.statusbar}>
      <span className={styles.statusDot}></span>
      <span>Connected</span>
      <span className={styles.statusSep}></span>
      <span>{nodes.length} nodes</span>
      <span className={styles.statusSep}></span>
      <span>{edges.length} edges</span>
      <span className={styles.statusSep}></span>
      <span>{selectedText}</span>
      <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 7h6M7 4v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        <span>{zoomLevel}%</span>
        <span className={styles.statusSep}></span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
      </span>
    </div>
  );
};
