# AGENTS.md — GentleSlime: Md reader and editor

Instruções para agentes de código (Claude Code, Codex, Copilot etc.) que trabalham neste repositório.
A spec completa do produto é a fonte de verdade; este arquivo resume o que um agente precisa para não quebrar as decisões já tomadas.

## O produto em uma frase

Editor de Markdown **local-first**, **open source (MIT)**, com **edição ao vivo** no estilo Obsidian: um único painel em que a marcação vira formatação enquanto se digita e reaparece só no elemento em foco. Roda em Windows, macOS, Linux, Android e iOS. **Não há versão web por enquanto.**

## Regras invioláveis

1. **O arquivo é a verdade.** O conteúdo em disco é `.md` puro. Nunca reescreva, reformate ou normalize trechos que o usuário não editou (marcadores, espaçamento, escapes, quebras de linha, front matter). Todo código que salva arquivo precisa de teste de ida e volta byte a byte.
2. **Nada de banco ou formato proprietário** para documentos. SQLite só como cache recriável (índice, recentes).
3. **Gravação atômica:** escrever em arquivo temporário e renomear por cima. Nunca escrever direto no arquivo final.
4. **O núcleo não conhece a plataforma.** `packages/core` e `packages/editor` não importam nada de Tauri, Angular ou APIs de arquivo. Todo acesso a disco passa pelo `PlatformAdapter`.
5. **Offline sempre.** Nenhuma função básica pode depender de rede. Sem telemetria, a não ser que o usuário opte por ela.
6. **HTML vindo do Markdown é sempre sanitizado** (`rehype-sanitize`). Sem `<script>`, atributos `on*` nem `javascript:`.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Shell nativo | Tauri 2 (Rust), desktop e mobile |
| UI | Angular (standalone components, signals, **zoneless**) + TypeScript |
| Editor | CodeMirror 6 + `@codemirror/lang-markdown` (parser Lezer, GFM) |
| Render (leitura e exportação) | unified: remark-parse, remark-gfm, remark-math, rehype-katex, rehype-sanitize |
| Realce de código | Lezer no editor; Shiki só no modo leitura e na exportação, carregado sob demanda |
| Diagramas e fórmulas | Mermaid e KaTeX, carregados com `@defer` e renderizados em Web Worker |
| Busca e cache | SQLite (rusqlite); busca full-text no lado Rust |
| Monorepo | pnpm workspaces + Turborepo |
| Testes | Vitest, Angular Testing Library, WebdriverIO + tauri-driver (E2E), criterion (Rust) |

## Estrutura do repositório

```text
gentleslime/
├─ apps/
│  └─ native/          # Tauri 2: src-tauri/ (Rust) + app Angular — desktop e mobile
├─ packages/
│  ├─ core/            # parser, render, workspace, wikilinks, tipos — sem DOM de plataforma
│  ├─ editor/          # extensões CodeMirror (sintaxe, atalhos, modo ao vivo)
│  ├─ ui/              # componentes Angular standalone, tokens, temas
│  └─ adapters/        # tauri-adapter.ts, memory-adapter.ts (testes)
├─ brand/              # mascote, ícones, splash
├─ e2e/                # WebdriverIO + tauri-driver
├─ LICENSE             # MIT
├─ CONTRIBUTING.md
└─ turbo.json, pnpm-workspace.yaml
```

Onde colocar código novo:
- Lógica de Markdown, wikilinks, busca, sumário → `packages/core`
- Qualquer coisa que roda dentro do CodeMirror (decorations, widgets, keymaps) → `packages/editor`
- Componentes visuais, tokens, temas → `packages/ui`
- Acesso a arquivos, diálogos, configurações do SO → `packages/adapters` + comandos Rust em `apps/native/src-tauri`

## Comandos

> Fase 0 concluída: `dev`, `tauri`, `test`, `lint` e `typecheck` existem. Ajuste esta seção quando `e2e` e `bench` forem criados.

```bash
pnpm install              # dependências
pnpm dev                  # app desktop em modo dev (tauri dev)
pnpm test                 # Vitest em todos os pacotes
pnpm lint                 # ESLint + Prettier + cargo clippy + cargo fmt --check
pnpm typecheck            # tsc --noEmit nos pacotes; ngc no app (checa templates)
pnpm e2e                  # WebdriverIO + tauri-driver (Windows e Linux) — ainda não existe
pnpm bench                # benchmarks de performance — ainda não existe
pnpm tauri android dev    # Android
pnpm tauri ios dev        # iOS (macOS + Xcode)
```

Antes de dizer que uma tarefa terminou, rode `pnpm lint`, `pnpm typecheck` e `pnpm test` e confira que passaram.

## Contrato do adaptador

```ts
interface PlatformAdapter {
  pickFolder(): Promise<string | null>;
  listDir(path: string): Promise<FileEntry[]>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>; // atômico: tmp + rename
  watch(path: string, onChange: (e: FsEvent) => void): Unsubscribe;
  getSettings(): Promise<Settings>;
  setSettings(s: Settings): Promise<void>;
}
```

Use `memory-adapter` em testes unitários; nunca toque no disco real fora dos testes E2E.

## Editor ao vivo (packages/editor)

- O documento é **sempre texto Markdown** no CodeMirror. Não converta para outro modelo (ProseMirror, TipTap, blocos).
- A formatação é desenhada por cima com um `ViewPlugin` que percorre a árvore Lezer **só nas linhas visíveis**:
  - `Decoration.mark` para estilizar;
  - `Decoration.replace` para esconder a marcação (`**`, `#`, `](url)`);
  - `WidgetType` para checkbox, imagem, fórmula, tabela e Mermaid.
- Se a seleção toca um nó, **não esconda** a marcação daquele nó: ela reaparece para edição.
- Widgets interativos alteram o texto por **transações do CodeMirror**, para que desfazer/refazer funcione.
- Widgets são **DOM puro** (`toDOM`). Use componentes Angular só para o menu "/", a barra flutuante e o editor de tabela.
- Revele só a marcação do **elemento tocado**, nunca a linha inteira, em `--syntax-muted` e sem mudar a altura da linha (o `#` do título fica na margem).
- **Tabelas no MVP:** renderizadas como grade; em foco, mostram o Markdown cru. A edição direto na grade (+linha, +coluna) é da v1.
- Widgets têm rótulo para leitor de tela (checkbox com estado, imagem com texto alternativo, fórmula com o TeX). Respeite "reduzir movimento".
- Implemente um elemento por vez, cada um com testes: ênfase e títulos → listas e tarefas → links e imagens → código → tabelas → fórmulas.
- **Wikilinks são suportados por padrão:** `[[nota]]` e `[[nota|texto]]`, com autocompletar ao digitar `[[`, backlinks e atualização dos links ao renomear um arquivo.

## Convenções de Angular

- Somente **standalone components**. Nada de `NgModule`.
- App **zoneless** (`provideZonelessChangeDetection()`). Estado com **signals** e `computed()`; nada de zone.js.
- `ChangeDetectionStrategy.OnPush` em todos os componentes.
- Novo control flow (`@if`, `@for` com `track`, `@switch`) e `@defer` para o que é pesado ou pouco usado.
- Use `inject()` em vez de injeção pelo construtor.
- O CodeMirror é criado **uma vez**, em `afterNextRender()`. O texto do documento **nunca** vira signal a cada tecla; só metadados (linha, coluna, contagem de palavras), com debounce.
- Listas longas (árvore de arquivos, resultados de busca) com `cdk-virtual-scroll-viewport`.
- Textos de interface sempre por i18n (pt-BR e en). Nada de string fixa no template.

## Metas de performance (verificadas no CI)

| Métrica | Meta |
| --- | --- |
| Abrir o app a frio (desktop) | < 1,5 s |
| Abrir arquivo de 1 MB | < 300 ms até o texto aparecer |
| Latência de digitação | < 16 ms por tecla |
| Abrir pasta com 1.000 arquivos `.md` | árvore em < 1 s |
| Instalador desktop | < 15 MB |
| Pacote JS inicial | dentro dos budgets do `angular.json` |

Se uma mudança pode afetar essas metas, rode `pnpm bench` e informe os números.

## Design

- Cores só por tokens CSS (`--bg`, `--surface`, `--text`, `--text-muted`, `--syntax-muted`, `--accent`, `--accent-soft`, `--hover`, `--focus-ring`, `--border`, `--code-bg`, `--danger`, `--warning`, `--success`), com versões clara e escura. Nada de cor fixa em componente.
- Espaçamento em múltiplos de 4 px; raios de 6 px (controles) e 8 px (cartões); foco visível com anel de 2 px em `--focus-ring`.
- Tipografia: fonte do sistema na interface (não empacotada); Source Serif 4 ou Literata no texto do documento (modos ao vivo e leitura); JetBrains Mono só em código e no modo código-fonte. Empacote apenas essas duas, em WOFF2 variável.
- Atalhos seguem o Obsidian: Ctrl+P paleta de comandos, Ctrl+O abrir arquivo, Ctrl+K inserir link, Ctrl+E alternar modo, Alt+←/→ voltar/avançar entre notas.
- Salvamento: nenhum indicador quando está salvo; um ponto no nome do arquivo quando há mudança pendente; aviso só em erro. Falha ao salvar nunca descarta o texto.
- Celular: barra rolável sobre o teclado (desfazer, refazer, formatação, `[[`); sem barra flutuante de seleção; troca de modo no menu ⋯.
- Toda tela nova precisa dos estados vazio, carregando e erro definidos na spec ("Estados e telas de apoio").
- Acessibilidade WCAG 2.1 AA: contraste 4,5:1, tudo alcançável por teclado, alvos de toque de no mínimo 44 × 44 px.
- Mascote: **Gentle Slime** (slime azul de cartola com #, monóculo, bigode fino e gravata-borboleta dourada). Arte em `brand/`. O dourado só aparece na marca, nunca em controles.

## Segurança (Tauri)

- Capabilities restritas à pasta do workspace aberta. Não amplie permissões de `fs` sem necessidade explícita.
- CSP estrita. Sem acesso à rede por padrão; imagens remotas bloqueadas no modo leitura até o usuário liberar.
- Nunca use `innerHTML` com conteúdo não sanitizado.

## Testes

- Toda função de `core` tem teste unitário. Parser e render: testes de snapshot com a suíte de exemplos do CommonMark/GFM.
- Todo código que grava arquivo: teste de ida e volta (abrir → editar um trecho → salvar → só aquele trecho mudou).
- Cada elemento do editor ao vivo: testes de foco (marcação aparece e some) e de desfazer/refazer.
- Bugs corrigidos ganham um teste de regressão.

## Git e contribuição

- Código, identificadores, commits e comentários em **inglês** (projeto open source). Documentação de usuário em pt-BR e en.
- Commits no padrão **Conventional Commits** (`feat:`, `fix:`, `perf:`, `refactor:`, `test:`, `docs:`, `chore:`).
- PRs pequenos e focados. Não misture refatoração com funcionalidade.
- Não adicione dependências novas sem justificar no PR (tamanho, manutenção, licença compatível com MIT).

## Fora de escopo — não implemente sem pedido explícito

- Versão web/PWA
- Colaboração em tempo real
- Servidor ou conta própria
- Editor de blocos que troque o Markdown por outro modelo
- Telemetria ativada por padrão
