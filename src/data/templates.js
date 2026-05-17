// Template catalog. Each entry describes one design — the renderer is picked
// from `style` by the canvas dispatcher.

export const ALL_TEMPLATES = [
  // ── RESUMES ────────────────────────────────────────────────────────
  { id: 'r1',  name: 'Modern Pro',     cat: 'Resume', style: 'modern',        free: true,  accent: '#1756C8', photo: true,  desc: 'Bold sidebar with clean content layout' },
  { id: 'r2',  name: 'Executive',      cat: 'Resume', style: 'executive',     free: false, accent: '#1A1F2E', photo: false, desc: 'Authoritative two-column layout' },
  { id: 'r3',  name: 'Minimal',        cat: 'Resume', style: 'minimal',       free: true,  accent: '#2C2C2C', photo: false, desc: 'Understated elegance, maximum whitespace' },
  { id: 'r4',  name: 'Creative Bold',  cat: 'Resume', style: 'creative',      free: false, accent: '#FF7A1F', photo: true,  desc: 'Stand out with personality and color' },
  { id: 'r5',  name: 'Tech Stack',     cat: 'Resume', style: 'tech',          free: false, accent: '#00C8D4', photo: false, desc: 'Built for engineers and developers' },
  { id: 'r6',  name: 'Classic',        cat: 'Resume', style: 'classic',       free: true,  accent: '#2E4057', photo: false, desc: 'Traditional, universally accepted format' },
  { id: 'r7',  name: 'Warm Cream',     cat: 'Resume', style: 'warm-cream',    free: true,  accent: '#8B6F47', photo: true,  desc: 'Elegant beige with serif type' },
  { id: 'r8',  name: 'Navy Dark',      cat: 'Resume', style: 'navy-dark',     free: false, accent: '#0F1F3D', photo: true,  desc: 'Bold dark sidebar with skill bars' },
  { id: 'r9',  name: 'Emerald Bold',   cat: 'Resume', style: 'emerald-bold',  free: false, accent: '#4ADE80', photo: true,  desc: 'Dark header with green accent' },
  { id: 'r10', name: 'Scarlet',        cat: 'Resume', style: 'scarlet',       free: false, accent: '#C0392B', photo: true,  desc: 'Red side panel, vertical label' },
  { id: 'r11', name: 'Terracotta',     cat: 'Resume', style: 'terracotta',    free: true,  accent: '#D2603A', photo: true,  desc: 'Warm orange header with photo' },
  { id: 'r12', name: 'Teal Right',     cat: 'Resume', style: 'teal-right',    free: false, accent: '#0A7C6E', photo: true,  desc: 'Clean body, teal right sidebar' },
  { id: 'r13', name: 'Charcoal Dark',  cat: 'Resume', style: 'charcoal-dark', free: false, accent: '#7C8FFF', photo: false, desc: 'Full dark two-column layout' },
  { id: 'r14', name: 'Timeline',       cat: 'Resume', style: 'timeline',      free: true,  accent: '#1756C8', photo: false, desc: 'Timeline dots, ultra-minimal' },

  // ── COVER LETTERS ─────────────────────────────────────────────────
  { id: 'c1', name: 'Professional',   cat: 'Cover Letter', style: 'letter-pro',     free: true,  accent: '#1756C8', photo: false, desc: 'Polished letter matching Modern Pro style' },
  { id: 'c2', name: 'Simple Letter',  cat: 'Cover Letter', style: 'letter-simple',  free: true,  accent: '#333',    photo: false, desc: 'Clean and direct — nothing extra' },
  { id: 'c3', name: 'Creative Cover', cat: 'Cover Letter', style: 'letter-creative',free: false, accent: '#FF7A1F', photo: false, desc: 'Personality-driven application letter' },

  // ── NEWSLETTERS ───────────────────────────────────────────────────
  { id: 'n1', name: 'Weekly Digest',     cat: 'Newsletter', style: 'nl-weekly',  free: false, accent: '#1756C8', photo: false, desc: 'For regular roundup emails' },
  { id: 'n2', name: 'Company Update',    cat: 'Newsletter', style: 'nl-company', free: false, accent: '#22C55E', photo: false, desc: 'Internal team communications' },
  { id: 'n3', name: 'Product Launch',    cat: 'Newsletter', style: 'nl-product', free: false, accent: '#F59E0B', photo: false, desc: 'Announce your next big thing' },
  { id: 'n4', name: 'Magazine Style',    cat: 'Newsletter', style: 'nl-mag',     free: false, accent: '#0D1117', photo: false, desc: 'Editorial masthead layout' },
  { id: 'n5', name: 'Personal Blog',     cat: 'Newsletter', style: 'nl-blog',    free: true,  accent: '#FF7A1F', photo: false, desc: 'Friendly, long-form layout' },

  // ── COLLEGE APPS ──────────────────────────────────────────────────
  { id: 'g1', name: 'Statement of Purpose', cat: 'College App', style: 'college-sop', free: true, accent: '#FF7A1F', photo: false, desc: 'Graduate school application essay' },
  { id: 'g2', name: 'Personal Statement',   cat: 'College App', style: 'college-ps',  free: true, accent: '#F59E0B', photo: false, desc: 'Undergraduate personal statement' },

  // ── CERTIFICATES ──────────────────────────────────────────────────
  { id: 'cert1', name: 'Achievement Award', cat: 'Certificate', style: 'cert-gold',   free: false, accent: '#B8860B', photo: false, desc: 'For outstanding achievements' },
  { id: 'cert2', name: 'Completion',        cat: 'Certificate', style: 'cert-blue',   free: true,  accent: '#1756C8', photo: false, desc: 'Course or program completion' },
  { id: 'cert3', name: 'Modern Minimal',    cat: 'Certificate', style: 'cert-modern', free: false, accent: '#0D1117', photo: false, desc: 'Bold, minimal, contemporary' },

  // ── BUSINESS CARDS ────────────────────────────────────────────────
  { id: 'b1', name: 'Modern Business Card', cat: 'Business Card', style: 'biz-modern',     free: true,  accent: '#1756C8', photo: false, desc: 'Clean two-sided card layout' },
  { id: 'b2', name: 'Bold Business Card',   cat: 'Business Card', style: 'biz-bold',       free: false, accent: '#0D1117', photo: false, desc: 'High-contrast premium card' },
  { id: 'b3', name: 'Creative Card',        cat: 'Business Card', style: 'biz-creative',   free: false, accent: '#FF7A1F', photo: false, desc: 'Stand-out gradient card' },
  { id: 'b4', name: 'Mono',                 cat: 'Business Card', style: 'biz-mono',       free: true,  accent: '#0D1117', photo: false, desc: 'Minimalist black & white' },
  { id: 'b5', name: 'Letterpress',          cat: 'Business Card', style: 'biz-letterpress',free: false, accent: '#8B6F47', photo: false, desc: 'Vintage cream + serif type' },
  { id: 'b6', name: 'Photo Front',          cat: 'Business Card', style: 'biz-photo',      free: false, accent: '#1A1F2E', photo: true,  desc: 'Big photo, contact on the back' },
  { id: 'b7', name: 'Geometric Luxe',       cat: 'Business Card', style: 'biz-luxe',       free: false, accent: '#B8860B', photo: false, desc: 'Gold accents on dark — premium' },
  { id: 'b8', name: 'Holographic Foil',     cat: 'Business Card', style: 'biz-foil',       free: false, accent: '#EC4899', photo: false, desc: 'Iridescent gradient finish' },

  // ── POSTCARDS ─────────────────────────────────────────────────────
  { id: 'pc1', name: 'Travel Postcard',     cat: 'Postcard', style: 'pc-travel',  free: true,  accent: '#D2603A', photo: false, desc: 'Vintage stamp + place name' },
  { id: 'pc2', name: 'Event Postcard',      cat: 'Postcard', style: 'pc-event',   free: false, accent: '#FF7A1F', photo: false, desc: 'Modern hero photo + details' },
  { id: 'pc3', name: 'Thank-you Card',      cat: 'Postcard', style: 'pc-thanks',  free: true,  accent: '#0A7C6E', photo: false, desc: 'Elegant minimal note' },
  { id: 'pc4', name: 'Holiday Card',        cat: 'Postcard', style: 'pc-holiday', free: false, accent: '#C0392B', photo: false, desc: 'Festive seasonal greeting' },

  // ── LINKEDIN BANNERS ──────────────────────────────────────────────
  { id: 'li1', name: 'Professional Banner', cat: 'LinkedIn', style: 'li-pro',      free: true,  accent: '#1756C8', photo: false, desc: 'Clean LinkedIn profile header' },
  { id: 'li2', name: 'Creative Banner',     cat: 'LinkedIn', style: 'li-creative', free: false, accent: '#FF7A1F', photo: false, desc: 'Gradient banner with CTAs' },
  { id: 'li3', name: 'Minimalist Banner',   cat: 'LinkedIn', style: 'li-minimal',  free: true,  accent: '#0D1117', photo: false, desc: 'Pure typography, no clutter' },
  { id: 'li4', name: 'Quote Banner',        cat: 'LinkedIn', style: 'li-quote',    free: false, accent: '#1A1F2E', photo: true,  desc: 'Signature pull-quote with photo' },
  { id: 'li5', name: 'Skills Banner',       cat: 'LinkedIn', style: 'li-skills',   free: false, accent: '#0A7C6E', photo: false, desc: 'Showcase your top skills' },

  // ── PORTFOLIO PAGES ───────────────────────────────────────────────
  { id: 'p1', name: 'Designer Portfolio', cat: 'Portfolio', style: 'port-design', free: false, accent: '#1756C8', photo: true,  desc: 'Showcase creative work' },
  { id: 'p2', name: 'Dev Portfolio',      cat: 'Portfolio', style: 'port-dev',    free: false, accent: '#00C8D4', photo: false, desc: 'Built for engineers' },
];

export const TEMPLATE_CATS = [
  'All',
  'Resume',
  'Cover Letter',
  'Newsletter',
  'College App',
  'Certificate',
  'Business Card',
  'LinkedIn',
  'Portfolio',
];
