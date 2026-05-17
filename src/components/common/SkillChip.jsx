// Coloured chip used for skill / hobby lists inside templates.
// When `onChange` is provided and not readOnly, the label is click-to-edit
// and `onRemove` shows an × to delete it.

import { EditableText } from './EditableText.jsx';

export function SkillChip({ label, accent, readOnly, onRemove, onChange }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 999, fontSize: 9, fontWeight: 600,
      background: `${accent}22`, color: accent, border: `1px solid ${accent}44`,
      marginBottom: 4, marginRight: 4, whiteSpace: 'nowrap',
    }}>
      {onChange && !readOnly ? (
        <EditableText value={label} readOnly={readOnly} onChange={onChange} tag="span" />
      ) : (
        label
      )}
      {!readOnly && onRemove && (
        <span onClick={onRemove} style={{ cursor: 'pointer', opacity: 0.6, fontSize: 11, lineHeight: 1 }}>×</span>
      )}
    </span>
  );
}
