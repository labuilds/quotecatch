"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toolsConfig } from '@/data/toolsConfig';
import { createClient } from '@/utils/supabase/client';
import { QCLogo } from '@/components/QCLogo';
import { 
  Calculator, 
  Zap, 
  Mail, 
  Menu,
  ChevronRight
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function ToolsIndexPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, [supabase]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'calculator': return <Calculator className="w-10 h-10 text-red-600" />;
      case 'text-generator': return <Zap className="w-10 h-10 text-amber-500" />;
      default: return <Mail className="w-10 h-10 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden flex flex-col">
      {/* Navigation - Landing Page Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 lg:bg-white/80 backdrop-blur-md lg:backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 h-16 lg:h-20 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-50 rounded-xl flex items-center justify-center transition-all">
              <QCLogo size={20} />
            </div>
            <span className="text-[18px] lg:text-[20px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[14px] font-bold text-slate-500">
          <Link href="/#features" className="hover:text-slate-900 transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <Link href="/calculators" className="bg-[#0F172A] text-white text-[12px] sm:text-[14px] font-black px-4 sm:px-6 py-2.5 rounded-xl shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all">
              Dashboard
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
              <SheetTrigger 
                render={
                  <button type="button" className="h-10 w-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all">
                    <Menu className="w-6 h-6" />
                  </button>
                } 
              />
              <SheetContent side="top" className="w-full pt-20 pb-10">
                <div className="flex flex-col items-center gap-8 text-[18px] font-black text-slate-900">
                  <Link href="/#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
                  <Link href="/#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                  {user ? (
                    <Link href="/calculators" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered SiteGPT Style */}
      <header className="pt-32 lg:pt-48 pb-20 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-[11px] font-black uppercase tracking-[0.4em] text-red-600 mb-6 drop-shadow-sm">
          FREE TOOLS
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-[#0F172A] tracking-tight mb-8 leading-[1.1]">
          Free tools for the roofing community
        </h1>
        <p className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto italic">
          Discover a suite of free, powerful tools tailored for roofing contractors, designed to streamline your lead capture and boost your conversion.
        </p>
      </header>

      {/* Tools Grid - Premium Card Style */}
      <main className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
          {toolsConfig.map((tool) => (
            <Link 
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group relative bg-[#F8FAFC]/50 rounded-[3rem] border border-slate-200 hover:border-red-500/30 hover:bg-white transition-all duration-500 overflow-hidden flex flex-col p-8 lg:p-12 shadow-sm hover:shadow-2xl hover:shadow-red-500/10"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 lg:gap-10">
                {/* Visual Icon Container */}
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl border border-red-500/10 bg-white flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    {getIcon(tool.type)}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-black text-[#0F172A] mb-3 tracking-tight group-hover:text-red-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-500 font-medium text-[15px] lg:text-[16px] leading-relaxed mb-6 italic opacity-80">
                    {tool.seoDescription}
                  </p>
                  <div className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-red-600 group-hover:gap-4 transition-all">
                    Try tool for free
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer CTA - Integrated Look */}
      <section className="bg-[#0F172A] py-24 px-6 mx-4 lg:mx-12 rounded-[3.5rem] text-center relative overflow-hidden mb-24">
        {/* Decorative Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Automate your<br />Roofing Leads
          </h2>
          <p className="text-slate-400 text-lg lg:text-xl font-medium mb-12 leading-relaxed italic">
            Ready to stop doing the manual grunt work? Join high-growth roofing companies using QuoteCatch today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/" 
              className="h-16 px-10 bg-red-600 hover:bg-white hover:text-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center transition-all active:scale-95 shadow-2xl shadow-red-500/20"
            >
              Claim Free Monthly Subscription
            </Link>
          </div>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
