import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Gamepad2,
  ArrowRight,
  Flame,
  Users,
  Wand2,
  Layers3,
  Compass,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { formatNumber } from '../lib/utils';

type IconComponent = React.ComponentType<{ className?: string }>;

interface FeaturedGame {
  id: string;
  title: string;
  summary: string;
  genre: string;
  playCount: number;
  rating: number;
  cover: string;
}

interface HighlightCard {
  title: string;
  description: string;
  icon: IconComponent;
}

interface StatBlock {
  label: string;
  value: string;
}

interface SimpleModernHomePageProps {
  onCreateGame: () => void;
  onShowViralGames: () => void;
  onPlayGame: (gameId: string) => void;
  onViewGameDetail: (gameId: string) => void;
}

const featuredGames: FeaturedGame[] = [
  {
    id: 'neon-velocity',
    title: 'Neon Velocity',
    summary: 'Sprint across gravity-shifting skylines that react to every prompt you remix.',
    genre: 'Arcade Racer',
    playCount: 18420,
    rating: 4.8,
    cover:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=960&q=80'
  },
  {
    id: 'echo-chambers',
    title: 'Echo Chambers',
    summary: 'Solve reflective puzzles while the soundtrack, art, and narration adapt in real time.',
    genre: 'Puzzle Adventure',
    playCount: 11240,
    rating: 4.7,
    cover:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=960&q=80'
  },
  {
    id: 'orbital-outlaws',
    title: 'Orbital Outlaws',
    summary: 'Squad up for heists on fractured moons with AI-driven rivalry systems.',
    genre: 'Co-op Action',
    playCount: 15880,
    rating: 4.9,
    cover:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&q=80'
  }
];

const quickStartSteps: HighlightCard[] = [
  {
    title: 'Describe the vibe',
    description: 'Drop a sentence, upload a sketch, or remix an existing room to set the tone.',
    icon: Sparkles
  },
  {
    title: 'MiniRo builds the loop',
    description: 'We stitch mechanics, art, voice, and music into a playable build in under a minute.',
    icon: Wand2
  },
  {
    title: 'Play with the squad',
    description: 'Share a link, jump into the lobby, and iterate live with friends or your community.',
    icon: Users
  }
];

const communityHighlights: HighlightCard[] = [
  {
    title: 'Remix everything',
    description: 'Fork any viral room, keep the bits you love, and ship your own flavor in seconds.',
    icon: Layers3
  },
  {
    title: 'Always multiplayer-ready',
    description: 'Voice chat, shared inventories, and party management come standard with every build.',
    icon: Users
  },
  {
    title: 'Momentum analytics',
    description: 'Understand why players stay. Heatmaps, retention curves, and feedback loops are built in.',
    icon: Compass
  }
];

const statShowcase: StatBlock[] = [
  { label: 'Playable ideas launched', value: '12K+' },
  { label: 'Avg build time', value: '38s' },
  { label: 'Community remixes', value: '47K+' },
  { label: 'Players return next week', value: '92%' }
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const SimpleModernHomePage: React.FC<SimpleModernHomePageProps> = ({
  onCreateGame,
  onShowViralGames,
  onPlayGame,
  onViewGameDetail
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-900/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/80">MiniRo</p>
              <p className="text-sm text-slate-400">Playable AI playground</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a className="transition-colors hover:text-white" href="#discover">Discover</a>
            <a className="transition-colors hover:text-white" href="#how-it-works">How it works</a>
            <a className="transition-colors hover:text-white" href="#community">Community</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden items-center gap-2 text-slate-300 hover:text-white md:flex"
              onClick={onShowViralGames}
            >
              Explore rooms
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="gradient"
              size="sm"
              className="hidden md:inline-flex"
              onClick={onCreateGame}
            >
              Launch builder
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="relative overflow-hidden border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-16 px-6 py-24 text-center">
            <div className="relative flex w-full max-w-3xl flex-col items-center space-y-10">
              <motion.div {...fadeUp} className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                <Sparkles className="h-3.5 w-3.5" />
                Built with AI in the loop
              </motion.div>
              <motion.div {...fadeUp} className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Ship a playable concept before your coffee gets cold.
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-300">
                  MiniRo spins stories, systems, and art into living prototypes. Describe the vibe once, press build, and invite the world to try it instantly.
                </p>
              </motion.div>
              <motion.div {...fadeUp} className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="gradient"
                  size="xl"
                  className="flex items-center gap-2"
                  onClick={onCreateGame}
                >
                  <Sparkles className="h-5 w-5" />
                  Create a game
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="flex items-center gap-2 border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800"
                  onClick={onShowViralGames}
                >
                  Watch viral rooms
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div {...fadeUp} className="grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
                {statShowcase.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 text-center shadow-lg shadow-blue-500/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              {...fadeUp}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/60 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-600/20" />
              <div className="relative flex h-full flex-col gap-6 p-8 text-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                    <Flame className="h-3.5 w-3.5" />
                    Live build preview
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold text-white">Prompt: “Gravity-shifting skyline runner”</h3>
                  <p className="mt-3 text-sm text-slate-300">
                    Procedural levels, reactive music, and a party lobby were assembled in 42 seconds. Re-roll any piece without touching code.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm text-slate-300 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Loop health</p>
                    <p className="mt-2 text-xl font-semibold text-white">98%</p>
                    <p className="mt-1 text-xs text-slate-500">AI tuned enemy pacing and rewards.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Session length</p>
                    <p className="mt-2 text-xl font-semibold text-white">12m 04s</p>
                    <p className="mt-1 text-xs text-slate-500">Players keep revisiting their remixes.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Why it sticks</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />Dynamic routes adapt to party skill.</li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />Voice-over, soundtrack, and art direction remix instantly.</li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />Drop a link, collect feedback, iterate again.</li>
                  </ul>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="mt-auto w-full"
                  onClick={onCreateGame}
                >
                  Spin up something like this
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="discover" className="border-b border-slate-900 bg-slate-950">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <motion.div {...fadeUp} className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-center lg:gap-12">
              <div className="mx-auto max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">Discover</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Featured rooms trending this week</h2>
                <p className="mt-2 text-base text-slate-300">
                  These rooms were designed entirely in MiniRo. Fork them, remix the loops, or drop straight into a play session.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="inline-flex items-center gap-2 text-slate-300 hover:text-white" onClick={onShowViralGames}>
                See more rooms
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {featuredGames.map((game) => (
                <motion.article
                  key={game.id}
                  {...fadeUp}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-900/80 bg-slate-900/60 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-blue-500/10"
                >
                  <div className="relative h-48 w-full overflow-hidden border-b border-slate-900/60">
                    <img
                      src={game.cover}
                      alt={game.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">{game.genre}</p>
                      <h3 className="text-2xl font-semibold text-white">{game.title}</h3>
                      <p className="text-sm text-slate-300">{game.summary}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-sm text-slate-400">
                      <span>{formatNumber(game.playCount)} plays</span>
                      <span className="inline-flex items-center gap-1 text-amber-300">
                        <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                        {game.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                      <Button
                        variant="gradient"
                        size="sm"
                        className="flex-1"
                        onClick={() => onPlayGame(game.id)}
                      >
                        Jump in now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-800 bg-slate-900/60 text-white hover:bg-slate-800"
                        onClick={() => onViewGameDetail(game.id)}
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-slate-900 bg-slate-950">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">From prompt to play in three steps</h2>
              <p className="mt-4 text-base text-slate-300">
                MiniRo handles systems design, art direction, audio, and deployment so teams can focus on the creative spark.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {quickStartSteps.map(({ title, description, icon: Icon }, index) => (
                <motion.div
                  key={title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 * index }}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-900/80 bg-slate-900/60 p-8 text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-6 text-slate-300">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="community" className="border-b border-slate-900 bg-slate-950">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <motion.div {...fadeUp} className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-center lg:gap-12">
              <div className="mx-auto max-w-2xl space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">Community</p>
                <h2 className="text-3xl font-semibold text-white">Built for teams, streamers, and playtest labs</h2>
                <p className="text-base text-slate-300">
                  A single MiniRo room can power your next game jam, a creator collab, or an ongoing live service experiment. Invite collaborators and keep iterating together.
                </p>
              </div>
              <Button variant="gradient" size="lg" onClick={onShowViralGames} className="inline-flex items-center gap-2">
                Browse public rooms
              </Button>
            </motion.div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {communityHighlights.map(({ title, description, icon: Icon }) => (
                <motion.div
                  key={title}
                  {...fadeUp}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-slate-900/80 bg-slate-900/60 p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="text-sm leading-6 text-slate-300">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <motion.div
              {...fadeUp}
              className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/80 p-10 text-center"
            >
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Ready to launch your next idea tonight?
              </h2>
              <p className="mx-auto max-w-2xl text-base text-slate-300">
                Join the teams using MiniRo for rapid prototyping, pitch decks with playable demos, and seasonal live events.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="gradient" size="lg" onClick={onCreateGame} className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Start building
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800"
                  onClick={onShowViralGames}
                >
                  View community rooms
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SimpleModernHomePage;
