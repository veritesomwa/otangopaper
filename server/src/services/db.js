// MongoDB connection — opened once at server boot via connectMongo().
// All routes operate against the live `mongoose.connection`.

import mongoose from 'mongoose';
import { config } from '../config.js';

mongoose.set('strictQuery', true);

export async function connectMongo() {
  await mongoose.connect(config.mongoUri, {
    // Tighter timeouts than the defaults so we fail fast in dev if Atlas
    // can't be reached (rather than hanging the boot for 30s).
    serverSelectionTimeoutMS: 8000,
  });
  const c = mongoose.connection;
  console.log(`✓ MongoDB connected → ${c.host}/${c.name}`);

  c.on('disconnected', () => console.warn('⚠ MongoDB disconnected'));
  c.on('reconnected',  () => console.log('✓ MongoDB reconnected'));
}

export async function disconnectMongo() {
  await mongoose.connection.close();
}
