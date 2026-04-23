"use client";

import React, { useState, useEffect } from 'react';
import { ToolConfig, toolsConfig } from '@/data/toolsConfig';
import { QCLogo } from '@/components/QCLogo';
import { createClient } from '@/utils/supabase/client';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  Calculator as CalcIcon, 
  Zap, 
  Mail, 
   ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { notFound } from 'next/navigation';

import { Navbar } from '@/components/marketing/Navbar';

export default function ToolClient({ slug, faqs }: { slug: string, faqs?: { question: string, answer: string }[] }) {
  const tool = toolsConfig.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<string | number | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, [supabase]);
  
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const defaults: Record<string, any> = {};
    tool.inputs.forEach(input => {
      if (input.type === 'select' && input.options) {
        defaults[input.id] = input.options[0];
      }
    });
    setInputValues(defaults);
  }, [tool]);

  const handleInputChange = (id: string, value: any) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = () => {
    const output = tool.compute(inputValues);
    setResult(output);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-900 pb-20">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Maximum SiteGPT Accuracy */}
      <header className="pt-32 lg:pt-48 pb-12 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Horizontal Breadcrumb Pill */}
        <div className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-[15px] font-medium text-slate-400 mb-8 shadow-sm">
          <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <Link href="/tools" className="hover:text-red-500 transition-colors">Free Tools</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="text-slate-900 font-bold">{tool.title}</span>
        </div>
        
        {/* Spaced Out Category Label */}
        <div className="text-[13px] font-black uppercase tracking-[0.4em] text-red-600 mb-6 drop-shadow-sm">
          TOOLS
        </div>
        
        <h1 className="text-4xl lg:text-7xl font-black text-[#0F172A] tracking-tight mb-8 leading-[1.1]">
          {tool.title}
        </h1>
        <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto italic">
          {tool.seoDescription} No sign up required. Free to use.
        </p>
      </header>

      {/* Interaction Hub - Condensed SiteGPT Style */}
      <main className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-[#F8FAFC]/50 rounded-[2rem] border border-slate-200 p-6 lg:p-8 shadow-sm">
          <div className="space-y-6">
            {/* Inputs Grid */}
            <div className="grid grid-cols-1 gap-5">
              {tool.inputs.map((input) => (
                <div key={input.id} className="space-y-1.5">
                  <label className="text-[15px] lg:text-[16px] font-black tracking-tight text-[#0F172A] flex items-center gap-2">
                    {input.label} <span className="text-red-600 font-black text-[12px]">*</span>
                  </label>
                  <div className="relative">
                    {input.type === 'select' ? (
                      <select
                        className="w-full h-12 px-5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none font-medium text-slate-900 text-base transition-all appearance-none cursor-pointer"
                        value={inputValues[input.id] || ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                      >
                        {input.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={input.type}
                        placeholder={input.placeholder}
                        className="w-full h-12 px-5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none font-medium text-slate-900 text-base placeholder:text-slate-300 transition-all"
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                      />
                    )}
                  </div>
                  {input.description && (
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                      {input.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100/50 mt-4">
              <button 
                onClick={() => {
                  setInputValues({});
                  setResult(null);
                }}
                className="h-11 px-6 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={handleGenerate}
                className="h-11 px-8 bg-[#0F172A] hover:bg-red-700 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-red-500/10"
              >
                {tool.type === 'calculator' ? 'Calculate' : 'Generate Content'}
              </button>
            </div>

            {/* Result Area - SiteGPT Success Pattern */}
            {result && (
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl shadow-red-500/5 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#0F172A] p-8 lg:p-12 text-white relative">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                      <h3 className="text-[14px] font-black uppercase tracking-[0.3em] text-red-500 mb-3">
                        {tool.resultLabel}
                      </h3>
                      <div className={cn(
                        "font-black tracking-tight leading-loose",
                        tool.type === 'calculator' ? "text-4xl lg:text-7xl text-white" : "text-lg lg:text-xl opacity-95 font-medium"
                      )}>
                        {result}
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "flex items-center justify-center gap-3 px-8 h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shrink-0 shadow-xl",
                        copied ? "bg-emerald-500 text-white" : "bg-white text-[#0F172A] hover:bg-red-50 hover:text-red-600"
                      )}
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Copied' : 'Copy Result'}
                    </button>
                  </div>
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ef4444 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                </div>

                {/* Result Details / Breakdown (Optional spacing) */}
                <div className="bg-white p-8 lg:p-10 border-b border-slate-100 italic text-slate-500 text-base font-medium">
                  {tool.type === 'calculator' 
                    ? "Based on industry standard waste tables for the current roof profile." 
                    : "Optimized for high-intent homeowner conversion."}
                </div>

                {/* Contextual CTA - Light Red Background */}
                <div className="bg-red-50/50 p-8 lg:p-14 text-center border-t border-slate-100">
                  <h4 className="text-2xl lg:text-3xl font-black text-slate-900 mb-6 tracking-tight">
                    Scale this with the QuoteCatch Widget
                  </h4>
                  <p className="text-slate-500 font-medium text-base lg:text-lg leading-relaxed mb-10 max-w-2xl mx-auto italic">
                    Now that you have your {tool.title.toLowerCase()}, why not automate the whole process? Put QuoteCatch on your site and let it handle the math for every visitor.
                  </p>
                  <Link 
                    href="/" 
                    className="inline-flex h-16 px-12 bg-red-600 hover:bg-black text-white rounded-2xl font-black text-sm lg:text-base uppercase tracking-widest items-center justify-center transition-all active:scale-95 shadow-xl shadow-red-500/20"
                  >
                    Claim Free Monthly Subscription
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FAQ Section - SEO Content */}
      {faqs && faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-medium italic">Everything you need to know about this {slug.replace(/-/g, ' ')} tool.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 open:bg-white open:shadow-xl open:shadow-slate-200/50">
                <summary className="flex items-center justify-between p-6 lg:p-8 cursor-pointer list-none font-bold text-slate-900 group-open:text-red-600 transition-colors">
                  <span className="pr-4">{faq.question}</span>
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-open:rotate-180 transition-transform duration-300">
                    <ArrowDown className="w-4 h-4 text-slate-400 group-open:text-red-600" />
                  </div>
                </summary>
                <div className="px-6 lg:px-8 pb-6 lg:pb-8 text-slate-600 leading-relaxed font-medium mt-[-0.5rem]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Tools Section - SiteGPT Style */}
      <section className="bg-slate-50/50 pt-20 pb-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em] mb-4 block">Other Free Tools</span>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight mb-4">
              Try our other roofing utilities
            </h2>
            <p className="text-slate-500 font-medium text-lg italic">
              Simple, precise tools designed specifically for modern roofing contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolsConfig
              .filter(t => t.slug !== tool.slug)
              .slice(0, 3)
              .map((otherTool) => (
                <Link 
                  key={otherTool.slug}
                  href={`/tools/${otherTool.slug}`}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-red-500 shadow-sm transition-all flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-[16/10] bg-slate-50 rounded-xl mb-6 flex items-center justify-center p-8 group-hover:bg-red-50 transition-colors border border-slate-100 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      {otherTool.type === 'calculator' && <CalcIcon className="w-12 h-12 text-red-500 opacity-20" />}
                      {otherTool.type === 'text-generator' && <Zap className="w-12 h-12 text-amber-500 opacity-20" />}
                      {otherTool.type === 'template' && <Mail className="w-12 h-12 text-blue-500 opacity-20" />}
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {otherTool.type === 'calculator' ? 'Calculator' : 'Generator'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                    {otherTool.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6">
                    {otherTool.seoDescription.slice(0, 80)}...
                  </p>
                  <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-500 transition-all">
                    Open Tool
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer Back Link */}
      <footer className="py-16 lg:py-24 border-t border-slate-100 px-4 sm:px-6 bg-white shrink-0 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20 mb-16 lg:mb-24">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 mt-1">
                  <QCLogo size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[20px] lg:text-[22px] font-black tracking-tight text-[#0F172A] leading-tight">QuoteCatch</span>
                  <p className="text-[15px] lg:text-[16px] text-slate-500 font-medium leading-tight mt-1">
                    Stop Chasing, Start Closing
                  </p>
                </div>
              </div>
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
            <Link href="/tools" className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all">
              ← Back to Tools Hub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
