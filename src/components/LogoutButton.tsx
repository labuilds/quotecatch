"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-3 px-3 py-2 w-full text-left font-medium text-slate-700 rounded-md hover:bg-slate-100 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
      {isLoading ? "Signing out..." : "Logout"}
    </button>
  )
}
