import React, { useState, useMemo } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './InsightPanel.module.css';

interface InsightPanelProps {
  onClose: () => void;
}

const NODE_ICONS: Record<string, string> = {
  startNode: '▶',
  taskNode: '📋',
  approvalNode: '🛡️',
  automatedStepNode: '⚙️',
  endNode: '🏁',
  conditionNode: '🔀',
  emailNode: '✉️',
  timerNode: '⏱️',
  webhookNode: '🌐',
};

const NODE_COLORS: Record<string, { bg: string; color: string }> = {
  startNode:        { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80' },
  taskNode:         { bg: 'rgba(129,140,248,0.15)', color: '#818cf8' },
  approvalNode:     { bg: 'rgba(192,132,252,0.15)', color: '#c084fc' },
  automatedStepNode:{ bg: 'rgba(251,146,60,0.15)',  color: '#fb923c' },
  endNode:          { bg: 'rgba(251,113,133,0.15)', color: '#fb7185' },
  conditionNode:    { bg: 'rgba(234,179,8,0.15)',   color: '#facc15' },
  emailNode:        { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa' },
  timerNode:        { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
  webhookNode:      { bg: 'rgba(20,184,166,0.15)',  color: '#2dd4bf' },
};

export const InsightPanel: React.FC<InsightPanelProps> = ({ onClose }) => {
  const { nodes, simulationState } = useWorkflowStore();
  const [search, setSearch] = useState('');

  const autoNodes = nodes.filter(n => n.type === 'automatedStepNode');
  const taskNodes = nodes.filter(n => n.type === 'taskNode');
  const apprNodes = nodes.filter(n => n.type === 'approvalNode');
  const coverage  = nodes.length === 0 ? 0 : Math.round((autoNodes.length / nodes.length) * 100);
  const execCount = simulationState.executedNodes.length;
  const simPercent = nodes.length === 0 ? 0 : Math.round((execCount / nodes.length) * 100);

  // Flow Objectives — all nodes filtered by search
  const filteredObjectives = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return nodes;
    return nodes.filter(n => {
      const label = ((n.data as any).label || (n.data as any).title || (n.data as any).startTitle || '').toLowerCase();
      const type = (n.type || '').toLowerCase();
      return label.includes(q) || type.includes(q);
    });
  }, [nodes, search]);

  const isMetricVisible = (name: string) =>
    !search.trim() || name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className={styles.rightPanel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.panelTitle}>Performance Overview</div>
          <div className={styles.panelTitleSub}>Overview · Performance · Time</div>
        </div>
        <button className={styles.panelClose} onClick={onClose}>✕</button>
      </div>
      
      <div className={styles.panelScroll}>
        <div style={{ marginBottom: '4px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase' }}>Insight Metrics</div>
        
        {/* Live search */}
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search nodes or metrics…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '12px' }}
            >✕</button>
          )}
          {!search && <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>⌘K</span>}
        </div>

        {/* Automation Coverage */}
        {isMetricVisible('automation coverage') && (
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <div>
                <div className={styles.metricName}>Automation Coverage</div>
                <div className={styles.metricSub}>
                  {nodes.length === 0 ? 'Add nodes to track coverage' : `Your flow is ${coverage}% automated`}
                </div>
              </div>
              <div className={styles.chipRow} style={{ marginTop: 0 }}>
                <span className={`${styles.chip} ${coverage >= 50 ? styles.chipGreen : styles.chipAmber}`}>{coverage}%</span>
              </div>
            </div>
            <div className={styles.progressBar}>
              <div className={`${styles.progressFill} ${styles.progGreen}`} style={{ width: `${coverage}%`, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        )}

        {/* Flow Complexity */}
        {isMetricVisible('flow complexity') && (
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <div>
                <div className={styles.metricName}>Flow Complexity</div>
                <div className={styles.metricSub}>Composition of node types on canvas</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 0, background: 'var(--bg4)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px', minHeight: '5px' }}>
              {apprNodes.length > 0 && <div style={{ height: '5px', flex: apprNodes.length, background: '#ef4444' }} />}
              {taskNodes.length > 0 && <div style={{ height: '5px', flex: taskNodes.length, background: '#818cf8' }} />}
              {autoNodes.length > 0 && <div style={{ height: '5px', flex: autoNodes.length, background: '#4ade80' }} />}
            </div>
            <div className={styles.chipRow}>
              <span className={`${styles.chip} ${styles.chipRed}`}>● Appr: {apprNodes.length}</span>
              <span className={`${styles.chip} ${styles.chipBlue}`}>● Task: {taskNodes.length}</span>
              <span className={`${styles.chip} ${styles.chipGreen}`}>● Auto: {autoNodes.length}</span>
            </div>
          </div>
        )}

        {/* Simulation Progress */}
        {isMetricVisible('simulation progress') && (
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <div>
                <div className={styles.metricName}>Simulation Progress</div>
                <div className={styles.metricSub}>
                  {simulationState.isRunning
                    ? `Executing… ${execCount}/${nodes.length} nodes done`
                    : execCount > 0 ? `Last run: ${execCount}/${nodes.length} executed` : 'Sandbox Idle'}
                </div>
              </div>
            </div>
            <div className={styles.progressBar} style={{ background: 'var(--bg4)' }}>
              <div style={{ height: '100%', borderRadius: '3px', background: '#3b82f6', width: `${simPercent}%`, transition: 'width 0.4s ease' }} />
            </div>
            <div className={styles.chipRow}>
              <span className={`${styles.chip} ${styles.chipBlue}`}>● Total: {nodes.length}</span>
              <span className={`${styles.chip} ${styles.chipGreen}`}>● Done: {execCount}</span>
              {simulationState.isRunning && (
                <span className={`${styles.chip} ${styles.chipAmber}`}>● Running</span>
              )}
            </div>
          </div>
        )}

        {/* Flow Objectives — live nodes from canvas */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Flow Objectives</span>
          <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{filteredObjectives.length} node{filteredObjectives.length !== 1 ? 's' : ''}</span>
        </div>

        {nodes.length === 0 ? (
          <div className={styles.objDesc} style={{ padding: '8px 0', textAlign: 'center' }}>
            No nodes on canvas yet — drag nodes from the palette!
          </div>
        ) : filteredObjectives.length === 0 ? (
          <div className={styles.objDesc} style={{ padding: '8px 0', textAlign: 'center' }}>
            No nodes match "{search}"
          </div>
        ) : (
          filteredObjectives.map(node => {
            const d = node.data as any;
            const label = d.startTitle || d.endMessage || d.title || d.label || node.type;
            const sub = d.assignee ? `Assignee: ${d.assignee}` : d.approverRole ? `Approver: ${d.approverRole}` : d.actionId ? `Action: ${d.actionId}` : node.type?.replace(/([A-Z])/g, ' $1') || '';
            const isExec = simulationState.executedNodes.includes(node.id);
            const isActive = simulationState.currentNodeId === node.id;
            const icon = NODE_ICONS[node.type || ''] || '●';
            const colorSet = NODE_COLORS[node.type || ''] || { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' };
            return (
              <div key={node.id} className={styles.objCard} style={{ borderColor: isActive ? '#818cf8' : undefined }}>
                <div className={styles.objHeader}>
                  <div className={styles.objIcon} style={colorSet}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.objName}>{label}</div>
                    <div className={styles.objDesc}>{sub}</div>
                  </div>
                  <div className={styles.chipRow} style={{ marginTop: 0 }}>
                    {isActive && <span className={`${styles.chip} ${styles.chipBlue}`}>⏳</span>}
                    {isExec && <span className={`${styles.chip} ${styles.chipGreen}`}>✓</span>}
                    {!isExec && !isActive && simulationState.isRunning && <span className={`${styles.chip} ${styles.chipGray}`}>···</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
