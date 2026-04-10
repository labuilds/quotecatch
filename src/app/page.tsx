import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
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

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect('/calculators');

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg">
            <QCLogo size={24} isDark={false} />
          </div>
          <span className="text-[20px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[14px] font-bold text-slate-500">
           <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
           <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
           <a href="#demo" className="hover:text-slate-900 transition-colors">Demo</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[14px] font-bold text-slate-900 px-6 py-2.5 hover:bg-slate-50 rounded-xl transition-all">
            Login
          </Link>
          <Link href="/login?tab=signup" className="bg-[#0F172A] text-white text-[14px] font-black px-6 py-2.5 rounded-xl shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all">
            Get QuoteCatch Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-red-100 rounded-full blur-[120px] opacity-40 z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[120px] opacity-40 z-0" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full">
                <Star className="w-4 h-4 text-red-700 fill-red-700" />
                <span className="text-[13px] font-black text-red-800 uppercase tracking-widest">The #1 Roofing Growth Engine</span>
              </div>

              <h1 className="text-[54px] md:text-[84px] font-black text-[#0F172A] tracking-tighter leading-[0.9]">
                Turn every visitor into a <span className="text-red-700">premium lead.</span>
              </h1>

              <p className="text-[18px] md:text-[22px] text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0">
                Replace your boring contact forms with QuoteCatch. Give homeowners instant, accurate roof estimates and book inspections automatically.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                <Link href="/login?tab=signup" className="group h-16 px-10 bg-[#0F172A] text-white flex items-center gap-3 rounded-[1.5rem] font-black text-[18px] shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all transition-duration-300">
                  Launch Your Widget Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="hidden sm:flex items-center gap-3 text-slate-400 font-bold text-[16px]">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  No Credit Card Required
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-[480px] relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
               {/* Label for the playable widget */}
               <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-slate-100 px-6 py-2 rounded-full shadow-sm z-20 flex items-center gap-2 whitespace-nowrap">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Live Playable Demo</span>
               </div>
               
               <div className="relative z-10 bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                 <RoofingWidget isPro={false} config={DEMO_CONFIG} calculatorId="demo" />
               </div>

               {/* Decorative background shadow for the widget */}
               <div className="absolute -inset-4 bg-gradient-to-br from-red-500/10 to-indigo-500/10 rounded-[4rem] blur-3xl -z-10" />
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-12 grayscale opacity-50">
            <div className="flex items-center gap-2 font-black text-[24px]">OWENS CORNING</div>
            <div className="flex items-center gap-2 font-black text-[24px]">GAF</div>
            <div className="flex items-center gap-2 font-black text-[24px]">CERTAINTEED</div>
            <div className="flex items-center gap-2 font-black text-[24px]">MALARKEY</div>
          </div>
        </div>
      </header>

      {/* Feature Section Preview */}
      <section id="features" className="py-24 px-6 bg-slate-50">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-[42px] font-black text-[#0F172A] tracking-tight mb-4">Built for the Modern Roofer.</h2>
               <p className="text-slate-500 text-[18px] font-medium max-w-xl mx-auto">Skip the complex CRMs. QuoteCatch focuses on the only thing that matters: conversion.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "Instant AI Pricing", desc: "Homeowners get a range-based quote in 30 seconds, building instant trust.", icon: (props: any) => <QCLogo {...props} /> },
                 { title: "Viral Growth Loop", desc: "The 'Powered by QuoteCatch' badge turns every live widget into a referral source for your brand.", icon: MousePointer2 },
                 { title: "Satellite Data (Pro)", desc: "Upgrade to Profit Engine and get exact measurements via Google Solar data.", icon: Shield },
               ].map((f, i) => (
                 <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                       <f.icon className="w-7 h-7 text-red-700" size={28} />
                    </div>
                    <h4 className="text-[20px] font-black text-[#0F172A] mb-2">{f.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                 </div>
               ))}
            </div>

         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-[48px] font-black text-[#0F172A] tracking-tight mb-4">Transparent Pricing.</h2>
              <p className="text-slate-500 text-[18px] font-medium">Choose the engine that matches your growth stage.</p>
           </div>
           
           <PricingSection />
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6">
         <div className="max-w-5xl mx-auto bg-[#0F172A] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.2)]">
            <div className="relative z-10 text-white space-y-8">
               <h2 className="text-[48px] md:text-[64px] font-black tracking-tighter leading-none">Ready to catch every lead?</h2>
               <p className="text-white/60 text-[18px] md:text-[20px] font-medium max-w-xl mx-auto">Join hundreds of roofing contractors already using QuoteCatch to grow their business.</p>
               <div className="flex justify-center">
                  <Link href="/login?tab=signup" className="h-16 px-10 bg-red-700 text-white flex items-center gap-3 rounded-2xl font-black text-[18px] hover:bg-red-800 transition-all shadow-xl shadow-red-700/20">
                    Launch Your Widget Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
         </div>
      </section>
      
      <footer className="py-20 border-t border-slate-100 px-6">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center">
                  <QCLogo size={18} isDark={false} />
               </div>
               <span className="text-[18px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
            </div>
            
            <p className="text-slate-400 font-bold text-[14px]">
               © {new Date().getFullYear()} QuoteCatch. All rights reserved. Built for roofers, by roofers.
            </p>
         </div>
      </footer>

    </div>
  )
}
