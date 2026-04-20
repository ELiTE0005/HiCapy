import React, { useEffect } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { useSimulate } from '../../hooks/useSimulate';
import { Button } from '../ui/Button';
import { ExecutionLog } from './ExecutionLog';
import styles from './SandboxPanel.module.css';

interface SandboxPanelProps {
  open: boolean;
  onClose: () => void;
}

export const SandboxPanel: React.FC<SandboxPanelProps> = ({ open, onClose }) => {
  const { nodes, edges } = useWorkflowStore();
  const { loading, result, validation, error, runSimulation, reset } = useSimulate();

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleRun = () => runSimulation(nodes, edges);

  const hasValidationErrors = validation && !validation.valid;
  const globalErrors = validation?.errors.filter((e) => !e.nodeId) || [];

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Workflow Test Sandbox">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>▷</div>
            <div>
              <div className={styles.title}>Workflow Sandbox</div>
              <div className={styles.subtitle}>Simulate and test your workflow end-to-end</div>
            </div>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close sandbox">✕</button>
        </div>

        <div className={styles.body}>
          {/* Workflow Stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{nodes.length}</span>
              <span className={styles.statLabel}>Nodes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{edges.length}</span>
              <span className={styles.statLabel}>Edges</span>
            </div>
            <div className={styles.stat}>
              <span
                className={styles.statNum}
                style={{ color: hasValidationErrors ? '#ef4444' : '#10b981' }}
              >
                {hasValidationErrors ? '✕' : '✓'}
              </span>
              <span className={styles.statLabel}>Structure</span>
            </div>
          </div>

          {/* Validation errors (global) */}
          {hasValidationErrors && globalErrors.length > 0 && (
            <div className={styles.errorBox}>
              <div className={styles.errorTitle}>⚠ Validation Issues</div>
              {validation!.errors.map((e, i) => (
                <div key={i} className={styles.errorItem}>• {e.message}</div>
              ))}
            </div>
          )}

          {/* Error from API */}
          {error && (
            <div className={styles.errorBox}>
              <div className={styles.errorTitle}>⚠ Simulation Error</div>
              <div className={styles.errorItem}>{error}</div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className={styles.results}>
              <div className={styles.resultsTitle}>Execution Log</div>
              <ExecutionLog steps={result.steps} summary={result.summary} />
            </div>
          )}

          {!result && !loading && !hasValidationErrors && validation && (
            <div className={styles.readyState}>
              <div className={styles.readyIcon}>✓</div>
              <div className={styles.readyText}>Workflow is valid and ready to simulate.</div>
            </div>
          )}

          {!validation && !result && (
            <div className={styles.idleState}>
              <p>Click "Run Simulation" to validate and execute your workflow step by step.</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose} id="sandbox-cancel">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleRun}
            loading={loading}
            id="sandbox-run"
            icon={<span>▷</span>}
          >
            {loading ? 'Running…' : 'Run Simulation'}
          </Button>
        </div>
      </div>
    </div>
  );
};
