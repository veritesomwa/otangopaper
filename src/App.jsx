import { useEffect, useState } from 'react';

import { Topbar }          from '@components/layout/Topbar.jsx';
import { Sidebar }         from '@components/layout/Sidebar.jsx';
import { SidebarToggle }   from '@components/layout/SidebarToggle.jsx';
import { TweaksPanel }     from '@components/layout/TweaksPanel.jsx';
import { OnboardingModal } from '@components/onboarding/OnboardingModal.jsx';
import { Dashboard }       from '@components/dashboard/Dashboard.jsx';
import { Editor }          from '@components/editor/Editor.jsx';
import { ProfileScreen }   from '@components/profile/ProfileScreen.jsx';
import { MagicTool }       from '@components/magic/MagicTool.jsx';
import { TemplatesScreen } from '@components/templates/TemplatesScreen.jsx';
import { MyDesignsScreen } from '@components/designs/MyDesignsScreen.jsx';
import { StarredScreen }   from '@components/starred/StarredScreen.jsx';
import { SettingsScreen }  from '@components/settings/SettingsScreen.jsx';
import { LoginModal }      from '@components/auth/LoginModal.jsx';
import { Logo }            from '@components/common/Logo.jsx';

import { useAuth }         from '@hooks/useAuth.js';
import { useDocument }     from '@hooks/useDocument.js';
import { useTemplates }    from '@hooks/useTemplates.js';
import { useLocalStorage } from '@hooks/useLocalStorage.js';
import { useIsMobile }     from '@hooks/useMediaQuery.js';

/**
 * Top-level routing + chrome.
 *
 * Auth model:
 *   The whole app is browseable without signing in. The Topbar shows a
 *   "Sign in" button when the user isn't authenticated; clicking it opens
 *   the LoginModal which overlays the current screen so the user keeps
 *   their place. Logged-in-only features can be gated per-component later.
 *
 * Screens (`screen` state):
 *   home   — Dashboard
 *   magic  — Magic Tool wizard
 *   editor — Document editor
 */
export default function App() {
  const auth = useAuth();

  // Just wait for the brief session-rehydration, then render the app
  // regardless of auth state. (Was previously a hard gate; not anymore.)
  if (auth.loading) return <SplashScreen />;

  return <MainApp />;
}

function MainApp() {
  const { templates }            = useTemplates();
  const { open, switchTemplate } = useDocument();
  const { isAuthenticated }      = useAuth();

  const [screen, setScreen]                 = useState('home');   // 'home' | 'magic' | 'editor'
  const [activeNav, setActiveNav]           = useState('home');
  const [searchVal, setSearchVal]           = useState('');
  const [magicCategory, setMagicCategory]   = useState(null);
  const [showOnboarding, setShowOnboarding] = useLocalStorage('otango.onboarding.shown', true);
  const [showLogin, setShowLogin]           = useState(false);

  // Sidebar visibility — open by default. Hides as a drawer on mobile and
  // collapses to nothing on desktop when the user toggles it off.
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile);
  // Whenever we move across the desktop/mobile boundary, reset to the sensible
  // default for that breakpoint.
  useEffect(() => { setSidebarOpen(!isMobile); }, [isMobile]);

  const isEditor = screen === 'editor';
  const isMagic  = screen === 'magic';

  /** Open a template fresh — wipes person/sections back to defaults. */
  const openTemplate = (tpl) => {
    if (!tpl) tpl = templates[0];
    if (!tpl) return;
    open(tpl);
    setScreen('editor');
  };

  /** Pick a template at the end of the magic wizard. Preserves user data. */
  const chooseTemplateFromMagic = (tpl) => {
    if (!tpl) return;
    switchTemplate(tpl);
    setScreen('editor');
  };

  const launchMagic = (category = null) => {
    setActiveNav('magic');
    setMagicCategory(category);
    setScreen('magic');
  };

  const goHome = () => {
    setScreen('home');
    setActiveNav('home');
  };

  const handleNavChange = (id) => {
    setActiveNav(id);
    if (id === 'magic') { setScreen('magic'); return; }
    if (screen !== 'home') setScreen('home');
  };

  return (
    <div className="app">
      <Topbar
        searchVal={searchVal} onSearch={setSearchVal}
        isEditor={isEditor || isMagic}
        onNewDesign={() => openTemplate(templates[0])}
        onGoHome={goHome}
        onSignInClick={() => setShowLogin(true)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {!isEditor && (
          <Sidebar
            activeNav={activeNav}
            setNav={handleNavChange}
            onNewDesign={() => openTemplate(templates[0])}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* The sidebar hamburger lives here — inside the content area,
              NOT in the topbar — so the future nav-hamburger can take the
              topbar slot. Hidden inside the editor where there's no
              sidebar to toggle. */}
          {!isEditor && (
            <SidebarToggle
              open={sidebarOpen}
              onToggle={() => setSidebarOpen((v) => !v)}
            />
          )}
          {renderScreen()}
        </div>
      </div>

      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <TweaksPanel
        showOnboarding={showOnboarding}
        setShowOnboarding={setShowOnboarding}
        onOpenTemplate={openTemplate}
      />
    </div>
  );

  function renderScreen() {
    if (isEditor) return <Editor onBack={goHome} />;
    if (isMagic)  return <MagicTool initialCategory={magicCategory} onChooseTemplate={chooseTemplateFromMagic} onExit={goHome} />;

    switch (activeNav) {
      case 'profile':
        // Profile is a signed-in-only screen. If someone arrived here via the
        // tweaks panel or a stale activeNav, prompt them to sign in.
        if (!isAuthenticated) {
          return <SignInPrompt onSignIn={() => setShowLogin(true)} />;
        }
        return <ProfileScreen />;
      case 'templates': return <TemplatesScreen onOpenTemplate={openTemplate} externalSearch={searchVal} />;
      case 'designs':   return <MyDesignsScreen onOpenTemplate={openTemplate} />;
      case 'starred':   return <StarredScreen onOpenTemplate={openTemplate} />;
      case 'settings':  return <SettingsScreen />;
      default:
        return <Dashboard
          onOpenTemplate={openTemplate}
          onLaunchMagic={launchMagic}
          externalSearch={searchVal}
        />;
    }
  }
}

/** Shown when an authenticated-only screen is accessed while signed-out. */
function SignInPrompt({ onSignIn }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: 24,
    }}>
      <div style={{
        maxWidth: 380, width: '100%', textAlign: 'center',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 18, padding: '32px 28px',
        boxShadow: '0 16px 36px rgba(0,0,0,0.25)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18,
          color: 'var(--fg-primary)', marginBottom: 6,
        }}>Sign in to view your profile</div>
        <p style={{
          fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.6, marginBottom: 18,
        }}>
          You don't need an account to use Otango — but signing in unlocks
          your saved profile, plan, and notification settings.
        </p>
        <button onClick={onSignIn} style={{
          background: 'linear-gradient(135deg,#1756C8,#00C8D4)', color: '#fff',
          border: 'none', borderRadius: 999, padding: '10px 22px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
          cursor: 'pointer', boxShadow: '0 4px 14px rgba(23, 86, 200,0.35)',
        }}>Sign in</button>
      </div>
    </div>
  );
}

/** Brief loading state shown while we rehydrate the session from storage. */
function SplashScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', color: 'var(--fg-tertiary)',
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, gap: 12,
    }}>
      <Logo size={36} />
      Loading OtangoPaper…
    </div>
  );
}
