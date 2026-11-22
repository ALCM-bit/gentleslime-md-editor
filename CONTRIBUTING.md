# Como contribuir

Obrigado pelo interesse no GentleSlime! Este guia mostra o caminho de uma contribuição, da ideia ao merge.

## Antes de começar

- Leia a [spec do produto](docs/spec.md). Ela é a fonte de verdade sobre o que o app faz e por quê.
- Leia o [`AGENTS.md`](AGENTS.md). Apesar do nome, ele vale para pessoas também: tem as regras invioláveis, a estrutura do repositório e as convenções de código.
- Para mudanças grandes, abra uma issue antes e combine a abordagem. Assim ninguém perde trabalho.
- Algumas coisas estão fora de escopo por decisão do projeto: versão web, colaboração em tempo real, servidor ou conta própria, editor de blocos que troque o Markdown por outro modelo e telemetria ligada por padrão.

## Preparar a máquina

Siga o [`SETUP.md`](SETUP.md). As versões de Node, pnpm, Rust e de todas as dependências são fixadas pelo repositório; instale só os gerenciadores.

## Fluxo de trabalho

1. Crie uma branch a partir da `main` atualizada, no formato `<tipo>/<descricao-curta>`, em inglês e kebab-case: `feat/live-emphasis`, `fix/atomic-write-rename`.
2. Faça commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/): `feat:`, `fix:`, `perf:`, `refactor:`, `test:`, `docs:`, `chore:`, `ci:`, `build:`. O escopo é opcional e usa o nome do pacote: `feat(editor): ...`.
3. Mantenha a branch atualizada com `git rebase main`, sem merge da `main` para dentro dela.
4. Antes de abrir o PR, rode e confira que passam:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   ```

5. Abra o PR com um título que também siga Conventional Commits: ele vira a mensagem do commit final, porque o merge é feito por squash.
6. O PR só entra com o CI verde.

Uma branch, um assunto, um PR. PRs pequenos são revisados mais rápido; não misture refatoração com funcionalidade.

## O que todo PR precisa respeitar

- **O arquivo é a verdade.** O app nunca reescreve trechos que o usuário não editou. Código que grava arquivo precisa de teste de ida e volta byte a byte.
- **Testes.** Funções novas em `packages/core` têm teste unitário; bugs corrigidos ganham teste de regressão; cada elemento do editor ao vivo tem testes de foco e de desfazer/refazer.
- **Interface.** Textos sempre por i18n (pt-BR e en), cores só por tokens CSS e acessibilidade WCAG 2.1 AA.
- **Performance.** Se a mudança pode afetar as metas de performance, informe os números no PR.

## Dependências

- Toda dependência tem versão exata, sem `^` nem `~`. Os lockfiles são versionados.
- Dependência nova precisa de justificativa no PR: tamanho, manutenção e licença compatível com MIT.
- Atualizar versões é um PR próprio (`build(deps): ...`). Não rode `pnpm update` nem `cargo update` de passagem.

## Idioma

- Código, identificadores, commits, comentários e títulos de PR em **inglês**.
- Documentação de usuário em pt-BR e en.

## Agentes de código

Contribuições feitas com a ajuda de agentes (Claude Code, Codex, Copilot etc.) são bem-vindas e seguem as mesmas regras. O `AGENTS.md` existe para que esses agentes conheçam as decisões do projeto. Você continua responsável por revisar e entender tudo o que enviar.

## Licença

Ao contribuir, você concorda que sua contribuição seja licenciada sob a [licença MIT](LICENSE) do projeto.
