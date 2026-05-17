import { useState } from 'react';
import { Icon } from '@components/common/Icon.jsx';
import { useDocument } from '@hooks/useDocument.js';
import { useToast }    from '@hooks/useToast.js';
import { exportPDF, exportPNG, exportWord, exportShareLink } from '@services/exportService.js';

const OPTS = [
  { id: 'pdf',  label: 'PDF Document',  sub: 'Best for sharing and printing', color: '#EF4444', emoji: '📄' },
  { id: 'docx', label: 'Word Document', sub: 'Editable in Microsoft Word',     color: '#3B82F6', emoji: '📝' },
  { id: 'png',  label: 'PNG Image',     sub: 'High-resolution at 2× DPI',      color: '#22C55E', emoji: '🖼️' },
  { id: 'link', label: 'Share Link',    sub: 'Copies a read-only URL',         color: '#8B5CF6', emoji: '🔗' },
];

/** Format picker shown when the user clicks Export. */
export function ExportModal({ onClose }) {
  const { canvasRef, docName, pageSize } = useDocument();
  const { push: pushToast }    = useToast();
  const [selected, setSelected] = useState('pdf');
  const [busy, setBusy]         = useState(false);

  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const node = canvasRef.current;
      if (selected === 'pdf') {
        await exportPDF(node, docName, pageSize);
        pushToast('Print dialog opened — choose "Save as PDF" to download.', { type: 'success' });
      } else if (selected === 'png') {
        await exportPNG(node, docName);
        pushToast(`Saved ${docName}.png`, { type: 'success' });
      } else if (selected === 'docx') {
        exportWord(node, docName);
        pushToast(`Saved ${docName}.doc`, { type: 'success' });
      } else if (selected === 'link') {
        const link = await exportShareLink(docName);
        pushToast(`Share link copied: ${link}`, { type: 'success' });
      }
      onClose();
    } catch (e) {
      pushToast(e.message || 'Export failed', { type: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.18s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--bg-surface)', borderRadius: 20, padding: 28, width: 460,
        border: '1px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        animation: 'scaleIn 0.22s cubic-bezier(0.34,1.2,0.64,1)',
      }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20,
          marginBottom: 4, color: 'var(--fg-primary)',
        }}>Export design</div>
        <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginBottom: 22 }}>
          Choose your format below
        </div>

        {OPTS.map((o) => (
          <div key={o.id} onClick={() => setSelected(o.id)} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 12,
            border: '1.5px solid', cursor: 'pointer', marginBottom: 9, transition: 'all 150ms',
            borderColor: selected === o.id ? '#1756C8' : 'var(--border)',
            background:  selected === o.id ? 'rgba(23, 86, 200,0.1)' : 'var(--bg-elevated)',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: `${o.color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0,
            }}>{o.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)' }}>{o.label}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 1 }}>{o.sub}</div>
            </div>
            {selected === o.id && (
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                <Icon name="check" size={14} strokeWidth={2.5} />
              </div>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1.5px solid var(--border)', color: 'var(--fg-secondary)',
            borderRadius: 999, padding: '9px 20px', fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleDownload} disabled={busy} style={{
            background: busy
              ? 'var(--bg-elevated)'
              : 'linear-gradient(135deg,#1756C8,#00C8D4)',
            border: 'none', color: busy ? 'var(--fg-tertiary)' : '#fff',
            borderRadius: 999, padding: '9px 22px', fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600, cursor: busy ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: busy ? 'none' : '0 4px 14px rgba(23, 86, 200,0.35)',
          }}>
            <Icon name="download" /> {busy ? 'Exporting…' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}
