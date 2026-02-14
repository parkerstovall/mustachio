# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mustachio is a Mario-inspired browser platformer game engine published as an npm package (`mustachio-game`). It's built with TypeScript, Phaser 3, and Vite, outputting ES modules. The package exports a `startMustachio` function that consumers call to run the game.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript check + Vite build (outputs to `dist/`)
- `npm run lint` — ESLint with auto-fix
- `npm run preview` — Preview the built package
- `npm run patch` — Bump patch version (no git tag)

There is no test framework configured.

## Architecture

**Engine:** Phaser 3 with Arcade Physics. Phaser is both a dependency and peer dependency, externalized in the Vite build so consumers install it themselves.

**Three parallel scenes:**
- `GameScene` (`src/scenes/GameScene.ts`) — Main gameplay: physics groups, collision setup, input handling, level loading, procedural texture generation
- `BackgroundScene` (`src/scenes/BackgroundScene.ts`) — Sky background with drifting cloud graphics
- `UIScene` (`src/scenes/UIScene.ts`) — Score/timer text, listens to GameScene events (`addScore`, `playerDead`, `win`, `restart`)

**Game objects** (`src/objects/`):
- `player/Mustachio.ts` — Extends `Phaser.Physics.Arcade.Sprite`. Double jump, power-up states (big/fire), crouch, warp pipe entry, death/win animations
- `enemies/` — `Enemy` base class + `StacheStalker`, `StacheSeed`, `StacheShot`, `StacheStreaker`, `StacheSlinger`
- `blocks/` — `Wall`, `Brick`, `ItemBlock`, `FallingFloor`, `CaveWall`, `StacheCannon`, `FireBarBlock`, `FireCrossBlock`
- `items/` — `Coin`, `Stacheroom`, `FireStache`
- `projectiles/` — `StacheBall`, `BrickDebris`, `FireBall`, `Laser`, `FireBar` (Graphics-based with manual rotation hit detection), `FireCross`
- `set-pieces/` — `Floor` (TileSprite), `Pipe`, `WarpPipe`, `Flag`

**Physics groups** (defined in GameScene):
- `platforms` (staticGroup) — floors, walls, pipes, cannons
- `breakables` (staticGroup) — bricks, item blocks, falling floors
- `enemies` (group) — all stompable enemies
- `items` (group) — collectible items
- `playerProjectiles` (group) — stache balls
- `enemyProjectiles` (group) — fireballs, lasers, fire crosses

**Level system:** Levels are functions accepting `(scene: GameScene, previousLevels?: string[])`. They create Phaser objects directly via the scene. Level definitions live in `src/levels/`. Helper functions in `level-helpers.ts` build common block structures.

**Constants:** `src/constants.ts` — `BLOCK_SIZE = 60`, physics tuning (velocities in px/sec), game dimensions (1920x1080).

**Configuration:** `src/config.ts` — Phaser GameConfig with `Phaser.Scale.FIT`, Arcade physics, gravity 1875 px/sec².

## CI/CD

- **PR to main:** Runs `npm ci && npm run lint && npm run build` (`.github/workflows/pr.yaml`)
- **Push to main:** Auto-publishes to npm and updates the dependent pac-man repo (`.github/workflows/push.yaml`)

## Build Configuration

- Vite library mode, ES format only, entry at `src/index.ts`
- `rollupOptions.external: ["phaser"]` — Phaser is externalized
- `vite-plugin-dts` generates `.d.ts` type declarations
- Only `dist/` is published to npm
- ESLint 9 flat config with TypeScript and Prettier integration
