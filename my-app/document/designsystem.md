// DSP FULL UI (Awwwards + Apple Style)
// Stack: Next.js + Tailwind + Framer Motion

import { motion } from "framer-motion";
import { useState } from "react";

export default function DSPPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white px-6 py-10">
      {/* HERO */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-semibold mb-6"
        >
          Translate & Convert Subtitles Instantly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 mb-8"
        >
          Extract, translate, and convert subtitles into speech.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL..."
            className="flex-1 bg-[#111113] border border-[#1F1F23] rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
          />
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] transition">
            Extract
          </button>
        </motion.div>
      </section>

      {/* WORKSPACE */}
      <section className="max-w-6xl mx-auto grid grid-cols-2 gap-6">
        {/* ORIGINAL */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#111113] border border-[#1F1F23] rounded-2xl p-6"
        >
          <h3 className="mb-4 text-lg text-zinc-400">Original</h3>
          <div className="space-y-3 text-sm text-zinc-300">
            <p>[00:01] Hello world</p>
            <p>[00:03] Welcome to DSP</p>
          </div>
        </motion.div>

        {/* TRANSLATED */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#111113] border border-[#1F1F23] rounded-2xl p-6"
        >
          <h3 className="mb-4 text-lg text-zinc-400">Translated</h3>
          <div className="space-y-3 text-sm text-zinc-300">
            <p>[00:01] សួស្តីពិភពលោក</p>
            <p>[00:03] សូមស្វាគមន៍មក DSP</p>
          </div>
        </motion.div>
      </section>

      {/* ACTION BAR */}
      <section className="max-w-6xl mx-auto mt-10 flex justify-between items-center">
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-xl border border-[#1F1F23] hover:bg-[#1A1A1D]">
            Translate
          </button>
          <button className="px-5 py-2 rounded-xl border border-[#1F1F23] hover:bg-[#1A1A1D]">
            Download SRT
          </button>
          <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
            Generate TTS
          </button>
        </div>
      </section>
    </div>
  );
}

// ===============================
// COMPONENT LIBRARY (REUSABLE)
// ===============================

export function Button({ children }) {
  return (
    <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] transition">
      {children}
    </button>
  );
}

export function Card({ children }) {
  return (
    <div className="bg-[#111113] border border-[#1F1F23] rounded-2xl p-6">
      {children}
    </div>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className="bg-[#111113] border border-[#1F1F23] rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
    />
  );
}

// ===============================
// ANIMATION SYSTEM
// ===============================

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export const hoverLift = {
  whileHover: { y: -4, scale: 1.01 }
};

// ===============================
// FIGMA STRUCTURE (REFERENCE)
// ===============================

/*
Frame: Desktop (1440px)

Sections:
1. Hero
   - Title
   - Subtitle
   - Input + CTA

2. Workspace
   - Grid (2 columns)
     - Original Card
     - Translated Card

3. Action Bar
   - Buttons (Translate, SRT, TTS)

Spacing System:
- 24px base
- 48px section spacing

Design Tokens:
- Radius: 12 / 16 / 24
- Colors: dark-first
- Typography: Inter
*/