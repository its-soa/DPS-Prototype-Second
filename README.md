# Pathwise

**One place. One sequence. Fewer interruptions.**

A calm, accessibility-first guided learning prototype for blind and visually impaired Medical Tactile Examiner (MTE) trainees at Discovering Hands. Built for a launch-summit demo.

React + TypeScript + Vite + Tailwind CSS, React Router, Framer Motion (subtle motion only, respects reduced-motion), lucide-react. No backend: all data is local mock data and progress is stored in `localStorage`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

## Demo flow

The demo learner is **Lena Hoffmann**, seeded 47 seconds into *Audio Module 2* of *Foundations of Breast Anatomy*.

1. Dashboard → **Resume learning** (announced, focus lands on the module heading)
2. Audio player: play/pause, skip ±10s, speed, seek, **Open transcript**
3. **Mark as complete** → next module unlocks (announced) → reading module → quiz unlocks
4. Quiz: multiple choice with instant feedback, written answers with **Hear my answer**, review, submit
5. Results with MCQ score and "Awaiting trainer feedback", next course unlocked

Footer controls: **Show announcements on screen** (mirrors the live-region text for sighted audiences), **Reset demo**, **Clear all progress**.

## Accessibility notes

- Semantic landmarks, one `h1` per page, skip link, visible 3px focus ring, 48px+ hit targets
- Focus moves to the page `h1` on every route change; quiz steps focus their heading
- Persistent polite and assertive `aria-live` regions for resume, unlock, audio, quiz feedback and results
- Native radios, range, select and buttons everywhere; status is always text plus icon, never colour alone
- Atkinson Hyperlegible font bundled locally

Audio is simulated (no MP3 files). Test with a real screen reader (NVDA/VoiceOver) before the summit.

## Structure

```
src/data/        mock learner, courses, modules, quizzes
src/state/       progress store (localStorage), live-region announcer
src/lib/         derived status/unlock logic, grading, formatting
src/components/  shell, resume card, course card, module list, audio player, transcript, quiz parts
src/pages/       dashboard, courses, course overview, module, quiz, progress, results
```
