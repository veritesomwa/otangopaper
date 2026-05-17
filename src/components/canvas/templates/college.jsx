// College-app statement renderer — fully click-to-edit on the canvas.

import { EditableText } from '@components/common/EditableText.jsx';

export function CollegeCanvas({ accent, person, readOnly, onPatch }) {
  const c = person?.college || {};
  const E = (path, value, style, opts = {}) => (
    <EditableText
      value={value} readOnly={readOnly}
      onChange={(v) => onPatch?.(path, v)}
      tag={opts.tag || 'span'}
      multiline={opts.multiline}
      placeholder={opts.placeholder}
      style={style}
    />
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: '36px 44px', fontSize: 10, height: '100%' }}>
      <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 10, marginBottom: 18 }}>
        {E('college.statementType', c.statementType || 'Statement of Purpose', {
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#111', display: 'block',
        }, { tag: 'div' })}
        <div style={{ fontSize: 9, color: '#777', marginTop: 3 }}>
          {E('name', person?.name || 'Applicant Name', { display: 'inline' })}
          {' · '}
          {E('college.program', c.program || 'Program', { display: 'inline' })}
          {c.school !== undefined && (
            <>
              {' · '}
              {E('college.school', c.school || '', { display: 'inline' }, { placeholder: 'School' })}
            </>
          )}
        </div>
      </div>

      {E('college.essay',
         c.essay || 'Write your essay here. Press Shift+Enter to start a new paragraph.',
         { fontSize: 10, lineHeight: 1.95, color: '#444', display: 'block' },
         { tag: 'div', multiline: true })}
    </div>
  );
}
