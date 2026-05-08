# MJR Forge

Portfólio de Maurício Junior com direção cinematográfica contida, foco em React, UI premium, dashboards e experiências digitais modernas.

## Posicionamento

Creative Front-end Developer focado em React, UI premium, dashboards e experiências digitais modernas.

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

## Visão

O Forge não foi desenhado como portfólio comum. A proposta é apresentar repertório de front-end, leitura de produto, direção visual e capacidade de construir interfaces com identidade própria sem sacrificar clareza ou performance.

O site foi pensado para comunicar:

- posicionamento profissional em Front-end React;
- domínio de UI premium, dashboards e landing pages;
- cuidado com legibilidade, responsividade e acabamento;
- uso de atmosfera e motion como suporte, não como ruído.

## Estrutura

```txt
mjr-forge-portfolio/
|-- index.html
|-- public/
|   |-- favicon.svg
|   |-- forge-portrait.jpg
|   `-- retailflow/
`-- src/
    |-- App.jsx
    |-- index.css
    |-- premium-polish.css
    |-- scene-transitions.css
    |-- lib/
    |   |-- performance.js
    |   `-- useSpatialJourney.js
    `-- components/
        |-- BrandMark.jsx
        |-- GravityCursor.jsx
        |-- PerformanceModeToggle.jsx
        |-- ProjectMockup.jsx
        |-- SpatialSection.jsx
        `-- cinematic/
```

## Performance

- Perfis `Auto`, `Low`, `Medium` e `High`.
- Detector de FPS sem `setState` por frame.
- Respeito a `prefers-reduced-motion`.
- Redução de câmera e profundidade em mobile.
- Sem bibliotecas extras para galeria ou spatial system.

## Projetos destacados

### RetailFlow Dashboard

Dashboard SaaS demo com screenshots reais, foco em operação, clientes, pedidos, financeiro e relatórios.

### Princessmel

Landing page editorial para loja de moda cristã, com foco em curadoria, atmosfera e conversão via WhatsApp.

### Jarvis Workflow

Workflow privado de apoio a QA visual, organização de interface e aceleração de entrega.

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
