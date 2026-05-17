import { useState } from 'react';
import { useMagicTool } from '@hooks/useMagicTool.js';
import { MagicProgress } from './MagicProgress.jsx';

// Existing (resume-shared) steps
import { WelcomeStep }       from './steps/WelcomeStep.jsx';
import { BasicsStep }        from './steps/BasicsStep.jsx';
import { SummaryStep }       from './steps/SummaryStep.jsx';
import { ExperienceStep }    from './steps/ExperienceStep.jsx';
import { EducationStep }     from './steps/EducationStep.jsx';
import { SkillsStep }        from './steps/SkillsStep.jsx';
import { LanguagesStep }     from './steps/LanguagesStep.jsx';
import { HobbiesStep }       from './steps/HobbiesStep.jsx';
import { ReferencesStep }    from './steps/ReferencesStep.jsx';

// Polymorphic + new steps
import { PickCategoryStep }       from './steps/PickCategoryStep.jsx';
import { PickStep }               from './steps/PickStep.jsx';
import { CardIdentityStep }       from './steps/CardIdentityStep.jsx';
import { CardContactStep }        from './steps/CardContactStep.jsx';
import { LetterRecipientStep }    from './steps/LetterRecipientStep.jsx';
import { LetterBodyStep }         from './steps/LetterBodyStep.jsx';
import { NewsletterMetaStep }     from './steps/NewsletterMetaStep.jsx';
import { NewsletterHeroStep }     from './steps/NewsletterHeroStep.jsx';
import { NewsletterStoriesStep }  from './steps/NewsletterStoriesStep.jsx';
import { CertificateDetailsStep } from './steps/CertificateDetailsStep.jsx';
import { CollegeProgramStep }     from './steps/CollegeProgramStep.jsx';
import { CollegeEssayStep }       from './steps/CollegeEssayStep.jsx';
import { PortfolioProjectsStep }  from './steps/PortfolioProjectsStep.jsx';
import { PostcardDetailsStep }    from './steps/PostcardDetailsStep.jsx';

// Step id → component
const STEP_COMPONENTS = {
  welcome: WelcomeStep,        // legacy resume welcome — kept so old launches keep working
  basics:  BasicsStep,
  summary: SummaryStep,
  experience: ExperienceStep,
  education:  EducationStep,
  skills:     SkillsStep,
  languages:  LanguagesStep,
  hobbies:    HobbiesStep,
  references: ReferencesStep,

  pickCategory:       PickCategoryStep,
  cardIdentity:       CardIdentityStep,
  cardContact:        CardContactStep,
  letterRecipient:    LetterRecipientStep,
  letterBody:         LetterBodyStep,
  newsletterMeta:     NewsletterMetaStep,
  newsletterHero:     NewsletterHeroStep,
  newsletterStories:  NewsletterStoriesStep,
  certificateDetails: CertificateDetailsStep,
  collegeProgram:     CollegeProgramStep,
  collegeEssay:       CollegeEssayStep,
  portfolioProjects:  PortfolioProjectsStep,
  postcardDetails:    PostcardDetailsStep,

  // Picker steps — they all use the same generic PickStep
  pickResume:      (p) => <PickStep {...p} category="resume" />,
  pickCard:        (p) => <PickStep {...p} category="card" />,
  pickLetter:      (p) => <PickStep {...p} category="letter" />,
  pickNewsletter:  (p) => <PickStep {...p} category="newsletter" />,
  pickCertificate: (p) => <PickStep {...p} category="certificate" />,
  pickCollege:     (p) => <PickStep {...p} category="college" />,
  pickBanner:      (p) => <PickStep {...p} category="banner" />,
  pickPortfolio:   (p) => <PickStep {...p} category="portfolio" />,
  pickPostcard:    (p) => <PickStep {...p} category="postcard" />,
};

/**
 * Top-level Magic Tool screen — full-page wizard. The active wizard is decided
 * by `initialCategory`. If none is given, the first step lets the user choose.
 *
 * Once the user picks a template at the end, `onChooseTemplate(t)` fires and
 * the host (App.jsx) opens the editor.
 */
export function MagicTool({ initialCategory = null, onChooseTemplate, onExit }) {
  const [category, setCategory] = useState(initialCategory);
  const magic = useMagicTool({ category });

  const Current = STEP_COMPONENTS[magic.stepId] || (() => null);

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
      <div style={{ padding: '32px 24px 64px', maxWidth: 760, margin: '0 auto' }}>
        <Header
          stepIndex={magic.stepIndex} total={magic.total}
          category={category} onResetCategory={() => setCategory(null)}
          onExit={onExit}
        />

        <MagicProgress stepIds={magic.stepIds} stepIndex={magic.stepIndex} jumpTo={magic.jumpTo} />

        <Current
          step={magic.step} magic={magic}
          onChooseCategory={(c) => setCategory(c)}
          onChooseTemplate={onChooseTemplate}
        />
      </div>
    </div>
  );
}

function Header({ stepIndex, total, category, onResetCategory, onExit }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18,
        color: 'var(--fg-primary)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{
          background: 'linear-gradient(135deg,#1756C8,#00C8D4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Magic Tool</span>
        <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 400 }}>
          · step {stepIndex + 1} of {total}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {category && (
          <button onClick={onResetCategory} style={btnGhost()}>
            Change type
          </button>
        )}
        <button onClick={onExit} style={btnGhost()}>Exit wizard</button>
      </div>
    </div>
  );
}

function btnGhost() {
  return {
    background: 'transparent', border: '1px solid var(--border)',
    borderRadius: 999, padding: '7px 16px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
    color: 'var(--fg-tertiary)', cursor: 'pointer',
  };
}
