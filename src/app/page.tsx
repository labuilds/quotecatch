"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Shield, Star, PlayCircle, MousePointer2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QCLogo } from '@/components/QCLogo'
import { PricingSection } from '@/components/PricingSection'
import RoofingWidget from '@/components/RoofingWidget'
import { PricingConfig } from '@/lib/pricingEngine'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const DEMO_CONFIG: PricingConfig = {
  materials: { asphalt: 4.85, tile: 12.50 },
  modifiers: { pitch: { flat: 1.0, standard: 1.0, steep: 1.25 } },
  flat_fees: 650,
  free_tier_averages: { under_1500: 6470, "1500_2500": 10350, over_2500: 16170 }
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [supabase])

  const NavLinks = () => (
    <>
      <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
      <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
      <a href="#demo" className="hover:text-slate-900 transition-colors">Demo</a>
    </>
  )

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 lg:bg-white/80 backdrop-blur-md lg:backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 h-16 lg:h-20 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg">
            <QCLogo size={20} isDark={false} />
          </div>
          <span className="text-[18px] lg:text-[20px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[14px] font-bold text-slate-500">
          <NavLinks />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <Link href="/calculators" className="bg-[#0F172A] text-white text-[12px] sm:text-[14px] font-black px-4 sm:px-6 py-2.5 rounded-xl shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex text-[14px] font-bold text-slate-900 px-4 lg:px-6 py-2.5 hover:bg-slate-50 rounded-xl transition-all">
                Login
              </Link>
              <Link href="/login?tab=signup" className="bg-[#0F172A] text-white text-[12px] sm:text-[14px] font-black px-4 sm:px-6 py-2.5 rounded-xl shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all">
                Get Started
              </Link>
            </>
          )}

          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger className="h-10 w-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all">
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="top" className="w-full pt-20 pb-10">
                <div className="flex flex-col items-center gap-8 text-[18px] font-black text-slate-900">
                  <NavLinks />
                  {user ? (
                    <Link href="/calculators" onClick={() => setIsMenuOpen(false)} className="text-red-700">Dashboard</Link>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-red-700">Login</Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-28 lg:pt-40 pb-12 lg:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Optimized background effects - reduced blur for mobile performance */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-red-100 rounded-full blur-[60px] lg:blur-[120px] opacity-30 lg:opacity-40 z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-indigo-100 rounded-full blur-[60px] lg:blur-[120px] opacity-30 lg:opacity-40 z-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-red-50 border border-red-100 rounded-full">
                <Star className="w-3.5 h-3.5 text-red-700 fill-red-700" />
                <span className="text-[11px] lg:text-[13px] font-black text-red-800 uppercase tracking-widest">The #1 Roofing Engine</span>
              </div>

              <h1 className="text-[42px] sm:text-[54px] lg:text-[84px] font-black text-[#0F172A] tracking-tighter leading-[0.95] lg:leading-[0.9]">
                Turn visitors into <span className="text-red-700">premium leads.</span>
              </h1>

              <p className="text-[16px] lg:text-[22px] text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0">
                Replace boring contact forms with QuoteCatch. Give homeowners instant estimates and book inspections automatically.
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
                <RoofingWidget isPro={false} config={DEMO_CONFIG} calculatorId="demo" />
              </div>

              {/* Optimized decorative background */}
              <div className="absolute -inset-4 bg-gradient-to-br from-red-500/5 to-indigo-500/5 rounded-[4rem] blur-2xl lg:blur-3xl -z-10" />
            </div>
          </div>

        </div>
      </header>

      {/* Feature Section Preview */}
      <section id="features" className="py-16 lg:py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-[32px] lg:text-[42px] font-black text-[#0F172A] tracking-tight mb-3 lg:mb-4 leading-tight">Stop Driving to Tire-Kickers.</h2>
            <p className="text-slate-500 text-[16px] lg:text-[18px] font-medium max-w-xl mx-auto px-4">We filter the serious buyers from the window shoppers before your phone even rings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Instant Ballpark Estimates", desc: "Homeowners get a rough price instantly, building trust while weeding out the low-ballers who can't afford your quality of work.", icon: (props: any) => <QCLogo {...props} /> },
              { title: "Pre-Qualified Leads", desc: "By the time you call them, they already know the price range and are ready to talk financing or book a real inspection.", icon: MousePointer2 },
              { title: "Remote Measurements (Pro)", desc: "Stop climbing roofs for free. Get exact square footage instantly using satellite data—right from your truck.", icon: Shield },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <f.icon className="w-6 h-6 lg:w-7 lg:h-7 text-red-700" size={28} />
                </div>
                <h4 className="text-[18px] lg:text-[20px] font-black text-[#0F172A] mb-2">{f.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed text-[15px] lg:text-[16px]">{f.desc}</p>
              </div>
            ))}
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

      <footer className="py-12 lg:py-20 border-t border-slate-100 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center">
              <QCLogo size={18} isDark={false} />
            </div>
            <span className="text-[18px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
          </div>

          <p className="text-slate-400 font-bold text-[12px] lg:text-[14px] text-center md:text-left">
            © {new Date().getFullYear()} QuoteCatch. All rights reserved. Built for roofers.
          </p>
        </div>
      </footer>
    </div>
  )
}

