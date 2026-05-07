# MJR Forge

Portfólio de Maurício Júnior com direção "Cinematic Product Portfolio": React, UI premium, dashboards e experiências digitais modernas com foco em clareza, ritmo visual e acabamento profissional.

## Links

- Deploy: https://mjr-forge-portfolio.vercel.app
- Repositório: https://github.com/Juniorsilva-tech/mjr-forge-portfolio
- GitHub pessoal: https://github.com/Juniorsilva-tech

## Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- JavaScript
- Vercel

## Visão do projeto

O MJR Forge é o portfólio principal de apresentação profissional de Maurício Júnior. A proposta não é apenas exibir telas, mas demonstrar repertório de front-end, direção visual, leitura de produto e capacidade de construir interfaces com identidade própria.

O site foi desenhado para comunicar:

- posicionamento como Creative Front-end Developer focado em React;
- domínio de UI premium, dashboards e landing pages;
- atenção a performance, responsividade e experiência;
- maturidade visual sem exagero de efeitos.

## Diferenciais visuais

- Direção cinematográfica minimalista, sem cair em estética gamer ou cyberpunk.
- Hierarquia editorial com tipografia ampla, ritmo de spacing e contraste controlado.
- Uso de luz, grão, profundidade e overlays como acabamento, não como distração.
- Mockups e screenshots reais para reforçar leitura de produto.

## Arquitetura geral

```txt
mjr-forge-portfolio/
├── index.html
├── public/
│   ├── favicon.svg
│   ├── forge-portrait.jpg
│   └── retailflow/
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── premium-polish.css
│   ├── scene-transitions.css
│   ├── lib/
│   │   └── performance.js
│   └── components/
│       ├── BrandMark.jsx
│       ├── GravityCursor.jsx
│       ├── PerformanceModeToggle.jsx
│       ├── ProjectMockup.jsx
│       └── cinematic/
```

- `App.jsx`: composição principal, conteúdo, seções e integração do modo de performance.
- `src/lib/performance.js`: perfis `auto`, `low`, `medium` e `high`.
- `ProjectMockup.jsx`: vitrine dos projetos, incluindo screenshots reais do RetailFlow.
- `index.css`, `premium-polish.css` e `scene-transitions.css`: base visual, profundidade, grão, luz e refinamentos.

## Performance

- Modo de performance com resolução automática e opção manual: `Auto`, `Low`, `Medium` e `High`.
- Controle de motion, blur, sombras, overlays, grain e camadas decorativas.
- Respeito a `prefers-reduced-motion`.
- Redução de efeitos em mobile e dispositivos mais fracos.
- Sem dependências extras para carousel ou vitrine de screenshots.

## Responsividade

- Layout pensado para desktop e mobile sem scroll artificial.
- Navegação mobile simples e leve.
- Seção de Work adaptada para grid e rail horizontal de screenshots.
- CTAs e blocos de conteúdo com leitura consistente em telas menores.

## Projetos

### RetailFlow Dashboard

Dashboard SaaS demo com screenshots reais, foco em operação, clientes, pedidos, financeiro e relatórios. A apresentação prioriza leitura de produto e percepção de sistema real.

### Princessmel

Landing page editorial para loja de moda cristã, com foco em curadoria, atmosfera e conversão via WhatsApp.

### Jarvis Workflow

Workflow privado de apoio a QA visual, organização de interface e aceleração de entrega.

## Próximos refinamentos

- Adicionar estudos de caso mais completos com problema, solução e resultado.
- Evoluir o conteúdo textual com métricas e contexto de cada projeto.
- Expandir SEO com imagem OG dedicada do portfólio.
- Refinar testes e auditorias de acessibilidade.
- Considerar versão bilíngue quando o portfólio estiver mais consolidado.

## Como rodar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
