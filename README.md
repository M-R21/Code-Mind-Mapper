# Cortex 🧠

**Cortex** is a high-performance codebase analysis engine and interactive mapping tool. It helps developers understand complex architectures, visualize dependencies, and navigate large-scale projects with ease.

![Banner](https://raw.githubusercontent.com/placeholder-repo/cortex/main/assets/banner.png)

## ✨ Features

- **Codebase Mapping**: Visualizes the structure and relationships within your project.
- **Analysis Engine**: Fast backend built with FastAPI and specialized plugins.
- **Desktop Experience**: Native desktop application for a seamless workflow.
- **Plugin System**: Extendable architecture with support for Universal and Django-specific analysis.
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS.

## 🏗️ Architecture

Cortex is organized as a monorepo:

- `apps/desktop`: The frontend desktop application (Electron + Vite + React).
- `engine/`: The analysis core (Python + FastAPI).

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 20
- **pnpm**: >= 9
- **Python**: >= 3.10

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/cortex.git
   cd cortex
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up the Analysis Engine**:
   ```bash
   cd engine
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running in Development

1. **Start the Engine**:
   ```bash
   cd engine
   python main.py
   ```

2. **Start the Desktop App**:
   ```bash
   # From the root directory
   pnpm dev
   ```

## 🧪 Testing

- **Engine Tests**: `pnpm test:engine`
- **UI Tests**: `pnpm test:ui`

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ by M-R21.
