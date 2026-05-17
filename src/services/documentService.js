// CRUD for the user's saved designs.
//
// The backend doesn't expose /documents yet, so we resolve everything from
// local seed data. When persistence lands, swap each method to call apiFetch
// (gated on `getToken()` so unauthenticated users still see the seed list).

import { RECENT_DESIGNS } from '@data/recentDesigns.js';

export const documentService = {
  /** List the current user's documents (most recent first). */
  async list() {
    return RECENT_DESIGNS;
  },

  /** Read a single document by id. */
  async get(id) {
    return RECENT_DESIGNS.find((d) => d.id === id) || null;
  },

  /** Persist a new document. Returns the saved record (with id). */
  async create(doc) {
    return { ...doc, id: `rd-${Date.now()}` };
  },

  /** Patch an existing document. */
  async update(id, patch) {
    return { id, ...patch };
  },

  /** Delete a document. */
  async remove(_id) {
    return true;
  },
};
