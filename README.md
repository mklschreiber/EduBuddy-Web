# edubuddy-LandingPage
Coming-soon page for the app Eulino (codename EduBuddy), a voice-based learning companion for
children.

The Vue 3 + TypeScript + Vite site lives in [`app/`](app/) and is deployed to
GitHub Pages on every push to `main`.

## AI Workflow Setup

The shared AI workflow (agents, handbook, skills) lives in the [ai-base](https://github.com/mklschreiber/ai-base) git submodule in `.ai-base/`.
Clone with `git clone --recurse-submodules`, or run `git submodule update --init` in an existing clone.
Details: [CLAUDE.md](CLAUDE.md) and [docs/ai-project.md](docs/ai-project.md).
