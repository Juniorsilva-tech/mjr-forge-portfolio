import { motion } from 'framer-motion'
import { usePerformanceProfile } from '../lib/performance.js'

export default function BrandMark({ large = false }) {
  const performance = usePerformanceProfile()

  return (
    <div
      className={`${large ? 'h-28 w-28 rounded-[2.2rem]' : 'h-11 w-11 rounded-2xl'} relative flex items-center justify-center overflow-hidden border border-[#c7a15a]/28 bg-[#c7a15a]/10 shadow-[0_0_56px_rgba(199,161,90,.12)]`}
    >
      {performance.motionEnabled && (
        <motion.div
          className="absolute inset-[-42%] bg-[conic-gradient(from_0deg,transparent,rgba(199,161,90,.65),rgba(244,239,231,.26),transparent)]"
          animate={{ rotate: 360 }}
          transition={{ duration: performance.key === 'high' ? 10 : 14, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="absolute inset-[1px] rounded-[inherit] bg-[#090806]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,239,231,.12),transparent_56%)]" />
      <span className={`${large ? 'text-3xl' : 'text-sm'} relative font-black tracking-[-0.12em] text-[#f4efe7]`}>
        MJR
      </span>
    </div>
  )
}
