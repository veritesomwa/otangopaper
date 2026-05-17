// AI Fill controller. The real implementation would proxy to Claude / OpenAI
// from the backend (never call those APIs from the browser — your key would
// leak). Until that endpoint exists, return a believable stubbed payload so
// the UI flow can be tested.

import { apiFetch, isOffline } from './api.js';

const STUB_RESULT = {
  summary:
    'Senior software engineer with 8+ years scaling distributed systems at companies like Google and Stripe. Passionate about reliability, mentorship, and shipping pragmatic solutions to hard problems.',
  skills: ['Python', 'Go', 'Kubernetes', 'AWS', 'Postgres', 'Distributed Systems', 'gRPC', 'Observability'],
  experience: [
    {
      company: 'Google',
      role: 'Staff Software Engineer',
      period: '2022 – Present',
      bullets: [
        'Led the rewrite of a core indexing pipeline; cut p99 latency by 38%',
        'Mentored 4 engineers, two of whom were promoted to senior',
        'Designed an auto-scaling policy adopted by 6 sister teams',
      ],
    },
    {
      company: 'Stripe',
      role: 'Senior Engineer',
      period: '2018 – 2022',
      bullets: [
        'Built the idempotency layer used by every public payments API',
        'Reduced incident MTTR by 50% by adding structured tracing',
        'Authored the team handbook now onboarding all new hires',
      ],
    },
  ],
};

export const aiService = {
  /**
   * Generate resume content from a free-form prompt.
   *
   * @param {string} prompt user-typed bio or job description
   * @returns {Promise<{summary:string, skills:string[], experience:Array}>}
   */
  async fill(prompt) {
    if (isOffline() || import.meta.env.VITE_AI_ENABLED !== 'true') {
      // Pretend we hit the network so loading states feel real.
      await new Promise((r) => setTimeout(r, 700));
      return STUB_RESULT;
    }
    return apiFetch('/ai/fill', { method: 'POST', body: { prompt } });
  },
};
