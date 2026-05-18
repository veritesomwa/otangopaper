// Mongoose User model.
//
// One row per person. A user can be authenticated via email+password,
// Google OAuth, or both (we merge by email). Users matching ADMIN_EMAILS
// in config get isAdmin auto-stamped.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    index: true,
  },

  // Password auth — null for users who only signed in with Google.
  passwordHash: { type: String, default: null },

  // Google OAuth — null for users who only registered via email/password.
  googleSub:    { type: String, default: null, index: true, sparse: true },

  // Profile (kept in sync with the latest Google sign-in if available)
  name:          { type: String, default: '' },
  givenName:     { type: String, default: '' },
  familyName:    { type: String, default: '' },
  picture:       { type: String, default: '' },
  locale:        { type: String, default: '' },
  emailVerified: { type: Boolean, default: false },

  isAdmin:       { type: Boolean, default: false },

  // Reusable resume profile — seeded into every new document the user opens
  // so they don't have to re-type contact info / bio across templates. Stays
  // as a free-form sub-doc because templates may want richer fields later
  // (skills, experience, education, languages, hobbies, references, etc.).
  profile: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Strip sensitive fields from JSON serialisations.
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.passwordHash;
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
