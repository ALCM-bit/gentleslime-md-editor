# Preparar a máquina

## 1. Ferramentas comuns (todos os sistemas)

- Git
- Node.js 22 LTS (https://nodejs.org)
- pnpm: `corepack enable` e depois `corepack prepare pnpm@latest --activate`
- Rust: https://rustup.rs
- Angular CLI: `pnpm add -g @angular/cli`
- Claude Code (opcional): `npm install -g @anthropic-ai/claude-code`

## 2. Pré-requisitos do Tauri por sistema

- **Windows:** Microsoft C++ Build Tools ("Desenvolvimento para desktop com C++") e WebView2 (já vem no Windows 10/11).
- **macOS:** `xcode-select --install`
- **Linux (Debian/Ubuntu):**
  `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`

Guia oficial: https://v2.tauri.app/start/prerequisites/

## 3. Mobile (só quando chegar na fase 2)

- **Android:** Android Studio, SDK, NDK e a variável `ANDROID_HOME`; `rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android`
- **iOS (só em macOS):** Xcode completo; `rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim`

## 4. Conferir

```bash
node -v && pnpm -v && rustc -V && cargo -V && ng version
```

## 5. Criar o app (fase 0)

```bash
git init
pnpm create tauri-app apps/native --template angular --manager pnpm
cd apps/native && pnpm install && pnpm tauri dev
```

Se a janela do app abrir, o ambiente está pronto. Depois disso, siga o "Passo a passo" de `docs/spec.md`.
