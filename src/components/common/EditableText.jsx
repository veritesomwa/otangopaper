// contentEditable wrapper used inside template renderers. When `readOnly` is
// true (e.g. inside a thumbnail) it just renders text. In the editor it
// becomes click-to-edit: a soft hover highlight signals it's interactive,
// focus pushes a stronger tint, blur commits the new value.
//
// Props:
//   value         — current text
//   onChange(v)   — called on blur with the trimmed text content
//   readOnly      — render as plain text (used in thumbnails / PDFs)
//   tag           — element tag, defaults to 'span'
//   style         — inline style merged onto the element
//   className     — pass-through
//   multiline     — preserve newlines (uses innerText vs textContent + whitespace:pre-wrap)
//   placeholder   — shown faintly when value is empty
//
// All edits are uncontrolled — the contentEditable node owns its DOM during
// editing, so re-rendering with a stale `value` won't blow away the user's
// keystrokes. The `keyVer` reset only fires when value differs from the last
// committed value (i.e. on undo / external patches).

import { useEffect, useRef, useState } from 'react';

export function EditableText({
  value,
  onChange,
  readOnly = false,
  tag: Tag = 'span',
  style = {},
  className = '',
  multiline = false,
  placeholder = '',
}) {
  const ref = useRef(null);
  const lastCommitted = useRef(value);
  const [, force] = useState(0);

  // If `value` changes from the outside (undo/redo, AI fill, etc.) and we
  // didn't just commit it ourselves, reset the DOM text to match.
  useEffect(() => {
    if (readOnly) return;
    if (!ref.current) return;
    if (value === lastCommitted.current) return;
    const cur = multiline ? ref.current.innerText : ref.current.textContent;
    if (cur !== (value ?? '')) {
      ref.current[multiline ? 'innerText' : 'textContent'] = value ?? '';
    }
    lastCommitted.current = value;
  }, [value, readOnly, multiline]);

  if (readOnly) {
    const display = (value ?? '');
    if (multiline) {
      return (
        <Tag style={{ ...style, whiteSpace: 'pre-wrap' }} className={className}>{display}</Tag>
      );
    }
    return <Tag style={style} className={className}>{display}</Tag>;
  }

  const isEmpty = !value || String(value).length === 0;

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-otango-editable
      data-empty={isEmpty ? 'true' : undefined}
      style={{
        ...style,
        outline: 'none',
        cursor: 'text',
        borderRadius: 3,
        transition: 'background 120ms, box-shadow 120ms',
        ...(multiline ? { whiteSpace: 'pre-wrap' } : null),
        ...(isEmpty ? { minWidth: 12 } : null),
      }}
      className={className}
      onFocus={(e) => {
        e.currentTarget.style.background = 'rgba(23, 86, 200, 0.10)';
        e.currentTarget.style.boxShadow  = 'inset 0 0 0 1px rgba(23, 86, 200, 0.45)';
      }}
      onMouseEnter={(e) => {
        if (document.activeElement === e.currentTarget) return;
        e.currentTarget.style.background = 'rgba(23, 86, 200, 0.05)';
      }}
      onMouseLeave={(e) => {
        if (document.activeElement === e.currentTarget) return;
        e.currentTarget.style.background = 'transparent';
      }}
      onBlur={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.boxShadow  = 'none';
        const next = multiline ? e.currentTarget.innerText : e.currentTarget.textContent;
        const trimmed = next ?? '';
        lastCommitted.current = trimmed;
        if (onChange) onChange(trimmed);
        force((n) => n + 1); // refresh placeholder visibility
      }}
      onKeyDown={(e) => {
        // Enter commits + blurs for single-line fields. Shift+Enter falls through.
        if (!multiline && e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {value ?? ''}
    </Tag>
  );
}
