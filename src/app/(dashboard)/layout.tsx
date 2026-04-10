import Link from 'next/link'
import { Calculator, Users, Settings, Home, Zap, Heart, CreditCard } from 'lucide-react'
import { QCLogo } from '@/components/QCLogo'

import { ReactNode } from 'react'
import LogoutButton from '@/components/LogoutButton'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { UserTierProvider } from '@/components/UserTierProvider'
import { SupportButton } from '@/components/SupportModal'

import { SidebarUpgradeCard } from '@/components/SidebarUpgradeCard'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userProfile } = await supabase
    .from('users').select('is_pro').eq('id', user.id).single();

  const isPro = userProfile?.is_pro ?? false;

  const navItems = [
    { href: '/calculators', icon: Calculator, label: 'Calculators' },
    { href: '/leads', icon: Users, label: 'Leads' },
    { href: '/billing', icon: CreditCard, label: 'Billing' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-[1px_0_20px_rgba(0,0,0,0.02)] relative z-10 shrink-0">
        {/* Logo */}
        <div className="px-6 py-7">
          <Link href="/calculators" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 bg-[#0F172A] rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(15,23,42,0.15)] group-hover:shadow-[0_12px_24px_rgba(15,23,42,0.2)] transition-all group-hover:-translate-y-0.5 duration-300">
              <QCLogo size={24} isDark={false} />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-black tracking-tight text-[#0F172A]">QuoteCatch</span>
              <span className="text-[12px] font-extrabold tracking-[0.05em] text-slate-400 uppercase leading-none">Roofing Intelligence</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <div className="text-[13px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Menu</div>
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:text-[#0F172A] transition-all duration-200 group text-[16px]"
            >
              <Icon className="w-[20px] h-[20px] shrink-0 transition-colors group-hover:text-red-700" />
              {label}
            </Link>
          ))}
          
          <div className="pt-6">
            <div className="text-[13px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Support</div>
            <SupportButton />
          </div>
        </nav>

        {/* User / Upgrade Card */}
        <div className="p-4 space-y-4 mb-4">
          {!isPro && <SidebarUpgradeCard />}
          
          <div className="px-2">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="p-8 max-w-7xl mx-auto">
          <UserTierProvider isPro={isPro}>
            {children}
          </UserTierProvider>
        </div>
      </main>
    </div>
  )
}
