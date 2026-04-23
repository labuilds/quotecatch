"use client"

import Link from 'next/link'
import { Zap, Users, Settings, Menu } from 'lucide-react'
import { QCLogo } from '@/components/QCLogo'
import { ReactNode, useState, useEffect } from 'react'
import LogoutButton from '@/components/LogoutButton'
import { usePathname } from 'next/navigation'
import { UserTierProvider } from '@/components/UserTierProvider'
import { SupportButton } from '@/components/SupportModal'
import { SidebarUpgradeCard } from '@/components/SidebarUpgradeCard'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

import { TrialBanner } from './TrialBanner'
import { LockoutOverlay } from './LockoutOverlay'

interface DashboardLayoutClientProps {
  children: ReactNode
  isPro: boolean
  userEmail: string
  trialEndsAt?: string
  isLocked?: boolean
}




const navItems = [
  { href: '/calculators', icon: Zap, label: 'Machines' },
  { href: '/leads', icon: Users, label: 'Leads' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

const SidebarContent = ({ 
  mounted, 
  pathname, 
  isPro, 
  trialDaysRemaining, 
  userEmail 
}: { 
  mounted: boolean, 
  pathname: string, 
  isPro: boolean, 
  trialDaysRemaining: number, 
  userEmail: string 
}) => {
  // If not mounted, render a minimal skeleton or nothing to prevent hydration drift
  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-white animate-pulse">
         <div className="px-6 py-7">
           <div className="w-10 h-10 bg-slate-100 rounded-2xl" />
         </div>
         <nav className="flex-1 px-4 space-y-4 mt-4">
            <div className="h-4 w-20 bg-slate-50 rounded ml-4" />
            <div className="h-10 w-full bg-slate-50 rounded-2xl" />
            <div className="h-10 w-full bg-slate-50 rounded-2xl" />
         </nav>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Premium Mobile Header - Only visible in Sheet */}
      <div className="px-8 pt-12 pb-8 shrink-0 bg-gradient-to-b from-slate-50/50 to-transparent lg:hidden">
        <Link href="/calculators" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-[#0F172A] rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-slate-200 group-hover:scale-105 transition-transform duration-500">
            <QCLogo size={24} isDark={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-[22px] font-black tracking-tight text-[#0F172A] leading-none">QuoteCatch</span>
            <div className="flex items-center gap-1.5 mt-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Machine Core</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop Logo - Only visible on desktop sidebar */}
      <div className="hidden lg:block px-6 py-7 shrink-0">
        <Link href="/calculators" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-0.5 duration-300">
            <QCLogo size={24} isDark={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
            <span className="text-[12px] font-extrabold tracking-[0.05em] text-slate-400 leading-none">Roofing Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] px-5 mb-4">Command Center</div>
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden font-black text-[17px] leading-none",
              pathname === href 
                ? "bg-[#0F172A] text-white shadow-2xl shadow-slate-300 translate-x-1" 
                : "text-slate-500 hover:bg-slate-50 hover:text-[#0F172A] hover:translate-x-1"
            )}
          >
            <div className={cn(
              "shrink-0 transition-colors z-10",
              pathname === href ? "text-red-500" : "text-slate-500 group-hover:text-red-700"
            )}>
              <Icon className="w-[18px] h-[18px]" />
            </div>
            <span className="z-10">{label}</span>
            {pathname === href && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-50" />
            )}
          </Link>
        ))}
        
        <div className="pt-6 px-2">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Systems Support</p>
              <p className="text-[13px] text-slate-600 font-bold leading-snug mb-5">Need help configuring your math? We're online.</p>
              <SupportButton />
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-all duration-700" />
          </div>
        </div>
      </nav>

      {/* User / Upgrade Card */}
      <div className="p-6 bg-slate-50/50 mt-auto shrink-0 border-t border-slate-100">
        <div className="flex flex-col gap-4">
          {!isPro && <div className="px-2"><SidebarUpgradeCard trialDaysRemaining={trialDaysRemaining} /></div>}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group/user">
             <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center font-black text-red-500 text-sm shadow-inner shrink-0 leading-none">
               {userEmail?.charAt(0).toUpperCase() || 'U'}
             </div>
             <div className="flex flex-col min-w-0 flex-1">
               <p className="text-[13px] font-black text-slate-900 truncate tracking-tight leading-none mb-1">{userEmail?.split('@')[0]}</p>
               <p className="text-[10px] font-black text-slate-400 truncate uppercase tracking-widest leading-none">{isPro ? 'Platinum Elite' : 'Free Operator'}</p>
             </div>
             <div className="opacity-0 group-hover/user:opacity-100 transition-opacity absolute right-4">
               <LogoutButton />
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayoutClient({ 
  children, 
  isPro, 
  userEmail,
  trialEndsAt,
  isLocked = false
}: DashboardLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const trialDaysRemaining = trialEndsAt && mounted 
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
    : 14 // Default to 14 during SSR/Hydration to maintain consistency

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const commonProps = {
    mounted,
    pathname,
    isPro,
    trialDaysRemaining,
    userEmail
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden" suppressHydrationWarning>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col shadow-[1px_0_20px_rgba(0,0,0,0.02)] relative z-10 shrink-0" suppressHydrationWarning>
        <SidebarContent {...commonProps} />
      </aside>

      {/* Mobile Nav Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 flex items-center justify-between z-[100] shadow-sm">
        <Link href="/calculators" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
            <QCLogo size={20} isDark={true} />
          </div>
          <span className="text-[18px] font-black text-[#0F172A] tracking-tighter">QuoteCatch</span>
        </Link>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger
            render={
              <button 
                type="button" 
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }), 
                  "text-slate-900 bg-slate-50 border border-slate-100 rounded-xl h-10 px-3 hover:bg-slate-100 transition-colors"
                )}
              >
                <Menu className="w-5 h-5 font-black" />
              </button>
            }
          />
          <SheetContent side="left" className="p-0 w-[85vw] max-w-[320px] border-r-0 shadow-2xl overflow-hidden">
            <SidebarContent {...commonProps} />
          </SheetContent>
        </Sheet>
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        <main className={cn(
          "flex-1 overflow-auto relative custom-scrollbar scroll-smooth",
          "pt-16 lg:pt-0"
        )}>
          {isLocked && <LockoutOverlay />}
          
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <UserTierProvider isPro={isPro} trialDaysRemaining={trialDaysRemaining}>
              {children}
            </UserTierProvider>
          </div>
        </main>
      </div>
</div>
  )
}
