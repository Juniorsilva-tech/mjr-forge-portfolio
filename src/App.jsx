import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

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
  ['Sobre', '#about'],
  ['Stack', '#stack'],
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
    text: 'Portfólio em React com experiência visual, motion, controle de performance e storytelling para apresentar projetos e diferenciais de frontend.',
    tags: ['React', 'Motion', 'GSAP', 'UI Premium'],
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

const STACK = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vite', 'Framer Motion', 'GSAP', 'HTML', 'CSS', 'Python', 'SQL', 'Supabase', 'Git/GitHub', 'Docker', 'Vercel', 'UI/UX']

const PROCESS = [
  ['01', 'Diagnóstico', 'Entendo o negócio, público, objetivo da página e o que precisa virar contato, venda ou clareza.'],
  ['02', 'Direção visual', 'Defino hierarquia, narrativa, seções e estilo para a interface não parecer genérica.'],
  ['03', 'Construção', 'Transformo a ideia em componentes responsivos, navegação clara e experiência funcional.'],
  ['04', 'Refino', 'Ajusto espaçamento, contraste, mobile, microinterações, copy e detalhes de conversão.'],
  ['05', 'Entrega', 'Publico online, explico o uso e deixo próximos passos para evoluir o produto.'],
]

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])
  return reduced
}

function useViewportMode() {
  const [viewport, setViewport] = useState({ isMobile: false, isCoarse: false })
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)')
    const coarse = window.matchMedia('(pointer: coarse)')
    let frame = 0
    const sync = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        setViewport({ isMobile: mobile.matches, isCoarse: coarse.matches })
        ScrollTrigger.refresh()
      })
    }
    sync()
    mobile.addEventListener('change', sync)
    coarse.addEventListener('change', sync)
    window.addEventListener('resize', sync, { passive: true })
    window.addEventListener('orientationchange', sync)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      mobile.removeEventListener('change', sync)
      coarse.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
      window.removeEventListener('orientationchange', sync)
    }
  }, [])
  return viewport
}

function useLenisScroll(reducedMotion) {
  useEffect(() => {
    if (reducedMotion) return undefined
    if (window.__mjrLenisRuntime) {
      const previous = window.__mjrLenisRuntime
      previous.lenis?.off('scroll', previous.update)
      gsap.ticker.remove(previous.raf)
      previous.lenis?.destroy()
      window.__mjrLenisRuntime = null
    }
    const lenis = new Lenis({ duration: 1.08, easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)), smoothWheel: true, syncTouch: false, wheelMultiplier: 0.88 })
    const update = () => ScrollTrigger.update()
    const raf = time => lenis.raf(time * 1000)
    lenis.on('scroll', update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    window.__mjrLenisRuntime = { lenis, update, raf }
    ScrollTrigger.refresh()
    return () => {
      lenis.off('scroll', update)
      gsap.ticker.remove(raf)
      lenis.destroy()
      if (window.__mjrLenisRuntime?.lenis === lenis) window.__mjrLenisRuntime = null
      ScrollTrigger.update()
    }
  }, [reducedMotion])
}

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

function useForgeMotion(rootRef, reducedMotion, isMobile) {
  useEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined
    const cleanupFns = []
    const ctx = gsap.context(() => {
      gsap.set('.reveal-in', { autoAlpha: 0, y: 34, scale: 0.985 })
      gsap.set('.hero-title-pop', { autoAlpha: 0, y: 40, letterSpacing: '-0.04em' })
      gsap.set('.hero-copy-line', { autoAlpha: 0, y: 22 })
      gsap.set('.hero-actions', { autoAlpha: 0, y: 20 })
      gsap.set('.orbital-chip', { autoAlpha: 0, scale: 0.94, y: 22 })
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.hero-title-pop', { autoAlpha: 1, y: 0, letterSpacing: '-0.08em', duration: 1.2, delay: 0.22 })
        .to('.hero-copy-line', { autoAlpha: 1, y: 0, duration: 0.86, stagger: 0.12 }, '-=0.52')
        .to('.hero-actions', { autoAlpha: 1, y: 0, duration: 0.82 }, '-=0.42')
        .to('.orbital-chip', { autoAlpha: 1, scale: 1, y: 0, duration: 0.74, stagger: 0.08 }, '-=0.46')
      gsap.utils.toArray('.reveal-in').forEach(element => {
        gsap.to(element, { autoAlpha: 1, y: 0, scale: 1, duration: 0.96, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 86%', once: true } })
      })
      gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.fromTo(card, { y: 52, autoAlpha: 0, scale: 0.965 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.98, delay: index * 0.04, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
      })
      gsap.to('.forge-lens-core', { scale: 1.1, yPercent: -5, ease: 'power3.inOut', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: 1.3 } })
      gsap.to('.forge-ring-a', { rotation: 12, xPercent: 5, yPercent: -8, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: 1.2 } })
      gsap.to('.forge-ring-b', { rotation: -10, xPercent: -4, yPercent: 7, ease: 'none', scrollTrigger: { trigger: '#work', start: 'top bottom', end: 'bottom top', scrub: 1.5 } })
      gsap.to('.forge-glow-a', { yPercent: -10, xPercent: 7, scale: 1.08, ease: 'power3.inOut', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: 1.2 } })
      gsap.to('.forge-glow-b', { yPercent: 12, xPercent: -6, scale: 1.12, ease: 'power3.inOut', scrollTrigger: { trigger: '#work', start: 'top bottom', end: 'bottom top', scrub: 1.4 } })
      gsap.utils.toArray('.float-node').forEach((node, index) => {
        gsap.to(node, { y: index % 2 === 0 ? -14 : 16, x: index % 2 === 0 ? 8 : -10, rotation: index % 2 === 0 ? -3 : 4, duration: 3.8 + index * 0.45, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      })
      if (!isMobile) {
        gsap.utils.toArray('.magnetic').forEach(element => {
          const move = event => {
            const rect = element.getBoundingClientRect()
            const x = event.clientX - rect.left - rect.width / 2
            const y = event.clientY - rect.top - rect.height / 2
            gsap.to(element, { x: x * 0.13, y: y * 0.18, duration: 0.45, ease: 'power3.out' })
          }
          const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.62, ease: 'elastic.out(1, 0.45)' })
          element.addEventListener('mousemove', move)
          element.addEventListener('mouseleave', leave)
          cleanupFns.push(() => {
            element.removeEventListener('mousemove', move)
            element.removeEventListener('mouseleave', leave)
          })
        })
      }
    }, rootRef)
    return () => {
      cleanupFns.forEach(fn => fn())
      ctx.revert()
    }
  }, [rootRef, reducedMotion, isMobile])
}

function ForgeAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030305]" aria-hidden="true">
      <div className="forge-lens-core absolute left-1/2 top-[8vh] h-[82vh] w-[132vw] -translate-x-1/2 rounded-[50%] border border-white/[0.04] bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.05)_0%,rgba(255,255,255,.015)_12%,rgba(232,132,46,.09)_20%,rgba(9,10,18,.12)_34%,transparent_68%)] blur-[2px]" />
      <div className="forge-ring-a absolute left-1/2 top-[4vh] h-[92vh] w-[148vw] -translate-x-1/2 rounded-[50%] border border-[#e8842e]/10" />
      <div className="forge-ring-b absolute left-1/2 top-[14vh] h-[68vh] w-[116vw] -translate-x-1/2 rounded-[50%] border border-[#4d6bba]/10" />
      <div className="forge-glow-a absolute -right-[28vw] top-[-18vh] h-[72vh] w-[86vw] rounded-full bg-[radial-gradient(circle,rgba(232,132,46,.28)_0%,rgba(126,28,11,.14)_34%,transparent_66%)] blur-3xl" />
      <div className="forge-glow-b absolute -left-[24vw] top-[42vh] h-[70vh] w-[78vw] rounded-full bg-[radial-gradient(circle,rgba(32,74,150,.20)_0%,rgba(232,132,46,.08)_34%,transparent_68%)] blur-3xl" />
      <div className="absolute inset-0 opacity-[0.16] mix-blend-screen [background-image:radial-gradient(circle_at_16%_22%,rgba(232,132,46,.16),transparent_18%),radial-gradient(circle_at_84%_18%,rgba(255,116,32,.14),transparent_18%),radial-gradient(circle_at_52%_76%,rgba(42,92,190,.14),transparent_22%),radial-gradient(circle_at_22%_70%,rgba(255,255,255,.08),transparent_14%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(112deg,rgba(255,255,255,.18)_0_1px,transparent_1px_17px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.18)_42%,rgba(0,0,0,.74)_100%)]" />
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition duration-300 ${scrolled ? 'border-b border-white/10 bg-[#030305]/90 backdrop-blur-2xl' : 'bg-[#030305]/48 backdrop-blur-xl'}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="magnetic group flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#e8842e]/35 bg-[#e8842e]/10 text-sm font-black text-[#f6efe8] shadow-[0_0_40px_rgba(232,132,46,.16)]">MJ</span><span><span className="block text-sm font-semibold text-[#f6efe8]">{BRAND.name}</span><span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-[#a89d92]">{BRAND.signature}</span></span></a>
        <nav className="hidden items-center gap-7 md:flex">{NAV.map(([label, href]) => <a key={href} href={href} className="magnetic text-xs font-semibold uppercase tracking-[0.18em] text-[#a89d92] transition hover:text-[#f6efe8]">{label}</a>)}</nav>
        <button type="button" onClick={() => setOpen(value => !value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f6efe8] md:hidden">{open ? 'Fechar' : 'Menu'}</button>
      </div>
      {open && <div className="mx-5 mb-4 rounded-[1.5rem] border border-white/10 bg-[#050507]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,.55)] backdrop-blur-2xl md:hidden">{NAV.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="mb-2 block rounded-2xl bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#f6efe8]">{label}</a>)}</div>}
    </header>
  )
}

function HeroOrbitalStage() {
  return (
    <div className="relative min-h-[420px] lg:min-h-[520px]">
      <div className="absolute left-1/2 top-1/2 h-[88%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.05),rgba(255,255,255,.01)_14%,rgba(232,132,46,.12)_24%,rgba(10,10,16,.5)_48%,rgba(3,3,5,.1)_70%,transparent_86%)] shadow-[0_40px_180px_rgba(0,0,0,.4)] blur-[1px]" />
      <div className="float-node absolute left-[8%] top-[18%] orbital-chip rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,.24)] backdrop-blur-xl"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a89d92]">visual</p><p className="mt-2 text-lg font-semibold text-[#f6efe8]">UI Premium</p></div>
      <div className="float-node absolute right-[2%] top-[12%] orbital-chip rounded-[1.4rem] border border-[#e8842e]/25 bg-[#140f0c]/72 px-5 py-4 shadow-[0_20px_60px_rgba(232,132,46,.12)] backdrop-blur-xl"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e8842e]">motion</p><p className="mt-2 text-lg font-semibold text-[#f6efe8]">GSAP + Lenis</p></div>
      <div className="float-node absolute bottom-[16%] left-[4%] orbital-chip rounded-[1.4rem] border border-white/10 bg-[#09090b]/76 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,.3)] backdrop-blur-xl"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a89d92]">foco</p><p className="mt-2 text-lg font-semibold text-[#f6efe8]">Produto real</p></div>
      <div className="float-node absolute bottom-[10%] right-[8%] orbital-chip rounded-[1.4rem] border border-[#4d6bba]/25 bg-[#09101a]/72 px-5 py-4 shadow-[0_20px_60px_rgba(43,86,170,.12)] backdrop-blur-xl"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8da5e8]">stack</p><p className="mt-2 text-lg font-semibold text-[#f6efe8]">React / Next</p></div>
      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e8842e]/25 bg-[radial-gradient(circle,rgba(232,132,46,.18),rgba(232,132,46,.04)_38%,rgba(32,74,150,.05)_56%,transparent_72%)] shadow-[0_0_120px_rgba(232,132,46,.2)] backdrop-blur-md md:h-64 md:w-64"><div className="absolute inset-[14%] rounded-full border border-white/10" /><div className="absolute inset-[26%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.16),rgba(255,255,255,0)_62%)] blur-2xl" /><div className="absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" /><div className="absolute left-1/2 top-1/2 h-px w-[180%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#e8842e]/55 to-transparent" /></div>
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="relative z-10 overflow-hidden px-5 pb-12 pt-32 lg:px-8 lg:pb-24 lg:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8842e]/50 to-transparent" />
      <div className="relative mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.02fr_.98fr] lg:items-center"><div><p className="hero-copy-line mb-6 text-[11px] font-bold uppercase tracking-[0.34em] text-[#e8842e] md:tracking-[0.42em]">Front-end, UI premium e produto digital</p><h1 className="hero-title-pop max-w-5xl text-[clamp(3.45rem,17vw,9.6rem)] font-semibold leading-[0.86] tracking-[-0.08em] text-[#f6efe8] md:tracking-[-0.095em]">Interfaces que viram presença, confiança e contato.</h1><p className="hero-copy-line mt-7 max-w-2xl text-base leading-8 text-[#d7ccc1] md:text-lg">Sou o Maurício. Construo dashboards, landing pages e experiências web modernas com React, Next.js, TypeScript e foco real em conversão para negócios locais e produtos digitais.</p><p className="hero-copy-line mt-4 max-w-2xl text-base leading-8 text-[#a89d92]">Direção espacial: profundidade, flutuação, luz térmica e superfícies com blur, sem repetir o bloco de sobre mim logo na entrada.</p><div className="hero-actions mt-9 flex flex-col gap-3 sm:flex-row"><a href="#work" className="magnetic rounded-full border border-[#e8842e]/45 bg-[#e8842e]/16 px-8 py-4 text-center text-sm font-bold text-[#f6efe8] shadow-[0_0_60px_rgba(232,132,46,.16)] transition hover:bg-[#e8842e] hover:text-[#080604]">Ver projetos</a><a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="magnetic rounded-full border border-white/12 bg-white/[0.045] px-8 py-4 text-center text-sm font-bold text-[#f6efe8] transition hover:border-[#e8842e]/40">Chamar no WhatsApp</a></div></div><HeroOrbitalStage /></div>
    </section>
  )
}

function Work({ onProjectOpen }) {
  return <section id="work" className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 lg:px-8 lg:py-28"><div className="reveal-in mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[#e8842e] md:tracking-[0.42em]">Projetos principais</p><h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Portfólio prático, não só visual.</h2></div><p className="max-w-xl text-base leading-8 text-[#d7ccc1]">Cards com abertura em modal para parecer mais produto premium e menos lista comum.</p></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{PROJECTS.map(project => <article key={project.title} className="project-card group relative flex min-h-[430px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#080807]/76 p-6 shadow-[0_30px_120px_rgba(0,0,0,.32)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#e8842e]/35 md:p-7"><div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 70% 20%, rgba(232,132,46,.18), transparent 30%), linear-gradient(180deg, transparent, rgba(232,132,46,.07))' }} /><div className="relative z-10 flex flex-1 flex-col"><div className="flex items-start justify-between gap-4"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e8842e]">{project.eyebrow}</p><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a89d92]">{project.metric}</span></div><h3 className="mt-7 text-3xl font-semibold tracking-[-0.055em] text-[#f6efe8] md:text-4xl">{project.title}</h3><p className="mt-5 leading-8 text-[#d7ccc1]">{project.text}</p><div className="mt-7 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a89d92]">{tag}</span>)}</div><div className="mt-auto flex flex-wrap gap-3 pt-8"><button type="button" onClick={() => onProjectOpen(project)} className="magnetic rounded-full bg-[#e8842e] px-5 py-3 text-sm font-bold text-[#080604] transition hover:bg-[#f6efe8]">Ver detalhe</button><a href={project.repo} target="_blank" rel="noreferrer" className="magnetic rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-bold text-[#f6efe8] transition hover:border-[#e8842e]/40">GitHub</a></div></div></article>)}</div></section>
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined
    const onKey = event => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [project, onClose])
  if (!project) return null
  return <div className="fixed inset-0 z-[90] grid place-items-center px-4 py-8"><button type="button" aria-label="Fechar modal" onClick={onClose} className="absolute inset-0 bg-black/72 backdrop-blur-xl" /><section className="relative max-h-[86vh] w-full max-w-4xl overflow-auto rounded-[2.2rem] border border-white/10 bg-[#070707]/95 p-6 shadow-[0_50px_180px_rgba(0,0,0,.74)] md:p-10"><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(232,132,46,.18),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(42,92,190,.12),transparent_28%)]" /><div className="flex items-start justify-between gap-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#e8842e]">{project.eyebrow}</p><h3 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#f6efe8] md:text-6xl">{project.title}</h3></div><button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f6efe8]">Fechar</button></div><p className="mt-7 max-w-3xl text-lg leading-9 text-[#d7ccc1]">{project.text}</p><div className="mt-8 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#a89d92]">{tag}</span>)}</div><div className="mt-10 grid gap-4 md:grid-cols-3"><div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e8842e]">Tipo</p><p className="mt-3 text-2xl font-semibold text-[#f6efe8]">{project.metric}</p></div><div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e8842e]">Entrega</p><p className="mt-3 text-2xl font-semibold text-[#f6efe8]">Interface real</p></div><div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e8842e]">Foco</p><p className="mt-3 text-2xl font-semibold text-[#f6efe8]">Produto</p></div></div><div className="mt-10 flex flex-col gap-3 sm:flex-row"><a href={project.href} target="_blank" rel="noreferrer" className="rounded-full bg-[#e8842e] px-7 py-4 text-center text-sm font-bold text-[#080604] transition hover:bg-[#f6efe8]">Abrir projeto</a><a href={project.repo} target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-7 py-4 text-center text-sm font-bold text-[#f6efe8]">Ver código</a></div></section></div>
}

function About() {
  return <section id="about" className="relative z-10 border-y border-white/10 bg-[#050505]/70 px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-center"><div className="reveal-in rounded-[2rem] border border-white/10 bg-[#080807]/62 p-4 shadow-[0_34px_130px_rgba(0,0,0,.34)] backdrop-blur-xl md:p-5"><div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(232,132,46,.22),transparent_32%),linear-gradient(180deg,#19120d,#050505)]"><img src="/forge-portrait.jpg" alt="Maurício Silva Junior" className="h-full w-full object-cover object-center" /></div></div><div className="reveal-in"><p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#e8842e]">Sobre mim</p><h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Minha foto fica aqui, onde faz sentido.</h2><p className="mt-7 max-w-3xl text-lg leading-9 text-[#d7ccc1]">Estou no começo da carreira formal, mas já venho criando projetos reais e autorais com foco em frontend moderno. Meu diferencial hoje é unir interface bonita, organização visual, velocidade de execução e vontade de resolver problema de negócio.</p><p className="mt-5 max-w-3xl text-lg leading-9 text-[#d7ccc1]">Para clientes locais, eu transformo uma ideia em uma página clara: apresentação, prova visual, WhatsApp, perguntas frequentes, mapa, fotos e estrutura pensada para gerar contato.</p><div className="mt-8 flex flex-wrap gap-3">{['Angra dos Reis', 'React / Next.js', 'UI Premium', 'Dashboards', 'Landings', 'Produto'].map(item => <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-[#d7ccc1]">{item}</span>)}</div></div></div></section>
}

function Stack() { return <section id="stack" className="relative z-10 px-5 py-16 lg:px-8 lg:py-24"><div className="reveal-in mx-auto max-w-[1440px]"><p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#e8842e]">Stack</p><h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Ferramentas que uso para construir.</h2><div className="mt-10 flex flex-wrap gap-3">{STACK.map(item => <span key={item} className="rounded-full border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-[#d7ccc1] transition hover:border-[#e8842e]/35 hover:text-[#f6efe8]">{item}</span>)}</div></div></section> }
function ProcessSection() { return <section id="process" className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 lg:px-8 lg:py-24"><div className="reveal-in"><p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#e8842e]">Processo</p><h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Do problema à interface publicada.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-5">{PROCESS.map(([step, title, text]) => <article key={step} className="reveal-in rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#e8842e]/35 hover:-translate-y-1"><p className="text-xs font-bold text-[#e8842e]">{step}</p><h3 className="mt-8 text-xl font-semibold text-[#f6efe8]">{title}</h3><p className="mt-4 text-sm leading-7 text-[#a89d92]">{text}</p></article>)}</div></section> }
function Contact() { return <section id="contact" className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 lg:px-8 lg:py-28"><div className="reveal-in rounded-[2.5rem] border border-[#e8842e]/20 bg-[radial-gradient(circle_at_74%_20%,rgba(232,132,46,.18),transparent_32%),rgba(8,8,8,.78)] p-7 shadow-[0_40px_160px_rgba(0,0,0,.42)] backdrop-blur-xl md:p-14"><p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#e8842e]">Contato</p><h2 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#f6efe8] md:text-7xl">Quer transformar uma ideia em site, landing ou dashboard?</h2><p className="mt-7 max-w-2xl text-lg leading-8 text-[#d7ccc1]">Me chame com o contexto do projeto. Eu te ajudo a organizar escopo, prioridade e uma primeira versão viável para colocar no ar.</p><div className="mt-10 flex flex-col gap-4 sm:flex-row"><a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="magnetic rounded-full bg-[#e8842e] px-8 py-4 text-center text-sm font-bold text-[#080604] transition hover:bg-[#f6efe8]">Começar conversa</a><a href={BRAND.github} target="_blank" rel="noreferrer" className="magnetic rounded-full border border-white/12 bg-white/[0.04] px-8 py-4 text-center text-sm font-bold text-[#f6efe8]">Ver GitHub</a><a href={BRAND.email} className="magnetic rounded-full border border-white/12 bg-white/[0.04] px-8 py-4 text-center text-sm font-bold text-[#f6efe8]">Enviar e-mail</a></div></div></section> }

function App() {
  const rootRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { isMobile, isCoarse } = useViewportMode()
  const [selectedProject, setSelectedProject] = useState(null)
  useLenisScroll(reducedMotion)
  useForgeMotion(rootRef, reducedMotion, isMobile)
  useEffect(() => {
    document.documentElement.dataset.cursorMode = !reducedMotion && !isCoarse ? 'custom' : 'native'
    return () => delete document.documentElement.dataset.cursorMode
  }, [reducedMotion, isCoarse])
  return <main ref={rootRef} className="relative min-h-screen overflow-x-hidden bg-[#030305] text-[#f6efe8]"><ForgeAtmosphere /><div className="relative z-10"><Header /><Hero /><Work onProjectOpen={setSelectedProject} /><About /><Stack /><ProcessSection /><Contact /></div><ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} /></main>
}

export default App
