// Read-only view of the template catalog.
//
// Templates currently ship as static seed data (src/data/templates.js) — the
// backend has no /templates endpoint yet. Resolving them locally guarantees
// the gallery, magic wizard, and editor always work, regardless of whether
// the API server is reachable.
//
// When you add a real /templates endpoint, swap this back to apiFetch and
// nothing else in the app needs to change.

import { ALL_TEMPLATES } from '@data/templates.js';

export const templateService = {
  /** All known templates. */
  async list() {
    return ALL_TEMPLATES;
  },

  /** Look up a template by id. */
  async get(id) {
    return ALL_TEMPLATES.find((t) => t.id === id) || null;
  },

  /** Filter helper, runs locally either way. */
  filterByCategory(templates, cat) {
    if (!cat || cat === 'All') return templates;
    return templates.filter((t) => t.cat === cat);
  },
};
