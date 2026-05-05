import { motion } from 'framer-motion'

export default function BrandMark({ large = false }) {
  return (
    <div className={`${large ? 'h-28 w-28 rounded-[2.2rem]' : 'h-11 w-11 rounded-2xl'} relative flex items-center justify-center overflow-hidden border border-[#5de0ff]/30 bg-[#5de0ff]/10 shadow-[0_0_70px_rgba(93,224,255,.18)]`}>
      <motion.div className="absolute inset-[-40%] bg-[conic-gradient(from_0deg,transparent,rgba(93,224,255,.8),rgba(255,255,255,.5),transparent)]" animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} />
      <div className="absolute inset-[1px] rounded-[inherit] bg-[#020610]" />
      <span className={`${large ? 'text-3xl' : 'text-sm'} relative font-black tracking-[-0.12em] text-[#5de0ff]`}>MJR</span>
    </div>
  )
}
