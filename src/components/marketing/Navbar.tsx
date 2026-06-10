"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { QCLogo } from '@/components/QCLogo'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [supabase])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const NavLinks = () => (
    <>
      <Link href="/#features" className="hover:text-slate-900 transition-colors">Features</Link>
      <Link href="/#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
      <Link href="/#faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
    </>
  )

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'top-4 w-[calc(100%-2rem)] max-w-6xl bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-100/40 border border-slate-200/50 rounded-2xl px-6 h-16' 
        : 'top-0 w-full bg-white/90 lg:bg-white/80 backdrop-blur-md lg:backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 h-16 lg:h-20'
    } flex items-center justify-between`}>
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-50 rounded-xl flex items-center justify-center transition-all">
            <QCLogo size={20} isDark={true} />
          </div>
          <span className="text-[18px] lg:text-[20px] font-bold tracking-tight text-[#0F172A]">QuoteCatch</span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-10 text-[16px] font-bold text-slate-600">
        <NavLinks />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <Link 
            href="/calculators" 
            className={`bg-[#0F172A] text-white text-[15px] lg:text-[16px] font-bold rounded-xl shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center shrink-0 transition-all duration-300 ${
              isScrolled ? 'px-4 py-2 text-[14px]' : 'px-4 sm:px-7 py-2.5 lg:py-3'
            }`}
          >
            <span className="hidden sm:inline">{isScrolled ? 'Dashboard' : 'Go to Dashboard'}</span>
            <span className="sm:hidden">Dashboard</span>
          </Link>
        ) : (
          <>
            <Link 
              href="/login" 
              className={`hidden sm:inline-flex text-[15px] lg:text-[16px] font-bold text-slate-900 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center shrink-0 transition-all duration-300 ${
                isScrolled ? 'px-4 py-2' : 'px-4 lg:px-6 py-2.5 lg:py-3'
              }`}
            >
              Login
            </Link>
            <Link 
              href="/login?tab=signup&intent=pro" 
              className={`bg-[#0F172A] text-white text-[15px] lg:text-[16px] font-bold rounded-xl shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center shrink-0 transition-all duration-300 ${
                isScrolled ? 'px-4 py-2 text-[14px]' : 'px-4 sm:px-7 py-2.5 lg:py-3'
              }`}
            >
              <span>{isScrolled ? 'Free Trial' : 'Start Free Trial'}</span>
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
              <div className="flex flex-col items-center gap-8 text-[18px] font-bold text-slate-900">
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
  )
}
