import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GravityCursor from './components/GravityCursor.jsx'
import BrandMark from './components/BrandMark.jsx'
import ProjectMockup from './components/ProjectMockup.jsx'

const BRAND = {
  name: 'MJR Forge',
  signature: 'Maurício Júnior',
  email: 'mauriciojr07052006@gmail.com',
  phone: '+55 24 99262-5175',
  whatsapp: 'https://wa.me/5524992625175',
  github: 'https://github.com/Juniorsilva-tech',
}

const nav = [
  ['Journey', '#journey'],
  ['Work', '#work'],
  ['Processo', '#processo'],
  ['Contato', '#contato'],
]

const milestones = [
  ['Março 2026', 'Início forte em ADS e desenvolvimento web, transformando estudo em prática visível.'],
  ['MJR Forge', 'Site pessoal em evolução, criado para centralizar minha identidade, projetos e trajetória.'],
  ['RetailFlow', 'Dashboard SaaS demo com CRUD, métricas, pagamentos, clientes e experiência de produto.'],
  ['Princessmel', 'Projeto real de landing page e identidade digital para uma loja de moda cristã.'],
  ['Jarvis', 'Workflow privado de automação e desenvolvimento assistido por IA para acelerar entregas.'],
]

const projects = [
  {
    label: 'Real Case',
    title: 'Princessmel',
    text: 'Landing page e identidade digital para loja de moda cristã, com foco em curadoria, apresentação de produtos, WhatsApp e atmosfera editorial.',
    tags: ['Landing Page', 'Branding', 'UI Editorial', 'WhatsApp'],
  },
  {
    label: 'SaaS Demo',
    title: 'RetailFlow Dashboard',
    text: 'Demo funcional de dashboard para pequenos negócios, com clientes, pedidos, pagamentos, relatórios e persistência local.',
    tags: ['React', 'Dashboard', 'CRUD', 'Vercel'],
    demo: 'https://retailflow-dashboard.vercel.app',
    repo: 'https://github.com/Juniorsilva-tech/retailflow-dashboard',
  },
  {
    label: 'Personal System',
    title: 'Jarvis Workflow',
    text: 'Sistema experimental privado para organizar, revisar e acelerar criação de interfaces e aplicações web com apoio de IA.',
    tags: ['Automation', 'QA Visual', 'AI Workflow', 'React UI'],
  },
]

const process = [
  ['Briefing', 'entender objetivo, público e sensação desejada'],
  ['Direção', 'definir estética, ritmo, cores, tipografia e narrativa'],
  ['Construção', 'transformar direção em React, componentes e layout responsivo'],
  ['Refino', 'ajustar motion, espaçamento, contraste e experiência'],
  ['Entrega', 'publicar, documentar e preparar evolução contínua'],
]

function Icon({ name, className = '' }) {
  const icons = {
    arrow: ['M5 12h14', 'M13 5l7 7-7 7'],
    menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
    close: ['M6 6l12 12', 'M18 6L6 18'],
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(icons[name] || icons.arrow).map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

function Button({ href, children, secondary = false }) {
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      data-cursor="active"
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition duration-300 ${secondary ? 'border border-[#f4efe7]/10 bg-[#f4efe7]/5 text-[#f4efe7] hover:border-[#c7a15a]/50 hover:bg-[#c7a15a]/10' : 'bg-[#c7a15a] text-[#080807] shadow-[0_20px_90px_rgba(199,161,90,.22)] hover:bg-[#f4efe7]'}`}
    >
      {children}
      <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <Reveal className="mb-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">{eyebrow}</p>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#f4efe7] md:text-6xl">{title}</h2>
      </div>
      {text && <p className="max-w-2xl text-lg leading-8 text-[#a89f91]">{text}</p>}
    </Reveal>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#f4efe7]/10 bg-[#080807]/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-3" data-cursor="active">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold text-[#f4efe7]">{BRAND.name}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-[#a89f91]">{BRAND.signature}</p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 p-1 md:flex">
          {nav.map(([label, href]) => (
            <a key={href} href={href} data-cursor="active" className="rounded-full px-4 py-2 text-xs font-semibold text-[#a89f91] transition hover:bg-[#c7a15a]/10 hover:text-[#f4efe7]">
              {label}
            </a>
          ))}
        </nav>

        <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" data-cursor="active" className="hidden rounded-full bg-[#c7a15a] px-5 py-2.5 text-xs font-semibold text-[#080807] transition hover:bg-[#f4efe7] md:inline-flex">
          Vamos conversar
        </a>

        <button onClick={() => setOpen(!open)} className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 p-2 md:hidden" aria-label="Abrir menu">
          <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-[#f4efe7]/10 bg-[#080807] px-5 py-4 md:hidden">
          {nav.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="mb-2 block rounded-2xl bg-[#f4efe7]/5 px-4 py-3 text-sm font-semibold text-[#f4efe7]">
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#080807]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(199,161,90,.18),transparent_35%),radial-gradient(circle_at_10%_70%,rgba(155,94,50,.16),transparent_32%),linear-gradient(180deg,#080807_0%,#11110f_46%,#080807_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(244,239,231,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,231,.8)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.72)_85%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,rgba(244,239,231,.35)_0px,rgba(244,239,231,.35)_1px,transparent_1px,transparent_4px)]" />
    </div>
  )
}

function HumanPresence() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative hidden min-h-[680px] items-center justify-center lg:flex"
    >
      <div className="absolute -right-6 top-10 h-[660px] w-[480px] rounded-[3rem] bg-[#c7a15a]/[0.08] blur-[2px]" />
      <motion.div
        initial={{ clipPath: 'inset(14% 0% 18% 0% round 3rem)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 3rem)' }}
        transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[640px] w-[440px] overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#11110f] shadow-[0_40px_160px_rgba(0,0,0,.65)]"
      >
        <img
          src="/forge-portrait.jpg"
          alt="Maurício Júnior em composição cinematográfica"
          className="h-full w-full object-cover object-[52%_42%] saturate-[.78] contrast-[1.08] brightness-[.74] sepia-[.12]"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(199,161,90,.22),transparent_34%),linear-gradient(90deg,rgba(8,8,7,.24),transparent_42%,rgba(8,8,7,.72)),linear-gradient(180deg,transparent_45%,rgba(8,8,7,.86))]" />
        <div className="absolute inset-0 mix-blend-soft-light opacity-25 [background-image:repeating-linear-gradient(0deg,rgba(244,239,231,.35)_0px,rgba(244,239,231,.35)_1px,transparent_1px,transparent_5px)]" />
      </motion.div>
      <div className="absolute -right-4 top-20 h-44 w-44 rounded-full bg-[#c7a15a]/20 blur-3xl" />
      <div className="absolute bottom-20 left-12 h-28 w-28 rounded-full bg-[#9b5e32]/20 blur-3xl" />
      <div className="absolute bottom-12 right-2 max-w-xs rounded-[2rem] border border-[#f4efe7]/10 bg-[#11110f]/75 p-5 backdrop-blur-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">Human Presence</p>
        <p className="mt-3 text-sm leading-6 text-[#a89f91]">Foto real tratada como linguagem visual: sombra, textura, silêncio e direção.</p>
      </div>
    </motion.div>
  )
}

export default function App() {
  const hero = useRef(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96])

  return (
    <main id="top" className="min-h-screen overflow-hidden bg-[#080807] text-[#f4efe7] antialiased md:cursor-none">
      <Atmosphere />
      <GravityCursor />
      <Header />

      <section ref={hero} className="relative z-10 flex min-h-screen items-center px-5 pt-28 lg:px-8">
        <motion.div style={{ y, opacity, scale }} className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.04fr_.96fr] lg:items-center">
          <div>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-7 text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
              MJR Forge — Cinematic Front-end Experience
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, delay: 0.08 }} className="max-w-5xl text-5xl font-semibold leading-[0.88] tracking-[-0.08em] text-[#f4efe7] md:text-7xl lg:text-[6.6rem]">
              Interfaces digitais com estética, produto e intenção.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, delay: 0.18 }} className="mt-8 max-w-2xl text-lg leading-9 text-[#a89f91] md:text-xl">
              Sou Maurício Júnior, desenvolvedor Front-end React em formação. Construo landing pages, dashboards e experiências web modernas com UI premium, narrativa visual e entrega real.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, delay: 0.28 }} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="#work">Explorar projetos</Button>
              <Button href={BRAND.whatsapp} secondary>Falar comigo</Button>
            </motion.div>
          </div>

          <HumanPresence />
        </motion.div>
      </section>

      <section id="manifesto" className="relative z-10 mx-auto max-w-7xl px-5 py-28 lg:px-8">
        <Reveal>
          <div className="grid gap-10 border-y border-[#f4efe7]/10 py-20 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">Manifesto</p>
            <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-[#f4efe7] md:text-6xl">
              O site não deve gritar. Deve conduzir.
            </h2>
            <div />
            <p className="max-w-3xl text-xl leading-9 text-[#a89f91]">
              O Forge nasce da ideia de que uma boa interface tem ritmo. Silêncio, tensão, respiro, impacto e clareza. Menos efeito genérico. Mais direção criativa.
            </p>
          </div>
        </Reveal>
      </section>

      <section id="journey" className="relative z-10 mx-auto max-w-7xl px-5 py-28 lg:px-8">
        <SectionTitle eyebrow="Journey" title="Uma trajetória em movimento." text="A jornada não é uma lista de datas. É uma sequência de escolhas, projetos e evolução prática." />
        <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#11110f]/70 p-6 backdrop-blur-2xl md:p-10">
          <div className="absolute left-10 top-10 bottom-10 hidden w-px bg-gradient-to-b from-transparent via-[#c7a15a]/50 to-transparent md:block" />
          <div className="grid gap-5">
            {milestones.map(([time, text], index) => (
              <Reveal key={time} delay={index * 0.06}>
                <div className="grid gap-5 rounded-[2rem] border border-[#f4efe7]/10 bg-[#080807]/55 p-6 md:grid-cols-[0.32fr_1fr] md:p-8">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">{time}</p>
                  </div>
                  <p className="text-lg leading-8 text-[#a89f91]">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="relative z-10 mx-auto max-w-7xl px-5 py-28 lg:px-8">
        <SectionTitle eyebrow="Selected Work" title="Projetos apresentados como peças editoriais." text="Cada projeto precisa explicar contexto, intenção e resultado — não apenas mostrar uma tela bonita." />
        <div className="grid gap-6">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.08}>
              <motion.article whileHover={{ y: -6 }} data-cursor="active" className="overflow-hidden rounded-[2.6rem] border border-[#f4efe7]/10 bg-[#11110f]/70 p-4 shadow-[0_40px_140px_rgba(0,0,0,.45)] backdrop-blur-2xl">
                <div className="grid gap-8 rounded-[2.2rem] bg-gradient-to-br from-[#f4efe7]/[0.045] via-transparent to-[#c7a15a]/[0.06] p-6 md:p-8 lg:grid-cols-[0.65fr_0.9fr_0.75fr] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c7a15a]">{project.label}</p>
                    <h3 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[#f4efe7] md:text-5xl">{project.title}</h3>
                  </div>
                  <div>
                    <p className="text-lg leading-8 text-[#a89f91]">{project.text}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map(tag => <span key={tag} className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 px-3 py-1 text-xs font-semibold text-[#d8d0c3]">{tag}</span>)}
                    </div>
                    {(project.demo || project.repo) && (
                      <div className="mt-7 flex flex-wrap gap-3">
                        {project.demo && <Button href={project.demo}>Demo</Button>}
                        {project.repo && <Button href={project.repo} secondary>GitHub</Button>}
                      </div>
                    )}
                  </div>
                  <ProjectMockup index={index} />
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="processo" className="relative z-10 mx-auto max-w-7xl px-5 py-28 lg:px-8">
        <SectionTitle eyebrow="Processo" title="Do briefing ao refinamento." text="O diferencial não está só em codar. Está em transformar intenção em experiência utilizável, bonita e clara." />
        <div className="grid gap-4 md:grid-cols-5">
          {process.map(([title, text], index) => (
            <Reveal key={title} delay={index * 0.06}>
              <div className="h-full rounded-[2rem] border border-[#f4efe7]/10 bg-[#11110f]/65 p-6 backdrop-blur-xl">
                <p className="mb-10 text-sm font-semibold text-[#c7a15a]">0{index + 1}</p>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#f4efe7]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#a89f91]">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contato" className="relative z-10 mx-auto max-w-6xl px-5 py-28 text-center lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#11110f]/70 p-8 backdrop-blur-2xl md:p-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a15a] to-transparent" />
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#c7a15a]/10 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">Final Scene</p>
            <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-[#f4efe7] md:text-6xl">Vamos construir algo memorável.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a89f91]">Aberto para estágio Front-end React, freelas de landing pages, dashboards e experiências digitais premium.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm font-semibold text-[#d8d0c3] sm:flex-row">
              <span>{BRAND.email}</span>
              <span className="hidden text-[#f4efe7]/20 sm:inline">•</span>
              <span>{BRAND.phone}</span>
            </div>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href={BRAND.whatsapp}>WhatsApp</Button>
              <Button href={`mailto:${BRAND.email}`} secondary>E-mail</Button>
              <Button href={BRAND.github} secondary>GitHub</Button>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 border-t border-[#f4efe7]/10 px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#766f65] md:flex-row md:items-center md:justify-between">
          <p>© 2026 {BRAND.signature} — {BRAND.name}</p>
          <p>React • UI premium • experiências digitais com intenção</p>
        </div>
      </footer>
    </main>
  )
}
