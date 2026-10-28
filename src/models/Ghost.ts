import mongoose, { Schema, Document } from 'mongoose';
import { Ghost as GhostInterface } from '../data/ghosts';

export type GhostDocument = GhostInterface & Document;

const GhostSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    originDate: { type: String, required: true },
    abandonedDate: { type: String, required: true },
    daysAbandoned: { type: Number, required: true },
    snippet: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: String, required: true },
    epitaph: {
      whatItWas: { type: String, required: true },
      whenItDied: { type: String, required: true },
      whatItWasTryingToBecome: { type: String, required: true },
      fullText: { type: String, required: true },
    },
    revivalStep: { type: String, required: true },
    isLit: { type: Boolean, default: false },
    litAt: { type: String },
    isReleased: { type: Boolean, default: false },
    releasedAt: { type: String },
    modelVoices: { type: Map, of: String },
  },
  {
    timestamps: true,
  }
);

export const GhostModel =
  mongoose.models.Ghost || mongoose.model<GhostDocument>('Ghost', GhostSchema);
