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
  if (!mounted) return null

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto custom-scrollbar pt-24 lg:pt-0">
      <div className="px-7 py-10 shrink-0 hidden lg:block">
        <Link href="/calculators" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-0.5 duration-300 border border-slate-100">
            <QCLogo size={26} isDark={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-[24px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Roofing Intelligence</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 text-[18px] font-black",
              pathname === href 
                ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
        
        <div className="pt-8">
           <SupportButton />
        </div>
      </nav>

      <div className="p-7 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <div className="flex flex-col gap-6">
          {!isPro && <SidebarUpgradeCard trialDaysRemaining={trialDaysRemaining} />}
          
          <div className="space-y-4">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-red-600 text-lg shrink-0 overflow-hidden shadow-sm">
                 {userEmail?.charAt(0).toUpperCase() || 'U'}
               </div>
               <div className="flex flex-col min-w-0 flex-1">
                 <p className="text-[15px] font-black text-[#0F172A] truncate leading-none mb-1.5">{userEmail?.split('@')[0]}</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] truncate leading-none">{isPro ? 'Pro Member' : 'Free Trial'}</p>
               </div>
             </div>
             
             <LogoutButton />
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
        <Link href="/calculators" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
            <QCLogo size={22} isDark={true} />
          </div>
          <span className="text-[20px] font-black text-[#0F172A] tracking-tight">QuoteCatch</span>
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
          <SheetContent side="left" className="p-0 w-[85vw] max-w-[320px] border-r-0 shadow-2xl overflow-y-auto">
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
          {isLocked && <LockoutOverlay email={userEmail} />}
          
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
