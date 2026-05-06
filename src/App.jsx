import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BrandMark from './components/BrandMark.jsx'
import GravityCursor from './components/GravityCursor.jsx'
import ProjectMockup from './components/ProjectMockup.jsx'
import DynamicLight from './components/cinematic/DynamicLight.jsx'
import FilmGrain from './components/cinematic/FilmGrain.jsx'

const BRAND = {
  name: 'MJR Forge',
  signature: 'Maurício Júnior',
  email: 'mauriciojr07052006@gmail.com',
  whatsapp: 'https://wa.me/5524992625175',
  github: 'https://github.com/Juniorsilva-tech',
}

const nav = [
  ['Manifesto', '#manifesto'],
  ['Journey', '#journey'],
  ['Work', '#work'],
  ['Contato', '#contato'],
]

const principles = ['Silence', 'Presence', 'Rhythm', 'Product', 'Refinement']

const milestones = [
  ['01', 'Março 2026', 'ADS + foco real em web. Estudo virando prática, deploy e projeto visível.'],
  ['02', 'MJR Forge', 'Site pessoal em evolução. Um laboratório de identidade, UI e experiência digital.'],
  ['03', 'RetailFlow', 'Dashboard SaaS demo com CRUD, clientes, pedidos, métricas e visão de produto.'],
  ['04', 'Princessmel', 'Projeto real para loja cristã: presença digital, estética e conversão via WhatsApp.'],
  ['05', 'Jarvis', 'Workflow privado com IA para acelerar criação, QA visual e refinamento de interfaces.'],
]

const projects = [
  {
    slug: 'princessmel',
    label: 'Real Case',
    title: 'Princessmel',
    text: 'Landing page e identidade digital para loja de moda cristã, com foco em curadoria, apresentação de produtos, WhatsApp e atmosfera editorial.',
    tags: ['Landing Page', 'Branding', 'UI Editorial', 'WhatsApp'],
  },
  {
    slug: 'retailflow',
    label: 'SaaS Demo',
    title: 'RetailFlow Dashboard',
    text: 'Demo funcional de dashboard para pequenos negócios, com clientes, pedidos, pagamentos, relatórios e persistência local.',
    tags: ['React', 'Dashboard', 'CRUD', 'Vercel'],
    demo: 'https://retailflow-dashboard.vercel.app',
    repo: 'https://github.com/Juniorsilva-tech/retailflow-dashboard',
    screenshots: [
      '/retailflow/overview.png',
      '/retailflow/clientes.png',
      '/retailflow/pedidos.png',
      '/retailflow/financeiro.png',
      '/retailflow/relatorios.png',
    ],
  },
  {
    slug: 'jarvis',
    label: 'Private System',
    title: 'Jarvis Workflow',
    text: 'Sistema experimental privado para organizar, revisar e acelerar criação de interfaces e aplicações web com apoio de IA.',
    tags: ['Automation', 'QA Visual', 'AI Workflow', 'React UI'],
  },
]

const professionalHighlights = [
  {
    title: 'Front-end React',
    text: 'Interfaces modernas com foco em legibilidade, arquitetura simples e manutenção clara.',
  },
  {
    title: 'UI premium',
    text: 'Direção visual controlada, acabamento editorial e consistência entre layout, ritmo e marca.',
  },
  {
    title: 'Dashboards',
    text: 'Painéis para operação, leitura de métricas, CRUD e fluxo de produto orientado a uso real.',
  },
  {
    title: 'Landing pages',
    text: 'Páginas para apresentação, conversão, narrativa visual e CTA direto com o negócio.',
  },
  {
    title: 'Automação',
    text: 'Fluxos que aceleram build, QA e revisão sem sacrificar estabilidade ou clareza.',
  },
  {
    title: 'IA aplicada à entrega',
    text: 'Uso pragmático de IA para validação, refinamento e aceleração do processo.',
  },
]

const sceneVariants = {
  depth: {
    hidden: { opacity: 0, y: 54, scale: 0.94 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  rise: {
    hidden: { opacity: 0, y: 72 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 90, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1 },
  },
  expand: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  final: {
    hidden: { opacity: 0, y: 42, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
}

function useCompactViewport() {
  const [isCompactViewport, setIsCompactViewport] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const media = window.matchMedia('(max-width: 767px)')
    const syncViewport = () => setIsCompactViewport(media.matches)

    syncViewport()
    media.addEventListener('change', syncViewport)

    return () => media.removeEventListener('change', syncViewport)
  }, [])

  return isCompactViewport
}

function Scene({ type = 'rise', children, className = '', delay = 0 }) {
  return (
    <motion.div
      variants={sceneVariants[type] || sceneVariants.rise}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: '-60px' }}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Bridge({ label, align = 'left' }) {
  return (
    <div className="relative z-10 mx-auto max-w-[1500px] px-5 lg:px-8" aria-hidden="true">
      <div className="relative h-20 overflow-hidden">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#c7a15a]/35 to-transparent" />

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: '34%', opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-1/2 h-px bg-[#c7a15a]/80 ${align === 'right' ? 'right-0' : 'left-0'}`}
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`absolute top-1/2 -translate-y-1/2 rounded-full border border-[#f4efe7]/10 bg-[#050505]/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c7a15a] backdrop-blur-xl ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {label}
        </motion.div>
      </div>
    </div>
  )
}

function Icon({ name, className = '' }) {
  const icons = {
    arrow: ['M5 12h14', 'M13 5l7 7-7 7'],
    menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
    close: ['M6 6l12 12', 'M18 6L6 18'],
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(icons[name] || icons.arrow).map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  )
}

function Button({ href, children, secondary = false }) {
  const isExternal = href?.startsWith('http')

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      data-cursor="active"
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition duration-300 sm:w-auto ${
        secondary
          ? 'border border-[#f4efe7]/10 bg-[#080807]/55 text-[#f4efe7] hover:border-[#c7a15a]/50 hover:bg-[#c7a15a]/10'
          : 'bg-[#c7a15a] text-[#080807] shadow-[0_20px_90px_rgba(199,161,90,.22)] hover:bg-[#f4efe7]'
      }`}
    >
      {children}
      <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#f4efe7]/10 bg-[#050505]/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-5 py-4 lg:px-8">
        <a href="#top" className="min-w-0 flex items-center gap-3" data-cursor="active">
          <BrandMark />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#f4efe7]">{BRAND.name}</p>
            <p className="mt-1 truncate text-[10px] uppercase tracking-[0.26em] text-[#a89f91]">
              {BRAND.signature}
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 p-1 md:flex">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-cursor="active"
              className="rounded-full px-4 py-2 text-xs font-semibold text-[#a89f91] transition hover:bg-[#c7a15a]/10 hover:text-[#f4efe7]"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href={BRAND.whatsapp}
          target="_blank"
          rel="noreferrer"
          data-cursor="active"
          className="hidden rounded-full bg-[#c7a15a] px-5 py-2.5 text-xs font-semibold text-[#080807] transition hover:bg-[#f4efe7] md:inline-flex"
        >
          Vamos conversar
        </a>

        <button
          onClick={() => setOpen(current => !current)}
          className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 p-2 md:hidden"
          aria-label="Abrir menu"
        >
          <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-[#f4efe7]/10 bg-[#080807] px-5 py-4 md:hidden">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="mb-2 block rounded-2xl bg-[#f4efe7]/5 px-4 py-3 text-sm font-semibold text-[#f4efe7]"
            >
              {label}
            </a>
          ))}

          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#c7a15a] px-4 py-3 text-sm font-semibold text-[#080807]"
          >
            Vamos conversar
          </a>
        </div>
      )}
    </header>
  )
}

function Atmosphere() {
  const isCompactViewport = useCompactViewport()

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#050505_0%,#080706_34%,#11100d_58%,#050505_100%)]" />

      <motion.div
        className="absolute -right-[16vw] -top-[18vh] h-[65vh] w-[62vw] rounded-full bg-[#c7a15a]/[0.04] blur-[90px]"
        animate={
          isCompactViewport
            ? { opacity: 0.26, scale: 1, x: 0 }
            : { opacity: [0.22, 0.42, 0.22], scale: [1, 1.03, 1], x: [0, -10, 0] }
        }
        transition={
          isCompactViewport ? { duration: 0 } : { duration: 16, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <motion.div
        className="absolute -bottom-[20vh] -left-[18vw] h-[70vh] w-[56vw] rounded-full bg-[#9b5e32]/[0.04] blur-[100px]"
        animate={
          isCompactViewport
            ? { opacity: 0.22, scale: 1, x: 0 }
            : { opacity: [0.18, 0.32, 0.18], scale: [1.02, 1, 1.02], x: [0, 12, 0] }
        }
        transition={
          isCompactViewport ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.30)_42%,rgba(0,0,0,.86)_100%)]" />
      <div className="absolute inset-0 opacity-[0.025] [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.20)_0px,rgba(255,255,255,.20)_1px,transparent_1px,transparent_8px)]" />
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="relative z-10 min-h-screen overflow-hidden px-5 pb-16 pt-24 sm:pt-28 lg:px-8">
      <div className="forge-depth-stage relative mx-auto grid min-h-[calc(100vh-6.5rem)] max-w-[1500px] items-center gap-10 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <Scene type="depth">
          <div className="relative z-10 max-w-[880px]">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c7a15a] sm:mb-7 sm:text-xs sm:tracking-[0.45em]">
              MJR Forge — Front-end, UI premium e direção de produto
            </p>

            <h1 className="max-w-[11ch] text-[16vw] font-semibold leading-[0.88] tracking-[-0.09em] text-[#f4efe7] sm:text-[6rem] sm:leading-[0.84] lg:max-w-none lg:text-[8.4rem]">
              Interfaces premium para produtos, marcas e negócios reais.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d8d0c3] sm:mt-8 sm:text-lg md:text-xl md:leading-9">
              Sou Maurício Júnior, desenvolvedor Front-end React em formação. Crio landing
              pages, dashboards e experiências digitais com UI premium, automação e visão de
              produto.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {['React', 'Landing Pages', 'Dashboards', 'Automação com IA'].map(item => (
                <span
                  key={item}
                  className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d8d0c3] sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button href="#work">Explorar projetos</Button>
              <Button href={BRAND.whatsapp} secondary>
                Falar comigo
              </Button>
            </div>
          </div>
        </Scene>

        <Scene type="left" delay={0.12}>
          <div className="relative ml-auto w-full max-w-[560px]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[#c7a15a]/10 blur-3xl sm:-inset-8 sm:rounded-[3rem]" />

            <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/70 p-3 shadow-[0_50px_160px_rgba(0,0,0,.55)]">
              <img
                src="/forge-portrait.jpg"
                alt="Maurício Júnior"
                className="h-[420px] w-full rounded-[2.2rem] object-cover object-[50%_42%] saturate-[.72] contrast-[1.12] brightness-[.72] sepia-[.12] sm:h-[560px] sm:rounded-[2.4rem] lg:h-[620px]"
              />

              <div className="absolute inset-3 rounded-[2.2rem] bg-[linear-gradient(180deg,transparent_35%,rgba(5,5,5,.92)_100%)] sm:rounded-[2.4rem]" />

              <div className="absolute bottom-5 left-5 right-5 rounded-[1.6rem] border border-[#f4efe7]/10 bg-[#050505]/55 p-4 backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-8 sm:rounded-3xl sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">
                  Human Presence
                </p>
                <p className="mt-2 text-sm leading-6 text-[#d8d0c3]">
                  Foto real como linguagem visual: presença, textura e direção.
                </p>
              </div>
            </div>
          </div>
        </Scene>
      </div>
    </section>
  )
}

function SectionTitle({ eyebrow, title, text, type = 'rise' }) {
  return (
    <Scene type={type} className="mb-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
          {eyebrow}
        </p>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#f4efe7] md:text-6xl">
          {title}
        </h2>
      </div>

      {text && <p className="max-w-2xl text-lg leading-8 text-[#a89f91]">{text}</p>}
    </Scene>
  )
}

function Manifesto() {
  return (
    <section id="manifesto" className="relative z-10 mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
      <Scene type="depth">
        <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/75 p-8 shadow-[0_40px_140px_rgba(0,0,0,.45)] backdrop-blur-2xl md:p-14 lg:p-20">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
                Manifesto
              </p>
              <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.07em] text-[#f4efe7] md:text-7xl">
                O site não deve gritar. Deve conduzir.
              </h2>
            </div>

            <div>
              <p className="text-xl leading-9 text-[#a89f91]">
                O Forge nasce da ideia de que uma boa interface tem ritmo: silêncio, tensão,
                respiro, impacto e clareza. Menos efeito genérico. Mais direção criativa.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {principles.map((item, index) => (
                  <Scene key={item} type="rise" delay={index * 0.04}>
                    <div className="rounded-2xl border border-[#f4efe7]/10 bg-[#050505]/60 px-4 py-5 text-center text-sm font-semibold text-[#d8d0c3]">
                      {item}
                    </div>
                  </Scene>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Scene>
    </section>
  )
}

function JourneyScene() {
  return (
    <section id="journey" className="relative z-10 mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
      <SectionTitle
        type="left"
        eyebrow="Journey / rhythm"
        title="A jornada atravessa a tela."
        text="A timeline flui como galeria horizontal limpa dentro do scroll natural."
      />

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-5 pr-5">
          {milestones.map(([number, time, text], index) => (
            <Scene key={time} type="left" delay={index * 0.07}>
              <article
                data-cursor="active"
                className="forge-emerge-card relative h-[360px] w-[82vw] max-w-[360px] rounded-[2.2rem] border border-[#f4efe7]/10 bg-[#0c0b09]/80 p-6 shadow-[0_40px_140px_rgba(0,0,0,.42)] backdrop-blur-2xl sm:h-[420px] sm:w-[360px] sm:rounded-[2.4rem] sm:p-8"
              >
                <p className="text-[6rem] font-semibold leading-none tracking-[-0.12em] text-[#c7a15a]/18">
                  {number}
                </p>
                <p className="mt-12 text-xs font-semibold uppercase tracking-[0.32em] text-[#c7a15a] sm:mt-20">
                  {time}
                </p>
                <p className="mt-5 text-base leading-8 text-[#a89f91]">{text}</p>
              </article>
            </Scene>
          ))}
        </div>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section id="work" className="relative z-10 mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
      <SectionTitle
        type="expand"
        eyebrow="Selected Work"
        title="Projetos como peças editoriais."
        text="Cada projeto precisa explicar contexto, intenção e resultado — não apenas mostrar uma tela bonita."
      />

      <div className="grid gap-6">
        {projects.map((project, index) => (
          <Scene
            key={project.title}
            type={index % 2 === 0 ? 'depth' : 'left'}
            delay={index * 0.08}
          >
            <motion.article
              whileHover={{ y: -6 }}
              data-cursor="active"
              className="forge-emerge-card overflow-hidden rounded-[2.3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/70 p-3 shadow-[0_40px_140px_rgba(0,0,0,.45)] backdrop-blur-2xl sm:rounded-[2.8rem] sm:p-4"
            >
              <div className="grid gap-8 rounded-[2rem] bg-gradient-to-br from-[#f4efe7]/[0.035] via-transparent to-[#c7a15a]/[0.035] p-5 sm:rounded-[2.4rem] sm:p-7 md:p-10 lg:grid-cols-[0.7fr_0.95fr_0.7fr] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c7a15a]">
                    {project.label}
                  </p>
                  <h3 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-[#f4efe7] md:text-6xl">
                    {project.title}
                  </h3>
                </div>

                <div>
                  <p className="text-lg leading-8 text-[#a89f91]">{project.text}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#f4efe7]/10 bg-[#f4efe7]/5 px-3 py-1 text-xs font-semibold text-[#d8d0c3]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {(project.demo || project.repo) && (
                    <div className="mt-7 flex flex-wrap gap-3">
                      {project.demo && <Button href={project.demo}>Demo</Button>}
                      {project.repo && (
                        <Button href={project.repo} secondary>
                          GitHub
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <ProjectMockup index={index} project={project} />
              </div>
            </motion.article>
          </Scene>
        ))}
      </div>
    </section>
  )
}

function ProfessionalLayer() {
  return (
    <section
      id="professional"
      className="relative z-10 mx-auto max-w-[1500px] px-5 py-16 lg:px-8"
    >
      <SectionTitle
        type="rise"
        eyebrow="Professional Layer"
        title="Front-end React com UI premium, automação e foco em entrega."
        text="Camada objetiva para recrutadores, clientes e times que precisam entender escopo, direção e disponibilidade com leitura rápida."
      />

      <Scene type="depth">
        <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/72 p-8 shadow-[0_40px_140px_rgba(0,0,0,.45)] backdrop-blur-2xl md:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
                  Positioning
                </p>
                <h3 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f4efe7] md:text-5xl">
                  Disponível para estágio e freelas com construção cuidadosa.
                </h3>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#a89f91]">
                  Desenvolvimento front-end com base em React, páginas de conversão, dashboards,
                  refinamento visual e uso pragmático de IA para acelerar a entrega.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#f4efe7]/10 bg-[#050505]/55 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">
                  Available now
                </p>
                <p className="mt-3 text-base leading-7 text-[#d8d0c3]">
                  Aberto para estágio Front-end React, landing pages, dashboards e projetos
                  digitais com direção visual e foco em produto.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {professionalHighlights.map((item, index) => (
                <Scene key={item.title} type="rise" delay={index * 0.04}>
                  <article className="forge-emerge-card h-full rounded-[2rem] border border-[#f4efe7]/10 bg-[#050505]/45 p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c7a15a]">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h4 className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-[#f4efe7]">
                      {item.title}
                    </h4>
                    <p className="mt-4 text-sm leading-7 text-[#a89f91]">{item.text}</p>
                  </article>
                </Scene>
              ))}
            </div>
          </div>
        </div>
      </Scene>
    </section>
  )
}

function Process() {
  return (
    <section id="processo" className="relative z-10 mx-auto max-w-[1500px] px-5 py-16 lg:px-8">
      <Scene type="rise">
        <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/65 p-8 backdrop-blur-2xl md:p-14 lg:p-20">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
            Processo
          </p>
          <h2 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] text-[#f4efe7] md:text-7xl">
            Do briefing ao refinamento.
          </h2>

          <div className="mt-16 grid gap-4 md:grid-cols-5">
            {['Briefing', 'Direção', 'Build', 'Refino', 'Deploy'].map((item, index) => (
              <Scene key={item} type="rise" delay={index * 0.06}>
                <div className="forge-emerge-card rounded-[2rem] border border-[#f4efe7]/10 bg-[#050505]/50 p-6">
                  <p className="mb-10 text-sm font-semibold text-[#c7a15a]">
                    0{index + 1}
                  </p>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#f4efe7]">
                    {item}
                  </h3>
                </div>
              </Scene>
            ))}
          </div>
        </div>
      </Scene>
    </section>
  )
}

function Contact() {
  return (
    <section id="contato" className="relative z-10 mx-auto max-w-6xl px-5 py-16 text-center lg:px-8">
      <Scene type="final">
        <div className="relative overflow-hidden rounded-[3rem] border border-[#f4efe7]/10 bg-[#0b0a08]/70 p-8 backdrop-blur-2xl md:p-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a15a] to-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c7a15a]">
            Final Scene
          </p>
          <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-[#f4efe7] md:text-6xl">
            Disponível para estágio e projetos selecionados.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a89f91]">
            Aberto para estágio Front-end React, freelas de landing pages, dashboards e
            experiências digitais premium com direção visual e visão de produto.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href={BRAND.whatsapp}>WhatsApp</Button>
            <Button href={`mailto:${BRAND.email}`} secondary>
              E-mail
            </Button>
            <Button href={BRAND.github} secondary>
              GitHub
            </Button>
          </div>
        </div>
      </Scene>
    </section>
  )
}

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-[#f4efe7] antialiased">
      <Atmosphere />
      <DynamicLight />
      <FilmGrain />
      <GravityCursor />
      <Header />
      <Hero />
      <Bridge label="manifesto" />
      <Manifesto />
      <Bridge label="timeline" align="right" />
      <JourneyScene />
      <Bridge label="selected work" />
      <Work />
      <Bridge label="professional layer" align="right" />
      <ProfessionalLayer />
      <Bridge label="process" />
      <Process />
      <Bridge label="final scene" align="right" />
      <Contact />

      <footer className="relative z-10 border-t border-[#f4efe7]/10 px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 text-sm text-[#766f65] md:flex-row md:items-center md:justify-between">
          <p>© 2026 {BRAND.signature} — {BRAND.name}</p>
          <p>React • UI premium • automação aplicada à entrega</p>
        </div>
      </footer>
    </main>
  )
}
