"use client"
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Calculator, BarChart3, Globe, Sparkles, Zap, Layers, Check, ArrowRight, Star } from 'lucide-react'
import MarketingWidget from "@/components/marketing/MarketingWidget"

export default function MarketingPage({ params }: { params: Promise<{ vertical: string }> }) {
  const resolvedParams = use(params)
  const vertical = resolvedParams.vertical
  const router = useRouter()

  const verticalTitleMap: Record<string, string> = {
    roofing: "Roofing",
    hvac: "HVAC",
    landscaping: "Landscaping",
    plumbing: "Plumbing"
  }
  const title = verticalTitleMap[vertical.toLowerCase()] || "Home Service"

  const features = [
    { icon: Calculator, color: "text-orange-500", bg: "bg-orange-50", title: "Instant Lead Capture", desc: "Build a custom estimating widget in minutes. Capture high-intent leads instantly right on your website." },
    { icon: BarChart3, color: "text-blue-500", bg: "bg-blue-50", title: "Lead Intelligence", desc: "Every estimate is logged with the homeowner's details, dimensions, and material preferences." },
    { icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50", title: "One-Click Embed", desc: "Works on WordPress, Webflow, GoHighLevel. Copy one line of code. Done." },
  ]

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-200/60 overflow-x-hidden">

      {/* Subtle top gradient wash */}
      <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-[5%] w-[700px] h-[700px] rounded-full bg-orange-100/70 blur-[130px]" />
        <div className="absolute top-[5%] left-[0%] w-[400px] h-[400px] rounded-full bg-slate-100/80 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-slate-100/80 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.35)]">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">QuoteCatch</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold rounded-xl" onClick={() => router.push('/login')}>Log In</Button>
          <Button className="bg-slate-900 hover:bg-black text-white font-semibold rounded-xl px-5 shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all" onClick={() => router.push('/login?tab=signup&intent=pro')}>
            Start 14-Day Free Trial →
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 lg:pt-28">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[52%] space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[16px] font-semibold tracking-wider uppercase">Built for {title} Contractors</span>
            </div>

            <h1 className="text-[3.2rem] sm:text-[4rem] lg:text-[4.8rem] font-semibold tracking-tighter leading-[1.03] text-slate-900">
              Stop losing leads.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Quote instantly.
              </span>
            </h1>

            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
              Embed a highly accurate, automated estimating engine on your website. Capture high-intent homeowners the moment they search.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                className="h-14 px-8 text-[16px] font-semibold bg-gradient-to-br from-orange-500 to-orange-600 hover:to-orange-700 text-white shadow-[0_8px_24px_rgba(249,115,22,0.3)] rounded-2xl transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(249,115,22,0.4)] border-none"
                onClick={() => router.push('/login?tab=signup&intent=pro')}
              >
                Start 14-Day Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="h-14 px-8 text-[16px] font-semibold border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-2xl transition-all hover:-translate-y-0.5 shadow-sm"
              >
                See Live Demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 pt-3">
              <div className="flex -space-x-3">
                {[
                  'bg-orange-400', 'bg-blue-400', 'bg-emerald-400', 'bg-purple-400'
                ].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white shadow-sm flex items-center justify-center`}>
                    <span className="text-[11px] font-semibold text-white">{['J','K','M','S'][i]}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-[15px] font-semibold text-slate-600 mt-0.5">Trusted by <span className="text-slate-900 font-semibold">500+</span> {title} contractors</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Widget preview */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[48%] flex justify-center relative"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-orange-200/40 blur-[80px] rounded-full pointer-events-none scale-90" />
            <div className="relative z-10 w-full max-w-[420px]">
              <div className="absolute -top-4 -right-4 z-20 bg-white text-slate-900 border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-[11px] font-semibold px-4 py-2.5 rounded-full flex gap-2 items-center animate-bounce tracking-wide uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> 
                Try it live!
              </div>
              <div className="shadow-[0_32px_80px_rgba(0,0,0,0.12)] rounded-[2rem] overflow-hidden">
                <MarketingWidget />
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Social proof bar */}
      <section className="border-y border-slate-100 bg-slate-50 relative z-10 py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-[0.3em] mb-8">Trusted by contractors across the country</p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 opacity-40 hover:opacity-70 transition-all duration-700 w-full">
            {['Apex Roofing', 'Summit Co.', 'Ironclad HV', 'BlueSky Build'].map((name, i) => (
              <div key={i} className="flex items-center gap-2.5 text-slate-700 cursor-pointer hover:text-orange-500 transition-colors">
                <Layers className="w-6 h-6" />
                <span className="text-lg font-semibold tracking-tight">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[16px] font-semibold uppercase tracking-wider">
            Why contractors choose us
          </div>
          <h2 className="text-[2.8rem] md:text-[3.5rem] font-semibold tracking-tighter text-slate-900">The engine for conversion.</h2>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">Everything you need to turn passive website traffic into high-quality, ready-to-close leads.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, bg, title: ftitle, desc }, idx) => (
            <motion.div
              key={ftitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="bg-white border border-slate-100 rounded-[1.75rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight text-slate-900 mb-3">{ftitle}</h3>
              <p className="text-slate-600 text-[16px] leading-relaxed font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Wide embed card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 bg-slate-900 rounded-[1.75rem] p-10 lg:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          <div className="flex-1 space-y-6 text-white">
            <h3 className="text-[2rem] font-semibold tracking-tight">One-Click Global Embed</h3>
            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl font-medium">Paste one line of code onto any page. Works on WordPress, Webflow, GoHighLevel, or raw HTML. Fully responsive, zero dependencies.</p>
            <ul className="space-y-3">
              {['Zero technical setup required', 'Self-updating pricing configurations', 'Fully mobile-first responsive'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-auto shrink-0 border border-white/10 bg-black/40 rounded-2xl p-6 font-mono text-sm shadow-2xl">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>
            <pre className="text-xs sm:text-sm text-emerald-400 leading-relaxed">
              <code>
                <span className="text-pink-400">&lt;iframe</span>{'\n'}
                <span className="text-slate-300 ml-4">  src=</span><span className="text-amber-300">"https://getquotecatch.com..."</span>{'\n'}
                <span className="text-slate-300 ml-4">  width=</span><span className="text-amber-300">"100%"</span>{'\n'}
                <span className="text-slate-300 ml-4">  style=</span><span className="text-amber-300">"border:none;"</span>{'\n'}
                <span className="text-pink-400">&gt;&lt;/iframe&gt;</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-28 relative z-10 border-t border-slate-100 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-orange-50/40 pointer-events-none" />
        <div className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-orange-100/60 blur-[140px] pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-[0_8px_24px_rgba(249,115,22,0.35)]">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-[3rem] md:text-[4rem] font-semibold text-slate-900 tracking-tighter leading-tight">Engineered to scale.</h2>
          <p className="text-xl text-slate-600 font-medium">Skip the lead aggregators. Own your qualified funnel.</p>
          <Button
            className="h-16 px-12 text-lg font-semibold bg-slate-900 hover:bg-black text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] rounded-2xl transition-all hover:scale-105 hover:-translate-y-1 border-none"
            onClick={() => router.push('/login?tab=signup&intent=pro')}
          >
            Start 14-Day Free Trial →
          </Button>
        </div>
      </section>
    </div>
  )
}
