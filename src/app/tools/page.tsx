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
  ChevronRight
} from 'lucide-react';

import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function ToolsIndexPage() {
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
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Centered SiteGPT Style */}
      <header className="pt-32 lg:pt-48 pb-20 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-red-600 mb-6 drop-shadow-sm">
          FREE TOOLS
        </div>
        <h1 className="text-5xl lg:text-7xl font-semibold text-[#0F172A] tracking-tight mb-8 leading-[1.1]">
          Free tools for the roofing community
        </h1>
        <p className="text-lg lg:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto italic">
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
                  <h3 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-3 tracking-tight group-hover:text-red-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-600 font-medium text-[15px] lg:text-[16px] leading-relaxed mb-6 italic opacity-80">
                    {tool.seoDescription}
                  </p>
                  <div className="inline-flex items-center gap-2 text-[16px] font-semibold uppercase tracking-widest text-red-600 group-hover:gap-4 transition-all">
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
      <section className="bg-slate-50 border border-slate-200/60 py-24 px-6 mx-4 lg:mx-12 rounded-[3.5rem] text-center relative overflow-hidden mb-24 shadow-xl shadow-slate-100/40">
        {/* Decorative Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl lg:text-6xl font-semibold text-[#0F172A] mb-8 tracking-tight leading-[1.1]">
            Automate your<br />Roofing Leads
          </h2>
          <p className="text-slate-600 text-lg lg:text-xl font-medium mb-12 leading-relaxed italic">
            Ready to stop doing the manual grunt work? Try it free for 14 days and join high-growth roofing companies using QuoteCatch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/login?tab=signup&intent=pro" 
              className="h-16 px-10 bg-red-600 hover:bg-black text-white rounded-2xl font-semibold text-sm uppercase tracking-widest flex items-center justify-center transition-all active:scale-95 shadow-2xl shadow-red-500/20"
            >
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
