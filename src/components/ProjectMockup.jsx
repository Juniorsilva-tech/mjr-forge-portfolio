import { motion } from 'framer-motion'

export default function ProjectMockup({ index }) {
  const titles = ['Jarvis Command', 'Retail Dashboard', 'Landing Demo']
  const subtitles = ['Generate → QA → Repair', 'Financeiro • Clientes • Pix', 'Premium UI • CTA • Mobile']

  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-[1.8rem] border border-[#5de0ff]/25 bg-[#020b13]/90 p-4 shadow-[0_0_90px_rgba(93,224,255,.14)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(93,224,255,.24),transparent_58%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.08),transparent_38%,rgba(140,90,255,.10))]" />
      <div className="relative flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400/80" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-300/80" /><span className="h-2.5 w-2.5 rounded-full bg-[#5de0ff]" /></div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#5de0ff]">mockup</p>
      </div>
      <div className="relative mt-4"><p className="text-xl font-black tracking-[-0.04em] text-white">{titles[index]}</p><p className="mt-1 text-xs font-bold text-[#aeefff]">{subtitles[index]}</p></div>
      {index === 0 && <div className="relative mt-5 space-y-3"><div className="grid grid-cols-3 gap-2">{[['90','score'],['6','shots'],['PASS','build']].map(([v,l])=><div key={l} className="rounded-2xl border border-cyan-200/15 bg-black/35 p-3 text-center"><p className="text-lg font-black text-white">{v}</p><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#5de0ff]">{l}</p></div>)}</div>{['Planner criou arquitetura','QA validou responsividade','PatchExecutor reparou falha'].map((item,i)=><motion.div key={item} initial={{width:'38%'}} whileInView={{width:`${74+i*7}%`}} viewport={{once:true}} transition={{duration:.9,delay:i*.12}} className="rounded-full bg-[#5de0ff]/10 p-[1px]"><div className="rounded-full bg-[#04161f] px-3 py-2 text-xs font-bold text-[#dffcff]">{item}</div></motion.div>)}</div>}
      {index === 1 && <div className="relative mt-5 grid grid-cols-2 gap-2">{[['12k','Vendas'],['48','Clientes'],['OK','Pix'],['4','Cards']].map(([v,l])=><div key={l} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3"><p className="text-lg font-black text-white">{v}</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#9bc7c1]">{l}</p></div>)}<div className="col-span-2 mt-1 h-16 rounded-2xl border border-cyan-200/10 bg-[linear-gradient(90deg,rgba(93,224,255,.28),rgba(255,120,214,.13),rgba(255,186,91,.18))]" /></div>}
      {index === 2 && <div className="relative mt-5 space-y-3"><div className="h-9 rounded-2xl bg-gradient-to-r from-[#5de0ff]/40 via-white/20 to-[#ff78d6]/25" /><div className="h-3 w-5/6 rounded-full bg-white/18" /><div className="h-3 w-3/5 rounded-full bg-white/12" /><div className="grid grid-cols-3 gap-2 pt-2"><div className="h-20 rounded-2xl border border-white/10 bg-white/[0.05]" /><div className="h-20 rounded-2xl border border-white/10 bg-white/[0.07]" /><div className="h-20 rounded-2xl border border-white/10 bg-white/[0.05]" /></div><div className="flex gap-2 pt-1"><div className="h-9 w-24 rounded-full bg-[#5de0ff]" /><div className="h-9 w-20 rounded-full border border-white/20" /></div></div>}
    </div>
  )
}
