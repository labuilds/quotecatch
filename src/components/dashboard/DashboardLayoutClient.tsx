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
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-6 py-7">
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
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        <div className="text-[14px] font-black text-slate-400 tracking-widest px-4 mb-4">Menu</div>
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3.5 px-5 py-3.5 font-black rounded-2xl transition-all duration-200 group text-[18px] ${
              pathname === href 
                ? 'bg-slate-50 text-[#0F172A]' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-[#0F172A]'
            }`}
          >
            <Icon className={`w-[20px] h-[20px] shrink-0 transition-colors ${pathname === href ? 'text-red-700' : 'group-hover:text-red-700'}`} />
            {label}
          </Link>
        ))}
        
        <div className="pt-2">
          <SupportButton />
        </div>
      </nav>

      {/* User / Upgrade Card */}
      <div className="p-4 space-y-4 mt-auto mb-2">
        {!isPro && <SidebarUpgradeCard trialDaysRemaining={trialDaysRemaining} />}
        <div className="px-2">
          <div className="px-4 py-2 mb-2">
            <p className="text-[11px] font-black text-slate-400 tracking-widest leading-none mb-1.5 ml-0.5">Signed in as</p>
            <p className="text-[14px] font-bold text-slate-500 truncate">{userEmail}</p>
          </div>
          <LogoutButton />
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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between z-40">
        <Link href="/calculators" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
            <QCLogo size={18} isDark={true} />
          </div>
          <span className="text-[16px] font-black text-[#0F172A]">QuoteCatch</span>
        </Link>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger
            render={
              <button type="button" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-slate-600 gap-2 font-black px-2")}>
                <Menu className="w-5 h-5 text-slate-400" />
                <span className="text-[12px] uppercase tracking-wider">Menu</span>
              </button>
            }
          />
          <SheetContent side="left" className="p-0 border-none w-[280px]">
            <SidebarContent {...commonProps} />
          </SheetContent>
        </Sheet>
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        <main className={cn(
          "flex-1 overflow-auto relative custom-scrollbar scroll-smooth",
          (isPro || !trialEndsAt) && "pt-16 lg:pt-0"
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
