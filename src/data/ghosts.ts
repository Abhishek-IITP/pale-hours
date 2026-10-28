import ghostsData from './ghosts.json';

export type GhostType = 'draft' | 'repo' | 'voice' | 'poem' | 'todo' | 'plan';

export interface GhostEpitaph {
  whatItWas: string;
  whenItDied: string;
  whatItWasTryingToBecome: string;
  fullText: string;
}

export interface Ghost {
  id: string;
  title: string;
  type: GhostType;
  originDate: string;
  abandonedDate: string;
  daysAbandoned: number;
  snippet: string;
  path: string;
  size: string;
  epitaph: GhostEpitaph;
  revivalStep: string;
  isLit: boolean;
  litAt?: string;
  isReleased: boolean;
  releasedAt?: string;
  modelVoices: Record<string, string>;
}

export const INITIAL_GHOSTS: Ghost[] = ghostsData as unknown as Ghost[];
