# Pale Hours (Las Horas Pálidas)
*A local-first digital graveyard for the things you abandoned.*

[![Ghost in the Machine](https://img.shields.io/badge/Hackathon-Ghost_in_the_Machine-D9822B?style=flat-square)](https://devrelay.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_Turbopack-2B2A27?style=flat-square)](https://nextjs.org)
[![Local AI](https://img.shields.io/badge/AI-Local_Open_Weights-6F6B62?style=flat-square)](https://ollama.ai)
[![License](https://img.shields.io/badge/License-MIT-CFC8B8?style=flat-square)](LICENSE)

> *"Everything you began was an attempt to be understood by someone who hadn’t arrived yet. Now let it rest, or let it breathe."*

---

## 🕯️ Concept & Philosophy

Every developer, writer, and maker leaves behind a trail of quiet ghosts:
- Unsent letters in draft folders
- Repositories abandoned at commit 4 (`git commit -m "wip refactor"`)
- Voice memos recorded at 2:00 AM that were never opened again
- Stalled essays, forgotten domain registrations, half-wired electronics

Closed-source AI products treat everything as raw training fodder, mining your unfinished thoughts to feed corporate weights in distant data centers. 

**Pale Hours** was built for the **"Ghost in the Machine"** hackathon (Halloween / Día de los Muertos theme). It is a sacred, private, and local-first ritual space. You point it at your discarded work on your own machine. An open-weight model running entirely in local memory reads them and performs three rites:

1. **The Epitaph**: Composes a quiet, literary obituary: what the project was, when it ceased breathing, and what it was trying to become.
2. **The Candle (Revival)**: If you choose to rekindle it, the model drafts the single smallest, frictionless step to resume work.
3. **The Ash (Letting Go)**: If you choose to release it, the artifact dissolves into a cold ember, preserved only as a memory on the communal **Ofrenda** altar.

**Zero telemetry. Zero cloud round-trips. Your machine stays cold, silent, and sovereign.**

---

## 🏛️ The Four Spaces

### 1. `/` — The Cinematic Scroll
A scroll-driven journey through the philosophy of unfinished work:
- **Simplex Noise Fog Field**: WebGL canvas running custom fragment shaders where morning mist parts around your cursor like warm breath.
- **The Disappearing Sentence**: A pinned typographic rite where each scroll fraction consumes words until only silence remains.
- **The Drift of Six Ghosts**: Horizontal vellum cards floating at variable drift velocities.
- **The Severed Wi-Fi Rite**: An interactive cryptographic privacy demonstration showing network lines cut while local inference continues unbothered.
- **Opposing Velocity Marquees & Magnetic Entrance**.

### 2. `/vigil` — The Ritual Room
An interactive workspace to lay your own unfinished things to rest:
- **Ledger of Departed Artifacts**: Drag and drop real files (`.md`, `.py`, `.ts`, `.txt`, `.json`, audio transcripts) or click to draft thoughts.
- **Floating Vellum Canvas**: Three.js paper sheet that bends and floats with mouse inertia.
- **Streaming Epitaph Room**: Direct Server-Sent Events (SSE) streaming token-by-token from your local open-weight model with micro-crackle candle audio.
- **Two Sacred Actions**:
  - `🕯️ Light a candle`: Drafts the first step to continue without guilt.
  - `💨 Let it go`: Releases the artifact with a soft breath frequency, dissolving it into ash.
- **Live / Offline Auto-negotiation**: Seamlessly connects to Ollama (`localhost:11434`) or runs a high-fidelity local simulation if the daemon is asleep.

### 3. `/ofrenda` — The Digital Altar
A multi-tiered Mexican Día de los Muertos altar celebrating creative relics:
- **Three Sacred Tiers**:
  - *Tier 1 (The Spoken Word)*: Forgotten lyrics, voice memo fragments, unsent letters.
  - *Tier 2 (The Stalled Engines)*: Dead repositories, unmerged branches, abandoned engines.
  - *Tier 3 (The Unborn Ideas)*: Business pitches, domain names, philosophical essays.
- **Papel Picado Banners**: Pierced paper banners swaying gently in a virtual draft.
- **Interactive Candle Flames**: Flickering WebGL marigold lights marking revivals.
- **Full Reading Chamber**: Shared-layout modal view with full transcripts, model voices, and relic tokens.
- **The Year of Unfinished Things**: Real-time aggregate telemetry of all relics laid to rest.

### 4. `/open` — How It Haunts (Architecture & Philosophy)
The manifesto and interactive technical inspection chamber:
- **Live Model Voice Swapper**: Toggle between 5 open-weight architectures (`Gemma 3 (Primary)`, `Qwen 3`, `Llama 3.3`, `Mistral Nemo`, `Personal LoRA`) and watch how each model’s literary voice and temperament alters the same dead git commit.
- **Architecture Diagram**: Visualizes the local loop from POSIX file reads to llama.cpp/Ollama context windows.
- **Open-Source vs. Closed Cloud Matrix**: Side-by-side comparison of local sanctity vs. surveillance capitalism.
- **The Manifesto**: An essay on why AI should mourn with us rather than harvest us.

---

## 🎨 Design Philosophy & Sacred Palette

Pale Hours rejects the generic "dark mode neon purple" AI aesthetic. It is styled after sun-bleached parchment, monastery ledgers, and Mexican marigolds:

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--bone` | `#F4F0E8` | Primary ambient page background (never pure white `#FFF`) |
| `--vellum` | `#EFEADF` | Card surfaces, modal chambers, layered paper sheets |
| `--linen` | `#E8E2D5` | Elevated surfaces and active tabs |
| `--chalk` | `#FAF8F3` | Highlights and illuminated accents |
| `--ash` | `#CFC8B8` | Hairline borders (1px) and muted inscriptions |
| `--graphite` | `#2B2A27` | Primary literary typography |
| `--smoke` | `#6F6B62` | Secondary timestamps, coordinates, and notes |
| `--marigold` | `#D9822B` | Candle flames, active focus rings, cursor breath trail |

### Tactile Features
- **Zero Gradients**: Depth is achieved entirely through flat tonal layering, ambient light, blur, and hairline boundaries.
- **8 FPS Animated Film Grain**: Custom SVG filter mimicking 16mm archival film stock.
- **Web Audio Sanctuary**: Synthesizer creating a 55Hz low room hum, 432Hz brass singing bowl chimes, and candle flame micro-crackles without any external audio assets.
- **Custom Marigold Cursor**: Magnetic ring leaving soft, fading breath-trail particles across the screen.

---

## ⚡ Quickstart

### Prerequisites
- [Bun](https://bun.sh) (or Node.js 18+)
- *(Optional for real inference)* [Ollama](https://ollama.ai) running locally

### 1. Clone & Install
```bash
git clone https://github.com/your-username/pale-hours.git
cd pale-hours
bun install
```

### 2. (Optional) Pull an Open-Weight Model
```bash
ollama pull gemma3
# or: ollama pull gemma2:9b
# or: ollama pull llama3.2:3b
```

### 3. (Optional) Set Environment Variables
Create a `.env.local` file:
```env
# Optional MongoDB connection. If omitted, Pale Hours automatically
# uses an in-memory repository with 12 rich historical seed ghosts.
MONGODB_URI=mongodb://localhost:27017/pale-hours

# Optional Ollama host override (defaults to http://127.0.0.1:11434)
OLLAMA_HOST=http://127.0.0.1:11434
```

### 4. Run the Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org) with App Router & Turbopack
- **Runtime**: [Bun](https://bun.sh)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom CSS design tokens
- **Typography**: `Instrument Serif` (editorial headers), `Fraunces` (warm literary accents), `Geist` (clean UI), `JetBrains Mono` (technical metadata)
- **3D / Canvas**: [Three.js](https://threejs.org), [@react-three/fiber](https://r3f.docs.pmnd.rs), [@react-three/drei](https://github.com/pmndrs/drei)
- **Animation**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com), [Lenis](https://lenis.darkroom.engineering) smooth scrolling
- **Database**: [MongoDB](https://www.mongodb.com) / Mongoose with automatic offline in-memory fallback
- **Sound**: Native Web Audio API procedural oscillator synthesis

---

## 🕊️ Hackathon Reflection: Ghost in the Machine

Most AI hackathons build tools for velocity: *write code faster, summarize meetings faster, send more cold emails*.

**Pale Hours** builds for memory, peace, and closure. 

Open-source AI gives us sovereign ownership over how our deepest, most private, and most fragile thoughts are processed. When a model runs on your own GPU, it is not an agent of an advertising conglomerate; it is an intimate instrument of reflection.

May your departed projects find rest, or find their second breath.
