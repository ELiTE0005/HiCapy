import React, { useState, useRef, useEffect } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { showToast } from '../ui/Toast';
import { ThemeSwitch } from '../ui/ThemeSwitch';
import styles from './CanvasToolbar.module.css';

interface CanvasToolbarProps {
  onNew: () => void;
  onSimulate: () => void;
  onImport: () => void;
  onSave: () => void;
  onSaveAsTemplate?: () => void;
  onDeploy: () => void;
  workflowName: string;
  onNameChange: (name: string) => void;
  onTogglePanel: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  lastSaved: Date | null;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onNew,
  onSimulate,
  onSave,
  onSaveAsTemplate,
  onDeploy,
  workflowName,
  onNameChange,
  onTogglePanel,
  theme,
  onToggleTheme,
  lastSaved,
}) => {
  const { undo, redo, history, future } = useWorkflowStore();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(workflowName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep draft in sync when name changes externally (e.g. template load)
  useEffect(() => { setDraftName(workflowName); }, [workflowName]);

  const startEdit = () => { setEditing(true); setTimeout(() => inputRef.current?.select(), 30); };
  const commitEdit = () => {
    const name = draftName.trim() || 'Untitled Workflow';
    onNameChange(name);
    setEditing(false);
  };
  const cancelEdit = () => { setDraftName(workflowName); setEditing(false); };

  const savedLabel = lastSaved
    ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Unsaved';

  return (
    <div className={styles.toolbar}>
      <button className={styles.tbBtn} onClick={onNew} title="New Workflow">
        <svg viewBox="0 0 15 15" fill="none"><path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        New
      </button>
      <div className={styles.toolbarSep} />
      <button className={styles.tbBtn} onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)">
        <svg viewBox="0 0 15 15" fill="none"><path d="M3 6H9.5a4.5 4.5 0 010 9H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3L1 6l2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button className={styles.tbBtn} onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Y)">
        <svg viewBox="0 0 15 15" fill="none"><path d="M12 6H5.5a4.5 4.5 0 000 9H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3l2 3-2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className={styles.toolbarSep} />

      {editing ? (
        <input
          ref={inputRef}
          className={styles.nameInput}
          value={draftName}
          onChange={e => setDraftName(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={e => { if (e.key === 'Enter') commitEdit(); else if (e.key === 'Escape') cancelEdit(); }}
          autoFocus
        />
      ) : (
        <div className={styles.toolbarWorkflowName} onClick={startEdit} title="Click to rename">
          <span>{workflowName}</span>
          <span className={styles.toolbarChevron}>▾</span>
        </div>
      )}

      <span className={styles.toolbarSub}>{savedLabel}</span>
      <div className={styles.toolbarSep} />

      <button className={styles.tbBtn} onClick={onSave} title="Save workflow as JSON">
        <svg viewBox="0 0 15 15" fill="none"><path d="M2 3.5A1.5 1.5 0 013.5 2h7.086a1.5 1.5 0 011.06.44l.915.914A1.5 1.5 0 0113 4.414V12.5A1.5 1.5 0 0111.5 14h-8A1.5 1.5 0 012 12.5v-9z" stroke="currentColor" strokeWidth="1.2"/><rect x="5" y="2" width="5" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/><rect x="4" y="8" width="7" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/></svg>
        Save
      </button>
      {onSaveAsTemplate && (
        <button className={styles.tbBtn} onClick={onSaveAsTemplate} title="Save as Custom Template">
          <svg viewBox="0 0 15 15" fill="none"><path d="M7.5 1L9.6 5.2L14 5.9L10.8 9L11.5 13.5L7.5 11.4L3.5 13.5L4.2 9L1 5.9L5.4 5.2L7.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          Save Template
        </button>
      )}
      
      <div className={styles.toolbarRight}>
        <ThemeSwitch theme={theme} onChange={onToggleTheme} className={styles.tbBtn} />
        <button className={styles.tbBtn} id="btn-simulate" onClick={onSimulate}>
          <svg viewBox="0 0 15 15" fill="none"><path d="M3.5 2.5l9 5-9 5V2.5z" fill="currentColor"/></svg>
          Simulate
        </button>
        <button className={`${styles.tbBtn} ${styles.primary}`} onClick={onDeploy}>
          <svg viewBox="0 0 15 15" fill="none"><path d="M7.5 1L13 7H9v7H6V7H2L7.5 1z" fill="white"/></svg>
          Deploy
        </button>
        <div className={styles.toolbarSep} />
        <button className={styles.tbBtn} id="panel-toggle-btn" onClick={onTogglePanel}>
          <svg viewBox="0 0 15 15" fill="none"><path d="M2 4h11M2 8h11M2 12h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Panel
        </button>
      </div>
    </div>
  );
};
