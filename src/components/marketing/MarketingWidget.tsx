"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

// Simple purely visual demo reacting instantly bypassing Supabase completely.
export default function MarketingWidget() {
  const [material, setMaterial] = useState<'asphalt'|'architectural'|'metal'>('architectural')
  
  const prices = {
    asphalt: 12500,
    architectural: 15400,
    metal: 28900
  }

  const currentPrice = prices[material]

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-slate-100 overflow-hidden w-full max-w-sm mx-auto flex flex-col font-sans transition-all">
      <div className="bg-slate-950 p-6 flex items-center justify-between">
        <h3 className="text-white font-extrabold text-lg tracking-tight">Instant Estimate</h3>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-inner">
           <Zap className="w-4 h-4 text-blue-400" />
        </div>
      </div>
      
      <div className="p-6 flex-1 space-y-6 bg-slate-50/50">
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-400 tracking-widest uppercase block">Select Material</label>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              { id: 'asphalt', label: 'Standard Asphalt', desc: 'Basic protection bounds' },
              { id: 'architectural', label: 'Architectural Shingles', desc: 'Premium dimensional durability' },
              { id: 'metal', label: 'Standing Seam Metal', desc: 'Lifetime warranty guarantees' }
            ].map(m => (
              <div 
                key={m.id} 
                onClick={() => setMaterial(m.id as any)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${material === m.id ? 'border-[#f97316] bg-orange-50 shadow-md scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                 <div>
                    <p className={`font-bold ${material === m.id ? 'text-[#f97316]' : 'text-slate-800'}`}>{m.label}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{m.desc}</p>
                 </div>
                 {material === m.id && <CheckCircle2 className="w-5 h-5 text-[#f97316]" />}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/80">
           <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1 flex items-center justify-center gap-2">
             AI Calculated Math <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           </p>
           <div className="flex justify-center items-end gap-1 h-20">
              <span className="text-3xl font-extrabold text-slate-300 mb-1.5">$</span>
              <AnimatePresence mode="popLayout">
                 <motion.span 
                   key={currentPrice}
                   initial={{ opacity: 0, y: -20, filter: 'blur(10px)', scale: 0.8 }}
                   animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                   exit={{ opacity: 0, y: 20, filter: 'blur(10px)', position: 'absolute', scale: 0.8 }}
                   transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                   className="text-7xl font-black tracking-tighter text-slate-900"
                 >
                   {currentPrice.toLocaleString()}
                 </motion.span>
              </AnimatePresence>
           </div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-100/50 border-t border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
         <ShieldCheck className="w-4 h-4 text-emerald-500" /> Demo Matrix
      </div>
    </div>
  )
}
