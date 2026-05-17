// Registry of every template renderer, keyed by `template.style`.
//
// To add a new template:
//   1. Drop the renderer in templates/<group>.jsx
//   2. Re-export it here
//   3. Map its style id to the renderer in TEMPLATE_RENDERERS below
//   4. Add catalog metadata in src/data/templates.js

import {
  ModernResume, MinimalResume, ExecutiveResume, CreativeResume,
  TechResume, ClassicResume,
  WarmCreamResume, NavyDarkResume, EmeraldBoldResume,
  ScarletResume, TerracottaResume, TealRightResume,
  CharcoalDarkResume, TimelineResume,
} from './resumes.jsx';

import { LetterProResume }    from './letters.jsx';
import { NewsletterCanvas }   from './newsletters.jsx';
import { CertificateCanvas }  from './certificates.jsx';
import { CollegeCanvas }      from './college.jsx';
import { BizModernCard, BizBoldCard, BizCreativeCard } from './cards.jsx';
import { LinkedInProBanner, LinkedInCreativeBanner }   from './banners.jsx';
import { PortfolioDesignCanvas, PortfolioDevCanvas }   from './portfolios.jsx';

// New (this round)
import {
  BizMonoCard, BizLetterpressCard, BizPhotoCard, BizLuxeCard, BizFoilCard,
} from './cards-extra.jsx';
import {
  PostcardTravel, PostcardEvent, PostcardThanks, PostcardHoliday,
} from './postcards.jsx';
import {
  LinkedInMinimalBanner, LinkedInQuoteBanner, LinkedInSkillsBanner,
} from './banners-extra.jsx';
import { MagazineNewsletter, BlogNewsletter } from './newsletters-extra.jsx';
import { ModernCertificate } from './certificates-extra.jsx';

export const TEMPLATE_RENDERERS = {
  // ── Resumes ──────────────────────────────────────────────────────────
  modern:           (p) => <ModernResume      {...p} />,
  executive:        (p) => <ExecutiveResume   {...p} />,
  minimal:          (p) => <MinimalResume     {...p} />,
  creative:         (p) => <CreativeResume    {...p} />,
  tech:             (p) => <TechResume        {...p} />,
  classic:          (p) => <ClassicResume     {...p} />,
  'warm-cream':     (p) => <WarmCreamResume   {...p} />,
  'navy-dark':      (p) => <NavyDarkResume    {...p} />,
  'emerald-bold':   (p) => <EmeraldBoldResume {...p} />,
  scarlet:          (p) => <ScarletResume     {...p} />,
  terracotta:       (p) => <TerracottaResume  {...p} />,
  'teal-right':     (p) => <TealRightResume   {...p} />,
  'charcoal-dark':  (p) => <CharcoalDarkResume{...p} />,
  timeline:         (p) => <TimelineResume    {...p} />,

  // ── Cover letters ───────────────────────────────────────────────────
  'letter-pro':      (p) => <LetterProResume {...p} />,
  'letter-simple':   (p) => <MinimalResume   {...p} />,
  'letter-creative': (p) => <CreativeResume  {...p} />,

  // ── Newsletters ─────────────────────────────────────────────────────
  'nl-weekly':       (p) => <NewsletterCanvas  accent={p.accent} person={p.person} />,
  'nl-company':      (p) => <NewsletterCanvas  accent={p.accent} person={p.person} />,
  'nl-product':      (p) => <NewsletterCanvas  accent={p.accent} person={p.person} />,
  'nl-mag':          (p) => <MagazineNewsletter accent={p.accent} person={p.person} />,
  'nl-blog':         (p) => <BlogNewsletter   accent={p.accent} person={p.person} />,

  // ── College apps ────────────────────────────────────────────────────
  'college-sop':     (p) => <CollegeCanvas accent={p.accent} person={p.person} />,
  'college-ps':      (p) => <CollegeCanvas accent={p.accent} person={p.person} />,

  // ── Certificates ────────────────────────────────────────────────────
  'cert-gold':       (p) => <CertificateCanvas  accent={p.accent} person={p.person} />,
  'cert-blue':       (p) => <CertificateCanvas  accent={p.accent} person={p.person} />,
  'cert-modern':     (p) => <ModernCertificate accent={p.accent} person={p.person} />,

  // ── Business cards ──────────────────────────────────────────────────
  'biz-modern':      (p) => <BizModernCard       accent={p.accent} person={p.person} />,
  'biz-bold':        (p) => <BizBoldCard         accent={p.accent} person={p.person} />,
  'biz-creative':    (p) => <BizCreativeCard     accent={p.accent} person={p.person} />,
  'biz-mono':        (p) => <BizMonoCard         accent={p.accent} person={p.person} />,
  'biz-letterpress': (p) => <BizLetterpressCard  accent={p.accent} person={p.person} />,
  'biz-photo':       (p) => <BizPhotoCard        accent={p.accent} person={p.person} />,
  'biz-luxe':        (p) => <BizLuxeCard         accent={p.accent} person={p.person} />,
  'biz-foil':        (p) => <BizFoilCard         accent={p.accent} person={p.person} />,

  // ── Postcards ───────────────────────────────────────────────────────
  'pc-travel':       (p) => <PostcardTravel  accent={p.accent} person={p.person} />,
  'pc-event':        (p) => <PostcardEvent   accent={p.accent} person={p.person} />,
  'pc-thanks':       (p) => <PostcardThanks  accent={p.accent} person={p.person} />,
  'pc-holiday':      (p) => <PostcardHoliday accent={p.accent} person={p.person} />,

  // ── LinkedIn banners ────────────────────────────────────────────────
  'li-pro':          (p) => <LinkedInProBanner      accent={p.accent} person={p.person} />,
  'li-creative':     (p) => <LinkedInCreativeBanner accent={p.accent} person={p.person} />,
  'li-minimal':      (p) => <LinkedInMinimalBanner  accent={p.accent} person={p.person} />,
  'li-quote':        (p) => <LinkedInQuoteBanner    accent={p.accent} person={p.person} />,
  'li-skills':       (p) => <LinkedInSkillsBanner   accent={p.accent} person={p.person} />,

  // ── Portfolios ──────────────────────────────────────────────────────
  'port-design':     (p) => <PortfolioDesignCanvas accent={p.accent} person={p.person} />,
  'port-dev':        (p) => <PortfolioDevCanvas    accent={p.accent} person={p.person} />,
};
