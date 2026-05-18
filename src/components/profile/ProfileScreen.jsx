import { useState } from 'react';
import { useAuth } from '@hooks/useAuth.js';
import { useToast } from '@hooks/useToast.js';
import { useIsMobile } from '@hooks/useMediaQuery.js';

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
  const isMobile = useIsMobile();

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
      <div style={{
        padding: isMobile ? '20px 14px 60px' : '32px 48px',
        maxWidth: 900, margin: '0 auto',
      }}>

        {/* Header — avatar + name on top, Upgrade button wraps to next line on mobile */}
        <div className="fade-up" style={{ marginBottom: isMobile ? 22 : 32 }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', gap: isMobile ? 14 : 20,
            padding: isMobile ? '20px 18px' : '28px 32px',
            background: 'var(--bg-surface)', borderRadius: isMobile ? 16 : 20,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" style={{
                  width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, borderRadius: '50%',
                  border: '3px solid var(--border)', objectFit: 'cover',
                }} />
              ) : (
                <div style={{
                  width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#0C2A5C,#00A8B4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                  fontSize: isMobile ? 22 : 28, color: '#fff',
                  border: '3px solid var(--border)',
                }}>{initials}</div>
              )}
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                width: isMobile ? 14 : 18, height: isMobile ? 14 : 18,
                borderRadius: '50%', background: '#22C55E', border: '2px solid var(--bg-surface)',
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: isMobile ? 17 : 22,
                color: 'var(--fg-primary)', marginBottom: 3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{profile.name}</div>
              <div style={{
                fontSize: isMobile ? 11.5 : 13, color: 'var(--fg-secondary)', marginBottom: 8,
                overflowWrap: 'anywhere',
              }}>
                {profile.title} · {profile.email}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
              borderRadius: 999,
              padding: isMobile ? '8px 16px' : '10px 22px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: isMobile ? 12 : 13, color: '#fff', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(23, 86, 200,0.35)',
              flexShrink: 0,
              // On mobile we want the button on its own line below the name.
              ...(isMobile ? { flexBasis: '100%' } : null),
            }}>Upgrade to Pro</button>
          </div>
        </div>

        {/* Stats — flex row on desktop, 2-up grid on mobile */}
        <div className="fade-up" style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? 10 : 14,
          marginBottom: isMobile ? 22 : 30,
        }}>
          <StatCard value="4"  label="Designs created"    icon="📄" />
          <StatCard value="12" label="Exports this month" icon="📥" color="#22C55E" />
          <StatCard value="3"  label="Templates saved"    icon="⭐" color="#F59E0B" />
          <StatCard value="1"  label="Shared links"       icon="🔗" color="#8B5CF6" />
        </div>

        {/* Tabs — horizontally scrollable on mobile so all 4 stay reachable */}
        <div style={{
          display: 'flex', borderBottom: '1px solid var(--border)',
          marginBottom: isMobile ? 20 : 28,
          overflowX: 'auto',
          // Hide the scrollbar visually on mobile — finger swipe still works.
          scrollbarWidth: 'thin',
        }}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: isMobile ? '10px 14px' : '10px 20px',
                border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? 12 : 13, fontWeight: 500,
                color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                borderBottom: active ? '2px solid #1756C8' : '2px solid transparent',
                transition: 'all 150ms',
                whiteSpace: 'nowrap', flexShrink: 0,
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
