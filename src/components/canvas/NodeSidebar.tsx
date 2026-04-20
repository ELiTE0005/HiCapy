import React, { useState } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import styles from './NodeSidebar.module.css';

interface NodeSidebarProps {
  onTemplateLoad: (name: string) => void;
  customTemplateKeys?: string[];
}

export const NodeSidebar: React.FC<NodeSidebarProps> = ({ onTemplateLoad, customTemplateKeys = [] }) => {
  const [activeNav, setActiveNav] = useState('Workflows');
  const { nodes, setSidebarOpen } = useWorkflowStore();

  const totalApprovals = nodes.filter(n => n.type === 'approvalNode').length;
  const totalAuto = nodes.filter(n => n.type === 'automatedStepNode' || n.type === 'automatedNode').length;

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const navItem = (name: string, icon: React.ReactNode, badge?: string) => (
    <div 
      className={`${styles.navItem} ${activeNav === name ? styles.active : ''}`}
      onClick={() => setActiveNav(name)}
    >
      <div className={styles.navIcon}>{icon}</div>
      {name}
      {badge && <span className={styles.navBadge}>{badge}</span>}
    </div>
  );

  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <img src="/favicon.svg" alt="HiCapy" className={styles.logoMark} style={{ background: 'white', padding: '4px', objectFit: 'contain' }} />
        <span className={styles.logoText}>HiCapy</span>
        <span className={styles.logoBadge}>HR</span>
        <button className={styles.mobileClose} onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">✕</button>
      </div>
      
      <div className={styles.sidebarScroll}>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>General</div>
          {navItem('Dashboard', <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.9"/><rect x="9" y="2" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.5"/><rect x="2" y="9" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.5"/><rect x="9" y="9" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.5"/></svg>)}
          {navItem('Compliance', <svg viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM7 5h2v4H7V5zm0 5h2v2H7v-2z" fill="currentColor"/></svg>)}
          {navItem('Scheduler', <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M2 6h12" stroke="currentColor" strokeWidth="1.5"/><path d="M5 3V2M11 3V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, totalAuto > 0 ? totalAuto.toString() : undefined)}
          {navItem('Analytics', <svg viewBox="0 0 16 16" fill="none"><path d="M2 11l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
        </div>

        {/* Templates area */}
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Templates</div>
          <div className={styles.navItem} onClick={() => onTemplateLoad('Onboarding')}>
            <span className={styles.navIcon}>📄</span> Onboarding
          </div>
          <div className={styles.navItem} onClick={() => onTemplateLoad('Leave Approval')}>
            <span className={styles.navIcon}>✈️</span> Leave Approval
          </div>
          <div className={styles.navItem} onClick={() => onTemplateLoad('Doc Verification')}>
            <span className={styles.navIcon}>🔍</span> Doc Verification
          </div>
          <div className={styles.navItem} onClick={() => onTemplateLoad('Performance Review')}>
            <span className={styles.navIcon}>⭐</span> Performance Review
          </div>
          <div className={styles.navItem} onClick={() => onTemplateLoad('Expense Reimbursement')}>
            <span className={styles.navIcon}>💸</span> Expense Reimbursement
          </div>
          
          {customTemplateKeys.length > 0 && (
            <>
              <div className={styles.navLabel} style={{ marginTop: '16px' }}>My Templates</div>
              {customTemplateKeys.map(key => (
                <div key={key} className={styles.navItem} onClick={() => onTemplateLoad(key)}>
                  <span className={styles.navIcon}>💾</span> {key}
                </div>
              ))}
            </>
          )}
        </div>

        <div className={styles.paletteTitle}>Node Palette</div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'startNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#22c55e' }}></div>
          <span className={styles.paletteLabel}>Start Node</span>
        </div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'taskNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#818cf8' }}></div>
          <span className={styles.paletteLabel}>Task Node</span>
        </div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'approvalNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#c084fc' }}></div>
          <span className={styles.paletteLabel}>Approval Node</span>
        </div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'automatedStepNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#fb923c' }}></div>
          <span className={styles.paletteLabel}>Automated Step</span>
        </div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'endNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#fb7185' }}></div>
          <span className={styles.paletteLabel}>End Node</span>
        </div>
        
        <div className={styles.paletteTitle}>Logic & Integration</div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'conditionNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#eab308' }}></div>
          <span className={styles.paletteLabel}>Condition</span>
        </div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'emailNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#3b82f6' }}></div>
          <span className={styles.paletteLabel}>Email</span>
        </div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'timerNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#64748b' }}></div>
          <span className={styles.paletteLabel}>Timer</span>
        </div>
        <div className={styles.paletteItem} draggable onDragStart={(e) => onDragStart(e, 'webhookNode')} title="Drag onto canvas">
          <div className={styles.paletteDot} style={{ background: '#14b8a6' }}></div>
          <span className={styles.paletteLabel}>Webhook</span>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>Automation</div>
          {navItem('Integrations', <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 6v2M6.3 10.5L5 8M9.7 10.5L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>)}
          {navItem('Repository', <svg viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h10M3 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, '3')}
          {navItem('Workflows', <svg viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 0110.39-4.1M14 8a6 6 0 01-10.39 4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 4l1.5-1.5L14 4M5 12L3.5 13.5 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>Resources</div>
          {navItem('Member', <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 13c0-2.21 2.686-4 6-4s6 1.79 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>)}
          {navItem('Inbox', <svg viewBox="0 0 16 16" fill="none"><path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M5 8h6M5 5.5h3M5 10.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, totalApprovals > 0 ? totalApprovals.toString() : undefined)}
          {navItem('Messages', <svg viewBox="0 0 16 16" fill="none"><path d="M2 4h12v1.5L8 9.5 2 5.5V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/><path d="M2 5.5v6.5h12V5.5" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>)}
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.navItem}>
          <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.76 3.76l.71.71M11.53 11.53l.71.71M3.76 12.24l.71-.71M11.53 4.47l.71-.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Settings
        </div>
        <div className={styles.navItem}>
          <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5.5v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Help & Support
        </div>
      </div>
    </nav>
  );
};
