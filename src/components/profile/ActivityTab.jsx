import { ActivityRow } from './ActivityRow.jsx';

const RECENT = [
  { icon: '📄', title: "Exported 'My Resume 2024'",       sub: 'PDF export · Modern Pro template',     time: '2h ago' },
  { icon: '✏️', title: "Edited 'Google Cover Letter'",    sub: 'Cover Letter · Professional template', time: 'Yesterday' },
  { icon: '⭐', title: "Starred 'Tech Stack' template",    sub: 'Resume template',                      time: '2 days ago' },
  { icon: '📥', title: "Exported 'Achievement Cert'",     sub: 'PDF export · Achievement Award',       time: '3 days ago' },
  { icon: '🆕', title: "Created 'Monthly Newsletter'",     sub: 'Newsletter · Weekly Digest template',  time: 'Last week' },
  { icon: '🔗', title: "Shared 'My Resume 2024'",         sub: 'Read-only link generated',             time: 'Last week' },
];

/** Activity log tab. */
export function ActivityTab() {
  return (
    <div className="fade-up" style={{
      background: 'var(--bg-surface)', borderRadius: 16, padding: 24,
      border: '1px solid var(--border)',
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15,
        color: 'var(--fg-primary)', marginBottom: 16,
      }}>Recent activity</div>
      {RECENT.map((r, i) => <ActivityRow key={i} {...r} />)}
    </div>
  );
}
