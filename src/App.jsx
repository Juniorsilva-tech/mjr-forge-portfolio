import React from 'react'
import { motion } from 'framer-motion'

const email = 'mauriciojr07052006@gmail.com'
const whatsapp = 'https://wa.me/5524992625175'
const github = 'https://github.com/Juniorsilva-tech'

const stats = [
  ['85/100', 'QA score em teste real do Jarvis'],
  ['6 telas', 'screenshots de responsividade'],
  ['2ª tentativa', 'erro corrigido e aprovado'],
  ['React', 'foco principal de carreira'],
]

const signals = [
  ['Projeto real, não só estudo', 'Dashboard, landing pages, automações e sistemas criados para problemas reais.'],
  ['Mentalidade de produto', 'Penso em interface, usuário, clareza, conversão, manutenção e entrega final.'],
  ['IA com critério técnico', 'Uso IA para prototipar, testar, revisar e aumentar consistência sem esconder a base.'],
  ['Valor desde o estágio', 'Posso ajudar com React, UI, responsividade, componentes, QA visual e automações simples.'],
]

const projects = [
  ['Jarvis Coding OS', 'Workflow próprio com IA para acelerar criação, teste e refinamento de interfaces.', ['AI-assisted delivery', 'QA', 'Automation']],
  ['Sistema de loja de varejo', 'Dashboard com controle financeiro, clientes, pagamentos e interface responsiva.', ['Dashboard', 'Produto real', 'Supabase']],
  ['Landing pages e sites locais', 'Sites para pequenos negócios com visual profissional e foco em conversão.', ['Landing pages', 'UI polish', 'Conversão']],
]

function Button({ href, children, secondary }) {
  return (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={secondary ? 'rounded-full border border-cyan-200/20 bg-black/40 px-6 py-4 text-sm font-black text-white backdrop-blur-xl transition hover:bg-cyan-300/10' : 'rounded-full bg-cyan-300 px-6 py-4 text-sm font-black text-black shadow-[0_0_70px_rgba(103,232,249,.25)] transition hover:bg-white'}>
      {children}
    </a>
  )
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#010103]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(255,190,96,.24),rgba(104,225,255,.16)_14%,rgba(92,58,255,.10)_28%,transparent_48%)]" />
      <div className="absolute right-[12%] top-[24%] h-[28rem] w-[50rem] -rotate-6 rounded-full border border-orange-200/15 bg-[radial-gradient(ellipse,rgba(255,180,80,.24),rgba(103,232,249,.12)_35%,transparent_70%)] blur-[2px]" />
      <div className="absolute right-[28%] top-[34%] h-48 w-48 rounded-full bg-black shadow-[0_0_90px_rgba(0,0,0,1)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,1,4,.97)_0%,rgba(1,1,4,.85)_28%,rgba(1,1,4,.38)_58%,rgba(1,1,4,.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_40%,transparent,rgba(0,0,0,.35)_42%,rgba(0,0,0,.96)_100%)]" />
    </div>
  )
}

function Card({ children, className = '' }) {
  return <motion.div whileHover={{ y: -8 }} className={`rounded-[2rem] border border-cyan-200/15 bg-black/45 p-6 shadow-[0_24px_100px_rgba(0,0,0,.38)] backdrop-blur-2xl ${className}`}>{children}</motion.div>
}

function ProjectMockup({ index }) {
  return (
    <div className="mt-6 min-h-48 rounded-[1.5rem] border border-cyan-200/20 bg-[#020b13]/90 p-4 shadow-[0_0_80px_rgba(103,232,249,.12)]">
      <div className="flex gap-1.5 border-b border-white/10 pb-3"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-300" /><span className="h-2.5 w-2.5 rounded-full bg-cyan-300" /></div>
      {index === 0 && <div className="mt-5 space-y-3"><div className="grid grid-cols-3 gap-2">{['90','6','PASS'].map(v => <div key={v} className="rounded-xl bg-white/10 p-3 text-center font-black">{v}</div>)}</div>{['Planner criou arquitetura','QA validou telas','Repair corrigiu falha'].map((t,i)=><div key={t} className="rounded-full bg-cyan-300/10 p-2 text-xs font-bold text-cyan-100" style={{width:`${75+i*8}%`}}>{t}</div>)}</div>}
      {index === 1 && <div className="mt-5 grid grid-cols-2 gap-2">{['Vendas','Clientes','Pix','Cards'].map(t=><div key={t} className="rounded-xl bg-white/10 p-4"><p className="text-xl font-black">OK</p><p className="text-xs text-cyan-100">{t}</p></div>)}</div>}
      {index === 2 && <div className="mt-5 space-y-3"><div className="h-9 rounded-xl bg-gradient-to-r from-cyan-300/50 to-fuchsia-300/30" /><div className="h-3 w-5/6 rounded-full bg-white/20" /><div className="grid grid-cols-3 gap-2">{[1,2,3].map(i=><div key={i} className="h-20 rounded-xl bg-white/10" />)}</div></div>}
    </div>
  )
}

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#010103] text-white antialiased">
      <Background />
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-cyan-200/15 bg-black/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="font-black">MJR Forge</a>
          <nav className="hidden gap-6 text-sm font-bold text-cyan-100 md:flex"><a href="#impacto">Impacto</a><a href="#jarvis">Jarvis</a><a href="#projetos">Projetos</a><a href="#contato">Contato</a></nav>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-300 px-4 py-2 text-xs font-black text-black">WhatsApp</a>
        </div>
      </header>

      <section id="top" className="relative z-10 flex min-h-screen items-center px-5 pt-28">
        <div className="mx-auto max-w-7xl">
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6 inline-flex rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200">MJR Forge — Front-end React + AI-assisted delivery</motion.p>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="max-w-5xl text-5xl font-black leading-[.9] tracking-[-.08em] md:text-7xl lg:text-[7.2rem]">Front-end React com UI premium,<span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">automação e IA aplicada à entrega.</span></motion.h1>
          <motion.p initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="mt-8 max-w-2xl text-lg font-medium leading-9 text-cyan-50 md:text-xl">Sou Maurício Júnior, desenvolvedor Front-end React. Construo landing pages, dashboards e interfaces modernas com foco em clareza, responsividade, estética premium e validação real antes da entrega.</motion.p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row"><Button href={whatsapp}>Chamar no WhatsApp</Button><Button href={`mailto:${email}`} secondary>Enviar e-mail</Button></div>
        </div>
      </section>

      <section id="impacto" className="relative z-10 mx-auto max-w-7xl px-5 py-24">
        <h2 className="max-w-3xl text-4xl font-black tracking-[-.06em] md:text-6xl">Bonito chama atenção. Prova real gera confiança.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-cyan-50">Eu não quero vender só estética. Quero mostrar que consigo construir, testar, corrigir e entregar interfaces com mentalidade de produto.</p>
        <div className="mt-12 grid gap-4 md:grid-cols-4">{stats.map(([v,l])=><Card key={l}><p className="text-4xl font-black">{v}</p><p className="mt-3 text-sm font-bold text-cyan-100">{l}</p></Card>)}</div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24">
        <h2 className="max-w-3xl text-4xl font-black tracking-[-.06em] md:text-6xl">Por que um recrutador deveria prestar atenção agora?</h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-4">{signals.map(([t,d])=><Card key={t}><h3 className="text-xl font-black">{t}</h3><p className="mt-4 text-sm leading-7 text-cyan-100">{d}</p></Card>)}</div>
      </section>

      <section id="jarvis" className="relative z-10 mx-auto max-w-7xl px-5 py-24">
        <div className="rounded-[3rem] border border-cyan-200/20 bg-gradient-to-br from-cyan-300/15 via-black/60 to-fuchsia-500/10 p-8 backdrop-blur-2xl md:p-12">
          <p className="mb-4 text-sm font-black uppercase tracking-[.32em] text-cyan-300">Vantagem privada</p>
          <h2 className="max-w-4xl text-4xl font-black tracking-[-.06em] md:text-6xl">O Jarvis aparece como vantagem, não como manual aberto.</h2>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-cyan-50">Para clientes e recrutadores, o que importa é o resultado: protótipos rápidos, QA visual, menos erros e capacidade de transformar ideia em interface. A arquitetura profunda fica protegida.</p>
        </div>
      </section>

      <section id="projetos" className="relative z-10 mx-auto max-w-7xl px-5 py-24">
        <h2 className="max-w-3xl text-4xl font-black tracking-[-.06em] md:text-6xl">Projetos com cara de produto, não lista de curso.</h2>
        <div className="mt-12 space-y-6">{projects.map(([title,text,tags],i)=><Card key={title}><div className="grid gap-6 lg:grid-cols-[.8fr_1fr]"><div><p className="text-sm font-black uppercase tracking-[.24em] text-cyan-300">0{i+1}</p><h3 className="mt-3 text-3xl font-black">{title}</h3><p className="mt-4 leading-8 text-cyan-50">{text}</p><div className="mt-5 flex flex-wrap gap-2">{tags.map(tag=><span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-100">{tag}</span>)}</div></div><ProjectMockup index={i}/></div></Card>)}</div>
      </section>

      <section id="contato" className="relative z-10 mx-auto max-w-6xl px-5 py-28 text-center">
        <div className="rounded-[3rem] border border-cyan-200/20 bg-gradient-to-br from-cyan-300/15 via-black/60 to-fuchsia-500/10 p-8 backdrop-blur-2xl md:p-16">
          <p className="text-sm font-black uppercase tracking-[.32em] text-cyan-300">Contato</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-.06em] md:text-6xl">Procuro a primeira oportunidade. E também entrego projetos freelance.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-cyan-50">Aberto para estágio Front-end React, freelas de landing pages, dashboards, interfaces premium e projetos remotos em dólar/euro.</p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"><Button href={whatsapp}>Chamar no WhatsApp</Button><Button href={`mailto:${email}`} secondary>Enviar e-mail</Button><Button href={github} secondary>GitHub</Button></div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 text-center text-sm text-cyan-100/70">© 2026 Maurício Júnior — MJR Forge</footer>
    </main>
  )
}
