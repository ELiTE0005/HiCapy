import React from 'react';
import styles from './KeyValueEditor.module.css';

interface KeyValueEditorProps {
  label?: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  label,
  value,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}) => {
  const pairs = Object.entries(value);

  const updatePair = (index: number, newKey: string, newVal: string) => {
    const newPairs = [...pairs];
    newPairs[index] = [newKey, newVal];
    onChange(Object.fromEntries(newPairs));
  };

  const addPair = () => {
    const newPairs = [...pairs, ['', '']];
    onChange(Object.fromEntries(newPairs));
  };

  const removePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    onChange(Object.fromEntries(newPairs));
  };

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.pairs}>
        {pairs.map(([k, v], i) => (
          <div key={i} className={styles.row}>
            <input
              className={styles.input}
              value={k}
              placeholder={keyPlaceholder}
              onChange={(e) => updatePair(i, e.target.value, v)}
            />
            <input
              className={styles.input}
              value={v}
              placeholder={valuePlaceholder}
              onChange={(e) => updatePair(i, k, e.target.value)}
            />
            <button className={styles.remove} onClick={() => removePair(i)} type="button" title="Remove row">
              ✕
            </button>
          </div>
        ))}
      </div>
      <button className={styles.add} onClick={addPair} type="button">
        + Add Field
      </button>
    </div>
  );
};
