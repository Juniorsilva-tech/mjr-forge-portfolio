import { motion } from 'framer-motion'

const mockups = [
  {
    title: 'Princessmel Editorial',
    subtitle: 'moda cristã • WhatsApp • vitrine',
    stats: [['01', 'brand'], ['24h', 'lead'], ['CTA', 'direct']],
    lines: ['Curadoria visual', 'Produtos em destaque', 'Contato sem fricção'],
  },
  {
    title: 'RetailFlow SaaS',
    subtitle: 'clientes • pedidos • pagamentos',
    stats: [['4', 'clientes'], ['3', 'pedidos'], ['local', 'storage']],
    lines: ['Dashboard operacional', 'Pagamentos e pedidos', 'Mapa regional'],
  },
  {
    title: 'Jarvis Workflow',
    subtitle: 'generate • QA • repair',
    stats: [['90', 'score'], ['6', 'shots'], ['PASS', 'build']],
    lines: ['Planner cria direção', 'QA valida interface', 'Repair corrige falhas'],
  },
]

export default function ProjectMockup({ index }) {
  const item = mockups[Math.min(index, mockups.length - 1)]

  return (
    <motion.div
      initial={{ opacity: 0, y: 45, rotateX: 10, scale: 0.92, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.05, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12, rotateX: 4, rotateY: -5, scale: 1.025 }}
      className="relative min-h-[310px] overflow-hidden rounded-[2.2rem] border border-[#f4efe7]/10 bg-[#050505]/80 p-4 shadow-[0_45px_140px_rgba(0,0,0,.62)] [transform-style:preserve-3d]"
    >
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#c7a15a]/15 blur-[70px]" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#9b5e32]/12 blur-[90px]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(244,239,231,.08),transparent_36%,rgba(199,161,90,.08))]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(0deg,rgba(244,239,231,.35)_0px,rgba(244,239,231,.35)_1px,transparent_1px,transparent_6px)]" />

      <div className="relative rounded-[1.7rem] border border-[#f4efe7]/10 bg-[#0b0a08]/78 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-[#f4efe7]/10 pb-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c7a15a]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f4efe7]/35" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#9b5e32]/80" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c7a15a]">artifact</p>
        </div>

        <div className="mt-5">
          <p className="text-2xl font-semibold tracking-[-0.06em] text-[#f4efe7]">{item.title}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a89f91]">{item.subtitle}</p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {item.stats.map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-[#f4efe7]/10 bg-[#050505]/55 p-3 text-center">
              <p className="text-lg font-semibold text-[#f4efe7]">{value}</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#c7a15a]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {item.lines.map((line, lineIndex) => (
            <motion.div
              key={line}
              initial={{ width: '40%' }}
              whileInView={{ width: `${72 + lineIndex * 8}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: lineIndex * 0.1 }}
              className="rounded-full bg-[#c7a15a]/10 p-[1px]"
            >
              <div className="rounded-full bg-[#050505]/70 px-3 py-2 text-xs font-semibold text-[#d8d0c3]">{line}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[0.7fr_1.3fr] gap-3">
          <div className="h-28 rounded-2xl border border-[#f4efe7]/10 bg-[radial-gradient(circle_at_55%_45%,rgba(199,161,90,.22),transparent_42%)]" />
          <div className="space-y-2">
            <div className="h-9 rounded-2xl bg-[#f4efe7]/10" />
            <div className="h-3 w-5/6 rounded-full bg-[#f4efe7]/12" />
            <div className="h-3 w-3/5 rounded-full bg-[#f4efe7]/8" />
            <div className="mt-4 h-8 w-28 rounded-full bg-[#c7a15a]" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
