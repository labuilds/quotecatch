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
import { Footer } from '@/components/marketing/Footer'
import { FAQSection } from '@/components/marketing/FAQSection'

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
        {/* Optimized background effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-red-100 rounded-full blur-[60px] lg:blur-[120px] opacity-30 lg:opacity-40 z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-indigo-100 rounded-full blur-[60px] lg:blur-[120px] opacity-30 lg:opacity-40 z-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-red-50 border border-red-100 rounded-full">
                <QCLogo size={14} />
                <span className="text-[11px] lg:text-[15px] font-semibold text-red-800 uppercase tracking-widest">Capture More Leads, Close More Sales</span>
              </div>

              <h1 className="text-[42px] sm:text-[54px] lg:text-[84px] font-semibold text-[#0F172A] tracking-tighter leading-[0.95] lg:leading-[0.9]">
                Stop climbing <br className="hidden lg:block" />
                <span className="text-red-700">roofs for free.</span>
              </h1>

              <p className="text-[16px] lg:text-[22px] text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Measure any home from your truck with instant satellite tech. Capture high-intent leads with exact square footage and qualified contact info. No more wasting gas on tire-kickers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6 pt-2 lg:pt-4">
                <Link href="/login?tab=signup&intent=pro" className="w-full sm:w-auto group h-14 lg:h-16 px-8 lg:px-10 bg-[#0F172A] text-white flex items-center justify-center gap-3 rounded-2xl lg:rounded-[1.5rem] font-semibold text-[16px] lg:text-[18px] shadow-xl hover:bg-black hover:-translate-y-1 transition-all transition-duration-300">
                  Start 14-Day Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2.5 text-slate-600 font-semibold text-[16px] lg:text-[16px]">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  No credit card required
                </div>
              </div>
            </div>

            <div id="demo" className="flex-1 w-full max-w-[480px] lg:max-w-[700px] relative mt-8 lg:mt-0 z-50">
              <div className="absolute -top-10 lg:-top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-100 px-4 lg:px-6 py-1.5 lg:py-2 rounded-full shadow-sm z-20 flex items-center gap-2 whitespace-nowrap">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] lg:text-[16px] font-semibold text-slate-600 uppercase tracking-widest">Live Playable Demo</span>
              </div>

              <div className="relative z-50 bg-white rounded-[2rem] lg:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-slate-100">
                <RoofingWidget isPro={true} config={DEMO_CONFIG} calculatorId="demo" isDemo={true} />
              </div>

              <div className="absolute -inset-4 bg-gradient-to-br from-red-500/5 to-indigo-500/5 rounded-[4rem] blur-2xl lg:blur-3xl -z-10" />
            </div>
          </div>

        </div>
      </header>

      {/* The 4-Step Lead Machine Section */}
      <section id="features" className="py-20 lg:py-32 px-4 sm:px-6 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] -z-0" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] -z-0" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-[36px] lg:text-[64px] font-semibold text-white tracking-tighter mb-2 lg:mb-3 leading-tight">
              Capture More Leads, <span className="text-red-500">Close More Sales</span>
            </h2>
            <p className="text-slate-300 text-[18px] lg:text-[24px] font-medium max-w-2xl mx-auto px-4">
              Stop guessing. Get the exact measurements you need to quote accurately, from Day 1. No more manual math or wasted site visits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
            {[
              {
                step: "STEP 1",
                title: "Setup in Minutes",
                desc: "Pick your materials, set your labor rates, and drop in your logo. Your estimator is ready to work immediately.",
                icon: <QCLogo size={32} isDark={false} />
              },
              {
                step: "STEP 2",
                title: "Share it Anywhere",
                desc: "Embed on your site, or share a direct link in SMS, marketing emails, and Google Ads. Capture leads 24/7 without answering a phone.",
                icon: <Zap className="w-8 h-8 text-red-500" />
              },
              {
                step: "STEP 3",
                title: "Satellite Precision",
                desc: "Homeowners get a price based on real satellite measurements. You get the exact squares before you even leave your driveway.",
                icon: <CheckCircle className="w-8 h-8 text-red-500" />
              },
              {
                step: "STEP 4",
                title: "Close Fast",
                desc: "Stop chasing tire-kickers. Focus on qualified homeowners who already have your pricing and are ready to sign.",
                icon: <ArrowRight className="w-8 h-8 text-red-500" />
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center mb-2">
                  {s.icon}
                </div>
                <div className="space-y-3">
                  <span className="text-[15px] font-semibold text-red-500 tracking-[0.2em] uppercase">{s.step}</span>
                  <h4 className="text-[24px] lg:text-[28px] font-semibold text-white tracking-tight">{s.title}</h4>
                  <p className="text-slate-300 font-medium leading-relaxed text-[16px] lg:text-[18px]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login?tab=signup&intent=pro" className="h-14 lg:h-16 px-10 bg-white text-[#0F172A] flex items-center justify-center gap-3 rounded-2xl font-semibold text-[16px] lg:text-[18px] hover:bg-slate-100 transition-all transition-duration-300">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 px-4 sm:px-6 bg-white relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-[42px] lg:text-[64px] font-semibold text-[#0F172A] tracking-tighter mb-4 leading-tight">Simple, Powerful Pricing.</h2>
            <p className="text-slate-600 text-[18px] lg:text-[22px] font-medium max-w-2xl mx-auto">One plan. Every tool. Zero risk.</p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 lg:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-[#0F172A] rounded-[2rem] lg:rounded-[3rem] p-10 sm:p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#0F172A]/20">
          <div className="relative z-10 text-white space-y-6 lg:space-y-8">
            <h2 className="text-[36px] lg:text-[64px] font-semibold tracking-tighter leading-[1.1] lg:leading-none">Ready to catch every lead?</h2>
            <p className="text-white/60 text-[16px] lg:text-[20px] font-medium max-w-xl mx-auto px-2">Join the roofers who have stopped wasting time on manual measurements. Try it free for 14 days.</p>
            <div className="flex justify-center pt-2">
              <Link href="/login?tab=signup&intent=pro" className="w-full sm:w-auto h-14 lg:h-16 px-8 lg:px-10 bg-red-700 text-white flex items-center justify-center gap-3 rounded-2xl font-semibold text-[16px] lg:text-[18px] hover:bg-red-800 transition-all shadow-xl shadow-red-700/20">
                Start 14-Day Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </div>
  )
}
