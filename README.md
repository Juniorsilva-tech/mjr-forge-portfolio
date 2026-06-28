# MJR Forge

**Portfólio Front-end React para apresentar projetos, stack e identidade profissional.**

O MJR Forge é meu portfólio principal como desenvolvedor Front-end React. Ele foi criado para reunir meus projetos, mostrar minha evolução técnica e apresentar interfaces com foco em responsividade, motion design, performance visual e clareza de produto.

> Objetivo: servir como vitrine para candidaturas de **Front-end React Júnior** e **Estágio em Desenvolvimento/Tecnologia**.

![MJR Forge Hero](public/Screenshot/hero%20forge%20.png)

---

## Links

- **Deploy:** https://mjr-forge-portfolio.vercel.app
- **Repositório:** https://github.com/Juniorsilva-tech/mjr-forge-portfolio
- **GitHub pessoal:** https://github.com/Juniorsilva-tech

---

## Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Lenis
- JavaScript
- Vercel

---

## O que o projeto demonstra

- Criação de portfólio profissional com React
- Layout responsivo para desktop e mobile
- Seções para apresentação, projetos, stack e contato
- Motion design aplicado com moderação
- Organização visual para destacar projetos reais
- Cuidado com contraste, espaçamento, hierarquia e leitura
- Performance adaptativa para reduzir efeitos em dispositivos mais fracos

---

## Projetos apresentados

### RetailFlow Dashboard

Dashboard SaaS demo para gestão comercial, clientes, pedidos, pagamentos e relatórios. O foco é demonstrar CRUD, filtros, tabelas, métricas e visualização de dados em React.

![RetailFlow Dashboard](public/Screenshot/retailflow-dashboard-01.png)
![RetailFlow Clientes](public/Screenshot/retailflow-Clientes.png)

### BarberFlow

Sistema web para barbearias com landing page comercial e dashboard administrativo. O foco é demonstrar Next.js, TypeScript, componentes, formulários e estrutura próxima de produto real.

### Princessmel Boutique

Landing page editorial para loja de moda cristã, com foco em apresentação visual, responsividade e conversão via WhatsApp.

### Jarvis AI Assist

Projeto experimental de automação e IA aplicada ao fluxo de desenvolvimento, usado como laboratório para produtividade, documentação e validação de interfaces.

---

## Performance visual

O projeto inclui um sistema de performance com perfis:

- `Auto`
- `Low`
- `Medium`
- `High`

Esse sistema controla camadas visuais, motion e efeitos para preservar a experiência em diferentes dispositivos.

Também considera:

- `prefers-reduced-motion`
- redução de efeitos em mobile
- controle de FPS sem `setState` por frame
- interface mais leve em dispositivos fracos

---

## Estrutura do projeto

```txt
mjr-forge-portfolio/
  public/
    Screenshot/       imagens reais dos projetos
    retailflow/       assets do RetailFlow
  src/
    components/       componentes visuais e seções
    components/cinematic/
    lib/              performance e hooks de experiência
    App.jsx
    index.css
    premium-polish.css
    scene-transitions.css
```

---

## Como rodar localmente

```bash
git clone https://github.com/Juniorsilva-tech/mjr-forge-portfolio.git
cd mjr-forge-portfolio
npm install
npm run dev
```

Acesse:

```txt
http://localhost:5173
```

Build de produção:

```bash
npm run build
npm run preview
```

---

## Status atual

- Portfólio publicado na Vercel
- Projetos principais apresentados
- Screenshots reais incluídos
- Responsividade e motion aplicados
- Sistema de performance visual implementado

---

## Roadmap

- Adicionar estudos de caso mais objetivos para cada projeto
- Incluir métricas de Lighthouse/performance
- Adicionar seção de currículo e contato mais direta
- Melhorar acessibilidade dos efeitos visuais
- Atualizar projetos conforme novas features forem entregues

---

## Autor

**Maurício da Conceição Silva Júnior**  
Front-end React Júnior | Estudante de ADS

- GitHub: https://github.com/Juniorsilva-tech
- Portfólio: https://mjr-forge-portfolio.vercel.app
- Email: mauriciojr07052006@gmail.com
