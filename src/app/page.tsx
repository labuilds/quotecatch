"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, Star, PlayCircle, MousePointer2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QCLogo } from '@/components/QCLogo'
import { PricingSection } from '@/components/PricingSection'
import RoofingWidget from '@/components/RoofingWidget'
import { PricingConfig } from '@/lib/pricingEngine'

const DEMO_CONFIG: PricingConfig = {
  materials: { asphalt: 4.85, tile: 12.50 },
  modifiers: { pitch: { flat: 1.0, standard: 1.0, steep: 1.25 } },
  flat_fees: 650,
  free_tier_averages: { under_1500: 6470, "1500_2500": 10350, over_2500: 16170 }
}

import { Navbar } from '@/components/marketing/Navbar'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [supabase])

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-28 lg:pt-40 pb-12 lg:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Optimized background effects - reduced blur for mobile performance */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-red-100 rounded-full blur-[60px] lg:blur-[120px] opacity-30 lg:opacity-40 z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-indigo-100 rounded-full blur-[60px] lg:blur-[120px] opacity-30 lg:opacity-40 z-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-red-50 border border-red-100 rounded-full">
                <QCLogo size={14} />
                <span className="text-[11px] lg:text-[13px] font-black text-red-800 uppercase tracking-widest">Built for Roofing Contractors</span>
              </div>

              <h1 className="text-[42px] sm:text-[54px] lg:text-[84px] font-black text-[#0F172A] tracking-tighter leading-[0.95] lg:leading-[0.9]">
                Turn visitors into <span className="text-red-700">premium leads.</span>
              </h1>

               <p className="text-[16px] lg:text-[22px] text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The lead capture solution designed specifically for roofers. Qualify jobs straight from your phone while you're in the field—no expensive CRM or complex tech required. Just real leads, ready to close.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6 pt-2 lg:pt-4">
                <Link href="/login?tab=signup" className="w-full sm:w-auto group h-14 lg:h-16 px-8 lg:px-10 bg-[#0F172A] text-white flex items-center justify-center gap-3 rounded-2xl lg:rounded-[1.5rem] font-black text-[16px] lg:text-[18px] shadow-xl hover:bg-black hover:-translate-y-1 transition-all transition-duration-300">
                  Launch Free Widget
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2.5 text-slate-400 font-bold text-[14px] lg:text-[16px]">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  No Credit Card Required
                </div>
              </div>
            </div>

            <div id="demo" className="flex-1 w-full max-w-[480px] relative mt-8 lg:mt-0 z-50">
              {/* Label for the playable widget */}
              <div className="absolute -top-10 lg:-top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-100 px-4 lg:px-6 py-1.5 lg:py-2 rounded-full shadow-sm z-20 flex items-center gap-2 whitespace-nowrap">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] lg:text-[12px] font-black text-slate-400 uppercase tracking-widest">Live Playable Demo</span>
              </div>

              <div className="relative z-50 bg-white rounded-[2rem] lg:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-slate-100">
                <RoofingWidget isPro={true} config={DEMO_CONFIG} calculatorId="demo" isDemo={true} />
              </div>

              {/* Optimized decorative background */}
              <div className="absolute -inset-4 bg-gradient-to-br from-red-500/5 to-indigo-500/5 rounded-[4rem] blur-2xl lg:blur-3xl -z-10" />
            </div>
          </div>

        </div>
      </header>

      {/* The 4-Step Lead Machine Section */}
      <section id="features" className="py-20 lg:py-32 px-4 sm:px-6 bg-[#0F172A] relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] -z-0" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] -z-0" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-[36px] lg:text-[64px] font-black text-white tracking-tighter mb-2 lg:mb-3 leading-tight">
              Win more with the <span className="text-red-500">Instant Lead Machine</span>
            </h2>
            <p className="text-slate-400 text-[18px] lg:text-[24px] font-medium max-w-2xl mx-auto px-4">
              We've digitized the roofing sales process so you can close deals faster than you can climb a ladder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
            {[
              { 
                step: "STEP 1", 
                title: "Create & Customize", 
                desc: "Pick your materials, set your labor rates, and add your brand. Your estimator reflects your real business math.", 
                icon: <QCLogo size={32} isDark={false} /> 
              },
              { 
                step: "STEP 2", 
                title: "Promote & Share", 
                desc: "Put it everywhere. Share links on social media or download unique QR codes for your trucks, yard signs, and balloons.", 
                icon: <Zap className="w-8 h-8 text-red-500" /> 
              },
              { 
                step: "STEP 3", 
                title: "Capture & Qualify", 
                desc: "Homeowners get a detailed price instantly. You get a qualified job card with timeline, roof size, and contact info.", 
                icon: <CheckCircle className="w-8 h-8 text-red-500" /> 
              },
              { 
                step: "STEP 4", 
                title: "Connect & Close", 
                desc: "Prioritize leads effortlessly. Move faster while you're in the field and strike while the iron's hot.", 
                icon: <ArrowRight className="w-8 h-8 text-red-500" /> 
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center mb-2">
                  {s.icon}
                </div>
                <div className="space-y-3">
                  <span className="text-[13px] font-black text-red-500 tracking-[0.2em] uppercase">{s.step}</span>
                  <h4 className="text-[24px] lg:text-[28px] font-black text-white tracking-tight">{s.title}</h4>
                  <p className="text-slate-400 font-medium leading-relaxed text-[16px] lg:text-[18px]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login?tab=signup" className="h-14 lg:h-16 px-10 bg-white text-[#0F172A] flex items-center justify-center gap-3 rounded-2xl font-black text-[16px] lg:text-[18px] hover:bg-slate-100 transition-all">
              Try it now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-[36px] lg:text-[48px] font-black text-[#0F172A] tracking-tight mb-4 leading-tight">Transparent Pricing.</h2>
            <p className="text-slate-500 text-[16px] lg:text-[18px] font-medium px-4">Stop wasting gas. Start closing deals.</p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 lg:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-[#0F172A] rounded-[2rem] lg:rounded-[3rem] p-10 sm:p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#0F172A]/20">
          <div className="relative z-10 text-white space-y-6 lg:space-y-8">
            <h2 className="text-[36px] lg:text-[64px] font-black tracking-tighter leading-[1.1] lg:leading-none">Ready to catch every lead?</h2>
            <p className="text-white/60 text-[16px] lg:text-[20px] font-medium max-w-xl mx-auto px-2">Join hundreds of contractors already using QuoteCatch to grow their business.</p>
            <div className="flex justify-center pt-2">
              <Link href="/login?tab=signup" className="w-full sm:w-auto h-14 lg:h-16 px-8 lg:px-10 bg-red-700 text-white flex items-center justify-center gap-3 rounded-2xl font-black text-[16px] lg:text-[18px] hover:bg-red-800 transition-all shadow-xl shadow-red-700/20">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          {/* Optimized decorative effect */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      <footer className="py-16 lg:py-24 border-t border-slate-100 px-4 sm:px-6 bg-white shrink-0 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20 mb-16 lg:mb-24">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1 space-y-6">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-50 rounded-xl flex items-center justify-center transition-all">
                  <QCLogo size={20} />
                </div>
                <span className="text-[18px] lg:text-[20px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
              </div>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed italic">
                Empowering roofing contractors with satellite-powered lead capture and programmatic SEO tools.
              </p>
            </div>

            {/* Product Column */}
            <div className="space-y-6">
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Product</h4>
              <nav className="flex flex-col gap-4 text-[14px] font-bold text-slate-600">
                <Link href="/#features" className="hover:text-red-600 transition-colors">Features</Link>
                <Link href="/#pricing" className="hover:text-red-600 transition-colors">Pricing</Link>
                <Link href="/login" className="hover:text-red-600 transition-colors">Sign In</Link>
                <Link href="/login?tab=signup" className="hover:text-red-600 transition-colors">Register</Link>
              </nav>
            </div>

            {/* Free Tools Column */}
            <div className="space-y-6">
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Free Tools</h4>
              <nav className="flex flex-col gap-4 text-[14px] font-bold text-slate-600">
                <Link href="/tools/shingle-waste-calculator" className="hover:text-red-600 transition-colors">Waste Calculator</Link>
                <Link href="/tools/roofing-financing-calculator" className="hover:text-red-600 transition-colors">Financing Calc</Link>
                <Link href="/tools/storm-door-knocking-script" className="hover:text-red-600 transition-colors">Storm Script</Link>
                <Link href="/tools/chimney-flashing-cost-estimator" className="hover:text-red-600 transition-colors">Flashing Tool</Link>
                <Link href="/tools/hoa-roofing-approval-generator" className="hover:text-red-600 transition-colors">HOA Template</Link>
                <Link href="/tools" className="text-red-600 font-black hover:text-red-700 transition-colors">View All →</Link>
              </nav>
            </div>

            {/* Support Column */}
            <div className="space-y-6">
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Support</h4>
              <nav className="flex flex-col gap-4 text-[14px] font-bold text-slate-600">
                <Link href="/terms" className="hover:text-red-600 transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
              </nav>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[12px] lg:text-[14px] text-slate-400 font-bold">
              © {new Date().getFullYear()} QuoteCatch. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest">Platform Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

