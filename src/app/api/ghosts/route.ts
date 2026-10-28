import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_GHOSTS, Ghost } from '@/data/ghosts';
import { connectToDatabase } from '@/lib/mongodb';
import { GhostModel } from '@/models/Ghost';

let localGhosts: Ghost[] = [...INITIAL_GHOSTS];

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const dbGhosts = await GhostModel.find({}).sort({ createdAt: -1 });
      if (dbGhosts.length > 0) {
        return NextResponse.json({ ghosts: dbGhosts, source: 'mongodb' });
      }
    }
  } catch {}
  return NextResponse.json({ ghosts: localGhosts, source: 'local' });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newGhost: Ghost = {
      id: data.id || `ghost-${Date.now()}`,
      title: data.title || 'untitled-artifact.txt',
      type: data.type || 'draft',
      originDate: data.originDate || 'Recent',
      abandonedDate: data.abandonedDate || 'Just now',
      daysAbandoned: data.daysAbandoned || 0,
      snippet: data.snippet || 'No excerpt available.',
      path: data.path || '~/Dropped/unknown',
      size: data.size || '1.2 KB',
      epitaph: data.epitaph || {
        whatItWas: 'An artifact dropped into the machine.',
        whenItDied: 'Today.',
        whatItWasTryingToBecome: 'Something whole.',
        fullText: 'A newly summoned ghost awaits its vigil.',
      },
      revivalStep: data.revivalStep || 'Re-read the first sentence and continue.',
      isLit: false,
      isReleased: false,
      modelVoices: {
        qwen3: 'A quiet new arrival.',
        gemma3: 'Dust stirred by your hand.',
        llama3: 'New node recorded in local store.',
        mistral: 'Fresh ink on dry vellum.',
        personal: 'You brought this back into the room.',
      },
    };
    localGhosts.unshift(newGhost);
    try {
      const db = await connectToDatabase();
      if (db) {
        await GhostModel.create(newGhost);
      }
    } catch {}
    return NextResponse.json({ ghost: newGhost, success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, isLit, isReleased } = await req.json();
    const ghost = localGhosts.find((g) => g.id === id);
    if (ghost) {
      if (typeof isLit === 'boolean') {
        ghost.isLit = isLit;
        ghost.litAt = isLit ? new Date().toISOString() : undefined;
      }
      if (typeof isReleased === 'boolean') {
        ghost.isReleased = isReleased;
        ghost.releasedAt = isReleased ? new Date().toISOString() : undefined;
      }
    }
    try {
      const db = await connectToDatabase();
      if (db) {
        await GhostModel.findOneAndUpdate(
          { id },
          {
            ...(typeof isLit === 'boolean' && { isLit, litAt: isLit ? new Date().toISOString() : undefined }),
            ...(typeof isReleased === 'boolean' && { isReleased, releasedAt: isReleased ? new Date().toISOString() : undefined }),
          }
        );
      }
    } catch {}
    return NextResponse.json({ success: true, ghost });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
