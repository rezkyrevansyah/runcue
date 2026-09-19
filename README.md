# RunCue

<p align="center">
  <img src="public/images/Portfolio Cover - RunCue.png" alt="RunCue project cover" width="1200" />
</p>

<p align="center">
  <a href="https://github.com/rezkyrevansyah/runcue">
    <img src="https://img.shields.io/github/stars/rezkyrevansyah/runcue?style=for-the-badge&logo=github" alt="GitHub Repo stars" />
  </a>
  <a href="https://github.com/rezkyrevansyah/runcue/issues">
    <img src="https://img.shields.io/github/issues/rezkyrevansyah/runcue?style=for-the-badge" alt="GitHub issues" />
  </a>
  <a href="https://github.com/rezkyrevansyah/runcue/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/rezkyrevansyah/runcue?style=for-the-badge" alt="License" />
  </a>
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  </a>
</p>

<p align="center">
  <strong>Run smarter. Train without staring at the clock.</strong>
</p>

RunCue is a mobile-first web app for building custom interval workouts. You can set warm-up, run, walk, cooldown, and repeat phases without constantly checking the time. During the session, the app gives automatic voice cues so you can stay focused on your rhythm and breathing.

## Why RunCue?

- Zero distraction training: no need to keep looking at your screen
- Fast workout creation: simple workflow for custom interval sessions
- Automatic voice cues: verbal guidance for each phase transition
- Mobile-first experience: designed for running and walking on phone screens
- Local-first approach: no sign-up required and your data stays on your device
- Flexible for different levels: great for beginners and more advanced interval routines

## Key features

- Create and edit custom interval workouts
- Configure sequences like warm-up, run, walk, rest, and cooldown
- Support repeat groups for run/walk cycle patterns
- Save multiple presets in localStorage
- Test audio and volume before starting a session
- Workout player with timer, phase status, remaining time, and quick controls
- Responsive UI for comfortable mobile usage
- Suitable for easy jogging, running, and light interval training

## Demo flow

A simple usage flow looks like this:

1. Create a new workout
2. Set the step order and durations
3. Save your preset
4. Test voice and sound
5. Start the session
6. Stay in motion without watching the clock

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- LocalStorage for local data persistence

## Installation

Clone the repository:

```bash
git clone https://github.com/rezkyrevansyah/runcue.git
cd runcue
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Run the app

```bash
npm run dev
```

For production build:

```bash
npm run build
npm run start
```

## Project structure

```text
.
├── public/
│   └── logo/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── ...
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── LICENSE
└── CONTRIBUTING.md
```

## Roadmap

- [ ] Improve audio reliability on mobile devices
- [ ] Add richer workout modes
- [ ] Add export/import for presets
- [ ] Improve onboarding and UX flow
- [ ] Add better dark/light theme support
- [ ] Strengthen interactions for advanced runners

## Contributing

Contributions are welcome. If you want to help:

1. Fork this repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to GitHub: `git push origin feature/your-feature-name`
5. Open a pull request

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution guide.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Tips to get more GitHub stars

If you want this project to attract more stars, focus on the following:

- Write a clear README that explains the real value immediately
- Show a short demo or screen recording of the workflow
- Use strong visuals like logos, banners, screenshots, mockups, or GIFs
- Keep the repository looking active with regular commits and issue updates
- Highlight the unique value proposition: this is not just a template, it solves a real problem
- Share it in communities such as r/nextjs, r/webdev, r/fitness, and local developer groups
- Add badges, install instructions, roadmap, and contribution guide

## Status

RunCue is still in active development as a mobile-first web app for interval training. It is a strong project for portfolio work, feature experiments, and product ideas that can continue to evolve.

<p align="center">
  <a href="https://github.com/rezkyrevansyah/runcue">
    <img src="https://img.shields.io/github/stars/rezkyrevansyah/runcue?style=social" alt="Star this project" />
  </a>
</p>
