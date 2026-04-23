"use client"

import { createContext, useContext, ReactNode } from 'react'

const UserTierContext = createContext({ isPro: false, trialDaysRemaining: 14 })

export function UserTierProvider({ children, isPro, trialDaysRemaining = 14 }: { children: ReactNode, isPro: boolean, trialDaysRemaining?: number }) {
  return (
    <UserTierContext.Provider value={{ isPro, trialDaysRemaining }}>
      {children}
    </UserTierContext.Provider>
  )
}

export function useUserTier() {
  return useContext(UserTierContext)
}
