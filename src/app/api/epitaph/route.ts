import { NextRequest } from 'next/server';
import { INITIAL_GHOSTS } from '@/data/ghosts';

export async function POST(req: NextRequest) {
  try {
    const { ghostId, action = 'epitaph', mode = 'demo', model = 'gemma3' } = await req.json();
    const ghost = INITIAL_GHOSTS.find((g) => g.id === ghostId) || INITIAL_GHOSTS[0];

    let fullTextToStream = '';
    if (action === 'revive') {
      fullTextToStream = ghost.revivalStep || 'Take one quiet breath and write the first sentence.';
    } else {
      fullTextToStream = ghost.epitaph.fullText;
    }

    if (mode === 'live') {
      try {
        const ollamaRes = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model || 'gemma3:latest',
            prompt: `You are the quiet, literary voice of Pale Hours (running Gemma 3). Write a poetic, introspective epitaph or revival step for this abandoned draft:\nTitle: ${ghost.title}\nExcerpt: ${ghost.snippet}\nAction: ${action}`,
            stream: true,
          }),
          signal: AbortSignal.timeout(3000),
        });

        if (ollamaRes.ok && ollamaRes.body) {
          return new Response(ollamaRes.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
            },
          });
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    const words = fullTextToStream.split(' ');
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i === words.length - 1 ? '' : ' ');
          const chunk = JSON.stringify({ response: word, done: i === words.length - 1 });
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          await new Promise((res) => setTimeout(res, 24));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
