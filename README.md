<p align="center">
  <h1 align="center">Cortex (Code Mind Mapper)</h1>
  <p align="center">
    High-performance codebase analysis engine and interactive mapping tool.
    <br />
    Understand complex architectures, visualize dependencies, and navigate large-scale projects with clarity.
  </p>
</p>

<p align="center">
  <a href="#overview">Overview</a> ·
  <a href="#features">Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#development">Development</a> ·
  <a href="#testing">Testing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/pnpm-%3E%3D9-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/python-%3E%3D3.10-3776AB?logo=python&logoColor=white" alt="Python" />
</p>

---

## Overview

**Cortex** pairs a fast analysis engine with a polished desktop experience so teams can explore codebases like a map. It helps you uncover structure, surface dependencies, and navigate large projects faster—ideal for onboarding, architecture reviews, and refactors.

## Features

- **Interactive codebase mapping** to visualize modules and relationships.
- **High-performance analysis engine** built on FastAPI and extensible plugins.
- **Desktop-first workflow** with Electron + React for a fluid experience.
- **Modular architecture** supporting multiple analysis strategies.
- **Modern UI stack** powered by TypeScript, Vite, and Tailwind CSS.

## Architecture

| Layer | Path | Description |
| --- | --- | --- |
| Desktop App | `apps/desktop` | Electron + Vite + React front-end for visualization and navigation. |
| Analysis Engine | `engine/` | Python + FastAPI core for parsing and analysis. |

## Getting Started

### Prerequisites

- **Node.js** `>= 20`
- **pnpm** `>= 9`
- **Python** `>= 3.10`

### Installation

```bash
git clone https://github.com/M-R21/Code-Mind-Mapper.git
cd Code-Mind-Mapper
pnpm install
```

### Engine Setup

```bash
cd engine
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Development

Start the engine and desktop app in separate terminals:

```bash
# Terminal 1
cd engine
python main.py
```

```bash
# Terminal 2 (repo root)
pnpm dev
```

## Testing

```bash
pnpm test:engine
pnpm test:ui
```

## Contributing

We welcome contributions! Please review [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting changes.

## Security

For security disclosures, see [SECURITY.md](SECURITY.md).

## License

Licensed under the [MIT License](LICENSE).

---

Built with ❤️ by M-R21.
