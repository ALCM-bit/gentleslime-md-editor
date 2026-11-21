# Preparar a máquina

As versões das ferramentas são fixadas pelo próprio repositório. Instale só os gerenciadores; eles baixam a versão certa:

| Ferramenta | Onde a versão é fixada | Quem baixa |
| --- | --- | --- |
| Node.js | `devEngines.runtime` em `package.json` (e `.nvmrc`) | pnpm, no `pnpm install` |
| pnpm | `packageManager` em `package.json` | Corepack |
| Rust | `rust-toolchain.toml` | rustup, no `rustup install` |
| Angular CLI e demais pacotes | `package.json` + `pnpm-lock.yaml` | pnpm (use `pnpm ng`, não um `ng` global) |

## 1. Ferramentas comuns (todos os sistemas)

- Git
- Node.js LTS (https://nodejs.org ou nvm), só para ter o Corepack; o projeto usa a versão fixada
- pnpm: `corepack enable`
- rustup: https://rustup.rs
- Claude Code (opcional): `npm install -g @anthropic-ai/claude-code`

## 2. Pré-requisitos do Tauri por sistema

- **Windows:** Microsoft C++ Build Tools ("Desenvolvimento para desktop com C++") e WebView2 (já vem no Windows 10/11).
- **macOS:** `xcode-select --install`
- **Linux (Debian/Ubuntu):**
  `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`
- **Linux (Arch e derivados):**
  `sudo pacman -S --needed webkit2gtk-4.1 base-devel curl wget file openssl appmenu-gtk-module libayatana-appindicator librsvg xdotool`

Guia oficial: https://v2.tauri.app/start/prerequisites/

## 3. Mobile

- **Android:** Android Studio, SDK, NDK e a variável `ANDROID_HOME`; `rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android`
- **iOS (só em macOS):** Xcode completo; `rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim`

## 4. Depois de clonar

```bash
pnpm install       # instala as dependências e o Node fixado
rustup install     # instala o toolchain do rust-toolchain.toml
pnpm exec turbo telemetry disable   # o Turborepo coleta telemetria por padrão
pnpm dev           # abre o app desktop
```

Se a janela do app abrir, o ambiente está pronto.

## 5. Conferir

```bash
pnpm exec node -v && pnpm -v && rustc -V && cargo -V && pnpm ng version
```
