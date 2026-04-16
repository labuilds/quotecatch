"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react"
import RoofingWidget from "@/components/RoofingWidget"
import { useUserTier } from "@/components/UserTierProvider"
import { generateQuickEdit, updateCalculatorConfig } from "@/app/actions/calculator"
import { PricingConfig } from "@/lib/pricingEngine"
import Link from "next/link"

export default function AICalculatorEditor({ calculator }: { calculator: any }) {
  const router = useRouter()
  const { isPro } = useUserTier()

  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [diffConfig, setDiffConfig] = useState<PricingConfig | null>(null)
  const [stepToggles, setStepToggles] = useState({
    buildingType: calculator.config_json.steps?.buildingType ?? true,
    currentMaterial: calculator.config_json.steps?.currentMaterial ?? true,
    desiredMaterial: calculator.config_json.steps?.desiredMaterial ?? true,
    timeline: calculator.config_json.steps?.timeline ?? false,
    financing: calculator.config_json.steps?.financing ?? false,
  })

  const originalConfig = calculator.config_json

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    try {
      const result = await generateQuickEdit(originalConfig, prompt)
      setDiffConfig(result)
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleConfirmEdit = async () => {
    setIsSaving(true)
    try {
      const finalConfig = {
        ...(diffConfig || originalConfig),
        steps: stepToggles
      }
      await updateCalculatorConfig(calculator.id, finalConfig)
      router.push('/calculators')
      router.refresh()
    } catch(err) {
      console.error(err)
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-[calc(100%+4rem)] -m-8 font-sans">
      <div className="w-1/2 p-10 overflow-y-auto border-r bg-white flex flex-col pt-10">
        
        <Link href="/calculators" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors mb-8">
           <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-extrabold text-xs uppercase tracking-widest mb-4">
             Editing Engine: {calculator.name}
          </div>
          <h1 className="text-5xl font-black flex items-center gap-3 text-slate-900 tracking-tighter">
            Modify Physics.
          </h1>
          <p className="text-slate-500 mt-4 text-xl font-medium leading-relaxed max-w-md">
            Prompt your desired logic changes below. The AI will compile a differential schema instantly.
          </p>
        </div>

        <div className="space-y-6 flex-1 flex flex-col max-w-2xl">
          <div className="relative group flex-1 flex flex-col">
            <div className="absolute -inset-1.5 bg-gradient-to-br from-orange-400 to-amber-500 rounded-[2rem] blur-xl opacity-10 group-hover:opacity-20 transition duration-700"></div>
            <div className="relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-3 flex flex-col flex-1 focus-within:border-orange-200 focus-within:ring-4 focus-within:ring-orange-50/50 transition-all text-left">
              <Textarea 
                placeholder="e.g. Increase Metal costs by $2 and wipe baseline transportation fees entirely..."
                className="flex-1 min-h-[220px] resize-none border-0 shadow-none focus-visible:ring-0 px-5 py-5 text-[1.35rem] font-medium text-slate-800 placeholder:text-slate-300 bg-transparent leading-relaxed"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (!diffConfig) handleGenerate()
                  }
                }}
                disabled={!!diffConfig}
              />
              {!diffConfig ? (
                <div className="flex justify-between items-center px-5 pt-4 pb-3 border-t border-slate-100/50 mt-2 bg-gradient-to-b from-transparent to-white/50 rounded-b-2xl">
                  <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">SHIFT + ENTER for new line</span>
                  <Button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-slate-900 hover:bg-black text-white font-extrabold rounded-2xl px-8 h-14 shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:-translate-y-1 transition-all flex items-center text-lg"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Sparkles className="w-5 h-5 mr-3 text-orange-400" />}
                    Diff Schema
                  </Button>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border-t border-slate-100/80 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex justify-between items-center pb-5 border-b border-slate-200/60 mb-5">
                      <p className="font-extrabold text-slate-800 text-lg">Proposed Mathematical Diffs</p>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={() => setDiffConfig(null)} className="h-10 px-5 text-slate-500 font-bold bg-white rounded-xl shadow-sm hover:bg-slate-100">Discard</Button>
                        <Button size="sm" className="h-10 px-7 bg-emerald-500 hover:bg-emerald-600 font-extrabold text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] rounded-xl transition-transform hover:scale-105" onClick={handleConfirmEdit} disabled={isSaving}>
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />} Commit Live
                        </Button>
                      </div>
                   </div>
                   <div className="flex flex-wrap gap-3 font-mono text-sm">
                      {/* Diff Readouts */}
                      {originalConfig.materials.metal !== diffConfig.materials.metal && (
                        <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-slate-400 text-[10px] block uppercase tracking-widest font-sans font-extrabold mb-1">Metal Base</span>
                          <div className="flex items-center gap-3">
                             <span className="text-red-400/80 line-through text-lg font-bold">${originalConfig.materials.metal.toFixed(2)}</span>
                             <ArrowRight className="w-4 h-4 text-slate-300" />
                             <span className="text-emerald-500 font-black text-xl">${diffConfig.materials.metal.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      {originalConfig.materials.asphalt !== diffConfig.materials.asphalt && (
                        <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-slate-400 text-[10px] block uppercase tracking-widest font-sans font-extrabold mb-1">Asphalt</span>
                          <div className="flex items-center gap-3">
                             <span className="text-red-400/80 line-through text-lg font-bold">${originalConfig.materials.asphalt.toFixed(2)}</span>
                             <ArrowRight className="w-4 h-4 text-slate-300" />
                             <span className="text-emerald-500 font-black text-xl">${diffConfig.materials.asphalt.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      {originalConfig.materials.architectural !== diffConfig.materials.architectural && (
                        <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-slate-400 text-[10px] block uppercase tracking-widest font-sans font-extrabold mb-1">Architectural</span>
                          <div className="flex items-center gap-3">
                             <span className="text-red-400/80 line-through text-lg font-bold">${originalConfig.materials.architectural.toFixed(2)}</span>
                             <ArrowRight className="w-4 h-4 text-slate-300" />
                             <span className="text-emerald-500 font-black text-xl">${diffConfig.materials.architectural.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      {originalConfig.flat_fees !== diffConfig.flat_fees && (
                         <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-slate-400 text-[10px] block uppercase tracking-widest font-sans font-extrabold mb-1">Flat Fees</span>
                          <div className="flex items-center gap-3">
                             <span className="text-red-400/80 line-through text-lg font-bold">${originalConfig.flat_fees.toFixed(2)}</span>
                             <ArrowRight className="w-4 h-4 text-slate-300" />
                             <span className="text-emerald-500 font-black text-xl">${diffConfig.flat_fees.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      {/* Empty state fallback if no major differences were detected */}
                      {JSON.stringify(originalConfig) === JSON.stringify(diffConfig) && (
                         <div className="w-full text-center py-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 font-sans font-semibold">
                            AI analyzed parameters exactly matched baseline engine architecture natively.
                         </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lead Capture Settings Section */}
        <div className="mt-8 pt-8 border-t border-slate-100 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
             <div className="space-y-1">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Question Sequence</h3>
               <p className="text-slate-400 text-sm font-medium">Toggle optional lead-capture questions.</p>
             </div>
             {!diffConfig ? (
               <Button 
                 onClick={handleConfirmEdit} 
                 disabled={isSaving} 
                 className="bg-emerald-500 hover:bg-emerald-600 text-white font-black h-11 px-6 rounded-xl shadow-[0_4px_14px_rgba(16,185,129,0.2)] transition-all active:scale-95"
               >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                 Save Sequence
               </Button>
             ) : (
               <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Pro Feature</div>
             )}
          </div>

          <div className="grid grid-cols-1 gap-3">
             {[
               { id: 'buildingType', label: 'Building Type', sub: 'Ask if Residential vs Commercial', icon: '🏢' },
               { id: 'currentMaterial', label: 'Current Material', sub: 'What is currently on their roof', icon: '🏠' },
               { id: 'desiredMaterial', label: 'Desired Material', sub: 'What material they want to switch to', icon: '✨' },
               { id: 'timeline', label: 'Project Timeline', sub: 'How soon they want to start', icon: '📅' },
               { id: 'financing', label: 'Financing Interest', sub: 'Ask if they need monthly payments', icon: '💰' }
             ].map((item) => {
               const active = stepToggles[item.id as keyof typeof stepToggles]
               return (
                 <button 
                   key={item.id}
                   onClick={() => setStepToggles(prev => ({ ...prev, [item.id]: !active }))}
                   className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${active ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-100 bg-white opacity-60 grayscale"}`}
                 >
                   <div className="flex items-center gap-4 text-left">
                     <span className="text-2xl">{item.icon}</span>
                     <div>
                       <p className="font-bold text-slate-900">{item.label}</p>
                       <p className="text-xs text-slate-500 font-medium">{item.sub}</p>
                     </div>
                   </div>
                   <div className={`w-12 h-6 rounded-full relative transition-colors ${active ? "bg-red-700" : "bg-slate-200"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? "left-7" : "left-1"}`} />
                   </div>
                 </button>
               )
             })}
          </div>
        </div>
      </div>

      {/* Right Live Preview Pane */}
      <div className="w-1/2 bg-slate-100/50 border-l border-slate-200 flex flex-col items-center justify-center p-8 overflow-y-auto relative shadow-inner">
         <div className="absolute top-6 left-6 flex gap-3 z-20">
           <div className="bg-white/90 backdrop-blur-xl text-xs font-bold uppercase tracking-wider text-slate-500 px-4 py-2.5 rounded-full shadow-sm border border-slate-200">
             Live Preview
           </div>
           {diffConfig && (
             <div className="bg-emerald-500 text-xs font-extrabold uppercase tracking-widest text-white px-4 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 animate-pulse">
               Showing Proposed Schema Target
             </div>
           )}
         </div>

         {isGenerating ? (
           <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-6 w-full max-w-sm">
             <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
             <div className="space-y-3 text-center w-full">
                <p className="font-extrabold text-slate-900 text-xl tracking-tight">Diffing internal logic...</p>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-orange-500 w-full animate-pulse rounded-full" />
                </div>
             </div>
           </div>
         ) : (
           <div className="w-full max-w-lg transform origin-top animate-in zoom-in-95 duration-700 relative z-10 transition-all">
              <RoofingWidget isPro={isPro} config={{ ...(diffConfig || originalConfig), steps: stepToggles }} calculatorId="preview-mode" />
           </div>
         )}
      </div>
    </div>
  )
}
