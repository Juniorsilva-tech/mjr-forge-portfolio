import { useEffect, useState } from 'react'

const BRAND = {
  name: 'MJR Forge',
  signature: 'Maurício Silva Junior',
  role: 'Frontend Developer | React • Next.js • TypeScript • UI Premium',
  whatsapp: 'https://wa.me/5524992625175',
  github: 'https://github.com/Juniorsilva-tech',
  email: 'mailto:mauriciojr0705@gmail.com',
}

const NAV = [
  ['Projetos', '#work'],
  ['Stack', '#stack'],
  ['Processo', '#process'],
  ['Contato', '#contact'],
]

const PROJECTS = [
  {
    title: 'RetailFlow Dashboard',
    eyebrow: 'dashboard SaaS para negócios locais',
    text: 'Dashboard administrativo com clientes, pedidos, pagamentos, relatórios e métricas comerciais. Projeto focado em UI de produto, CRUD visual, responsividade e experiência de SaaS moderno.',
    tags: ['React', 'Vite', 'Dashboard', 'UI SaaS'],
    href: 'https://retailflow-dashboard.vercel.app',
    repo: 'https://github.com/Juniorsilva-tech/retailflow-dashboard',
    metric: 'Produto',
  },
  {
    title: 'BarberFlow',
    eyebrow: 'gestão moderna para barbearias',
    text: 'Aplicação quase full TypeScript com Next.js, dashboard operacional, agenda, clientes, serviços, formulários com validação e estrutura preparada para evolução com backend.',
    tags: ['Next.js', 'TypeScript', 'React', 'Dashboard'],
    href: 'https://github.com/Juniorsilva-tech/BarberFlow',
    repo: 'https://github.com/Juniorsilva-tech/BarberFlow',
    metric: 'TypeScript',
  },
  {
    title: 'Princessmel Boutique',
    eyebrow: 'landing page premium para marca local',
    text: 'Landing page editorial para boutique, com foco em apresentação de marca, experiência mobile, hierarquia visual, conversão por WhatsApp e acabamento de interface.',
    tags: ['Next.js', 'TypeScript', 'Landing Page', 'UI/UX'],
    href: 'https://github.com/Juniorsilva-tech/Princessmel-boutique',
    repo: 'https://github.com/Juniorsilva-tech/Princessmel-boutique',
    metric: 'Conversão',
  },
  {
    title: 'MJR Forge Portfolio',
    eyebrow: 'portfólio cinematográfico',
    text: 'Portfólio em React com experiência visual cinematográfica, canvas, motion, controle de performance e storytelling para apresentar projetos e diferenciais de frontend.',
    tags: ['React', 'Framer Motion', 'GSAP', 'UI Premium'],
    href: 'https://mjr-forge-portfolio.vercel.app',
    repo: 'https://github.com/Juniorsilva-tech/mjr-forge-portfolio',
    metric: 'Motion',
  },
  {
    title: 'Jarvis Workflow Assistant',
    eyebrow: 'automação e IA aplicada',
    text: 'Projeto experimental de workflow assistido por IA para geração, QA visual, repair e automação de desenvolvimento frontend, com foco em produtividade e validação.',
    tags: ['Python', 'React', 'Automação', 'IA'],
    href: 'https://github.com/Juniorsilva-tech/Jarvis-Ia-assist',
    repo: 'https://github.com/Juniorsilva-tech/Jarvis-Ia-assist',
    metric: 'Workflow',
  },
]

const STACK = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Vite',
  'Framer Motion',
  'GSAP',
  'HTML',
  'CSS',
  'Python',
  'SQL',
  'Supabase',
  'Git/GitHub',
  'Docker',
  'Vercel',
  'UI/UX',
]

const PROCESS = [
  ['01', 'Diagnóstico', 'Entendo o negócio, público, objetivo da página e o que precisa virar contato, venda ou clareza.'],
  ['02', 'Direção visual', 'Defino hierarquia, narrativa, seções e estilo para a interface não parecer genérica.'],
  ['03', 'Construção', 'Transformo a ideia em componentes responsivos, navegação clara e experiência funcional.'],
  ['04', 'Refino', 'Ajusto espaçamento, contraste, mobile, microinterações, copy e detalhes de conversão.'],
  ['05', 'Entrega', 'Publico online, explico o uso e deixo próximos passos para evoluir o produto.'],
]

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrolled
}

function Header() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition duration-300 ${scrolled ? 'border-b border-white/10 bg-[#030305]/88 backdrop-blur-2xl' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#e8842e]/35 bg-[#e8842e]/10 text-sm font-black text-[#f6efe8] shadow-[0_0_40px_rgba(232,132,46,.16)]">MJ</span>
          <span>
            <span className="block text-sm font-semibold text-[#f6efe8]">{BRAND.name}</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-[#a89d92]">{BRAND.signature}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a89d92] transition hover:text-[#f6efe8]">{label}</a>
          ))}
        </nav>

        <button type="button" onClick={() => setOpen(value => !value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f6efe8] md:hidden">
          {open ? 'Fechar' : 'Menu'}
        </button>
      </div>

      {open && (
        <div className="mx-5 mb-4 rounded-[1.5rem] border border-white/10 bg-[#050507]/95 p-3 backdrop-blur-2xl md:hidden">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="mb-2 block rounded-2xl bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#f6efe8]">{label}</a>
          ))}
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(232,132,46,.22),transparent_30%),radial-gradient(circle_at_18%_68%,rgba(42,92,190,.18),transparent_28%),linear-gradient(180deg,#030305_0%,#080706_55%,#030305_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8842e]/50 to-transparent" />

      <div className="relative mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <p className="mb-7 text-[11px] font-bold uppercase tracking-[0.42em] text-[#e8842e]">Front-end, UI premium e produto digital</p>
          <h1 className="max-w-5xl text-[clamp(4.2rem,12vw,10rem)] font-semibold leading-[0.82] tracking-[-0.095em] text-[#f6efe8]">
            Interfaces que viram presença, confiança e contato.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#d7ccc1]">
            Desenvolvo dashboards, landing pages e experiências web modernas com React, Next.js, TypeScript, UI refinada e foco em conversão para negócios locais e produtos digitais.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#work" className="rounded-full border border-[#e8842e]/45 bg-[#e8842e]/16 px-8 py-4 text-center text-sm font-bold text-[#f6efe8] shadow-[0_0_60px_rgba(232,132,46,.2)] transition hover:bg-[#e8842e] hover:text-[#080604]">Ver projetos</a>
            <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.045] px-8 py-4 text-center text-sm font-bold text-[#f6efe8] transition hover:border-[#e8842e]/40">Chamar no WhatsApp</a>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-[#080807]/72 p-6 shadow-[0_30px_120px_rgba(0,0,0,.42)] backdrop-blur-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#e8842e]">Posicionamento</p>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#f6efe8]">{BRAND.role}</h2>
          <p className="mt-5 leading-8 text-[#d7ccc1]">
            Meu foco é criar interfaces bonitas, funcionais e publicadas online, sem vender hype: projeto claro, código organizado, mobile bem cuidado e entrega útil para o negócio.
          </p>
          <div className="mt-7 grid grid-cols-3 gap-3">
            {['Dashboards', 'Landings', 'SaaS UI'].map(item => (
              <span key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#a89d92]">{item}</span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-[1440px] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#e8842e]">Projetos principais</p>
          <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Portfólio prático, não só visual.</h2>
        </div>
        <p className="max-w-xl text-base leading-8 text-[#d7ccc1]">
          Projetos práticos em dashboards, landing pages, interfaces SaaS, automação e UI premium — criados para mostrar entrega real, produto e acabamento visual.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {PROJECTS.map(project => (
          <article key={project.title} className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#080807]/76 p-7 shadow-[0_30px_120px_rgba(0,0,0,.38)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#e8842e]/35">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 70% 20%, rgba(232,132,46,.2), transparent 30%), linear-gradient(180deg, transparent, rgba(232,132,46,.08))' }} />
            <div className="relative z-10 flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e8842e]">{project.eyebrow}</p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a89d92]">{project.metric}</span>
              </div>
              <h3 className="mt-7 text-4xl font-semibold tracking-[-0.055em] text-[#f6efe8]">{project.title}</h3>
              <p className="mt-6 leading-8 text-[#d7ccc1]">{project.text}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a89d92]">{tag}</span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <a href={project.href} target="_blank" rel="noreferrer" className="rounded-full bg-[#e8842e] px-5 py-3 text-sm font-bold text-[#080604] transition hover:bg-[#f6efe8]">Abrir projeto</a>
                <a href={project.repo} target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-bold text-[#f6efe8] transition hover:border-[#e8842e]/40">GitHub</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Stack() {
  return (
    <section id="stack" className="border-y border-white/10 bg-[#050505]/70 px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#e8842e]">Stack</p>
        <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Ferramentas que uso para construir.</h2>
        <div className="mt-12 flex flex-wrap gap-3">
          {STACK.map(item => (
            <span key={item} className="rounded-full border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-[#d7ccc1]">{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section id="process" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-8 lg:py-28">
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#e8842e]">Processo</p>
      <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Do problema à interface publicada.</h2>
      <div className="mt-14 grid gap-4 md:grid-cols-5">
        {PROCESS.map(([step, title, text]) => (
          <article key={step} className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs font-bold text-[#e8842e]">{step}</p>
            <h3 className="mt-8 text-xl font-semibold text-[#f6efe8]">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-[#a89d92]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-8 lg:py-28">
      <div className="rounded-[2.5rem] border border-[#e8842e]/20 bg-[radial-gradient(circle_at_74%_20%,rgba(232,132,46,.2),transparent_32%),rgba(8,8,8,.78)] p-8 shadow-[0_40px_160px_rgba(0,0,0,.5)] backdrop-blur-xl md:p-14">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#e8842e]">Contato</p>
        <h2 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Quer transformar uma ideia em site, landing ou dashboard?</h2>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d7ccc1]">Me chame com o contexto do projeto. Eu te ajudo a organizar escopo, prioridade e uma primeira versão viável para colocar no ar.</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-[#e8842e] px-8 py-4 text-center text-sm font-bold text-[#080604] transition hover:bg-[#f6efe8]">Começar conversa</a>
          <a href={BRAND.github} target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-8 py-4 text-center text-sm font-bold text-[#f6efe8]">Ver GitHub</a>
          <a href={BRAND.email} className="rounded-full border border-white/12 bg-white/[0.04] px-8 py-4 text-center text-sm font-bold text-[#f6efe8]">Enviar e-mail</a>
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030305] text-[#f6efe8]">
      <Header />
      <Hero />
      <Work />
      <Stack />
      <ProcessSection />
      <Contact />
    </main>
  )
}

export default App
