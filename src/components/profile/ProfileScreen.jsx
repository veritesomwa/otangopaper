import { useState } from 'react';
import { useAuth } from '@hooks/useAuth.js';
import { useToast } from '@hooks/useToast.js';

import { StatCard }         from './StatCard.jsx';
import { ProfileTab }       from './ProfileTab.jsx';
import { AccountTab }       from './AccountTab.jsx';
import { NotificationsTab } from './NotificationsTab.jsx';
import { ActivityTab }      from './ActivityTab.jsx';

const TABS = [
  { id: 'profile',       label: 'Profile' },
  { id: 'account',       label: 'Account & Plan' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'activity',      label: 'Activity' },
];

/** Top-level profile/account screen with four tabs. */
export function ProfileScreen() {
  const { user } = useAuth();
  const { push: pushToast } = useToast();

  const [profile, setProfile] = useState({
    name:    user?.name  || 'Alexandra Chen',
    email:   user?.email || 'alex.chen@email.com',
    title:   user?.title || 'Senior Product Designer',
    website: 'alexchen.design',
    bio:     'Passionate product designer with 6+ years crafting intuitive digital experiences.',
    avatarUrl: '',
  });

  const [tab, setTab] = useState('profile');

  const initials = profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const handleUpgrade = () =>
    pushToast('Pro checkout coming soon — your wishlist has been noted.', { type: 'info' });

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
      <div style={{ padding: '32px 48px', maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20, padding: '28px 32px',
            background: 'var(--bg-surface)', borderRadius: 20,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" style={{
                  width: 80, height: 80, borderRadius: '50%',
                  border: '3px solid var(--border)', objectFit: 'cover',
                }} />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#0C2A5C,#00A8B4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 28, color: '#fff',
                  border: '3px solid var(--border)',
                }}>{initials}</div>
              )}
              <div style={{
                position: 'absolute', bottom: 2, right: 2, width: 18, height: 18,
                borderRadius: '50%', background: '#22C55E', border: '2px solid var(--bg-surface)',
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
                color: 'var(--fg-primary)', marginBottom: 3,
              }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginBottom: 8 }}>
                {profile.title} · {profile.email}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{
                  background: 'rgba(23, 86, 200,0.12)', color: '#5C90FF', fontSize: 11,
                  fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                }}>Free plan</span>
                <span style={{
                  background: 'rgba(34,197,94,0.12)', color: '#22C55E', fontSize: 11,
                  fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                }}>● Active</span>
              </div>
            </div>
            <button onClick={handleUpgrade} style={{
              background: 'linear-gradient(135deg,#1756C8,#00C8D4)', border: 'none',
              borderRadius: 999, padding: '10px 22px', fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 13, color: '#fff', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(23, 86, 200,0.35)',
            }}>Upgrade to Pro</button>
          </div>
        </div>

        {/* Stats */}
        <div className="fade-up" style={{ display: 'flex', gap: 14, marginBottom: 30 }}>
          <StatCard value="4"  label="Designs created"    icon="📄" />
          <StatCard value="12" label="Exports this month" icon="📥" color="#22C55E" />
          <StatCard value="3"  label="Templates saved"    icon="⭐" color="#F59E0B" />
          <StatCard value="1"  label="Shared links"       icon="🔗" color="#8B5CF6" />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                borderBottom: active ? '2px solid #1756C8' : '2px solid transparent',
                transition: 'all 150ms',
              }}>{t.label}</button>
            );
          })}
        </div>

        {tab === 'profile'       && <ProfileTab profile={profile} setProfile={setProfile} />}
        {tab === 'account'       && <AccountTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'activity'      && <ActivityTab />}
      </div>
    </div>
  );
}
