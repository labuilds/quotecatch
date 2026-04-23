"use client";

import React from 'react';
import Link from 'next/link';
import { QCLogo } from '@/components/QCLogo';
import { toolsConfig } from '@/data/toolsConfig';

export function Footer() {
  // Get first 5 tools for SEO priority links
  const priorityTools = toolsConfig.slice(0, 5);

  return (
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

          {/* Free Tools Column - Priority SEO Links */}
          <div className="space-y-6">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Free Tools</h4>
            <nav className="flex flex-col gap-4 text-[14px] font-bold text-slate-600">
              {priorityTools.map((tool) => (
                <Link 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`} 
                  className="hover:text-red-600 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {tool.title.split('|')[0].trim()}
                </Link>
              ))}
              <Link href="/tools" className="text-red-600 font-black hover:text-red-700 transition-colors mt-2">
                View All Tools →
              </Link>
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
  );
}
