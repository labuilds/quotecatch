"use client"

import { createContext, useContext, ReactNode } from 'react'

const UserTierContext = createContext({ isPro: false })

export function UserTierProvider({ children, isPro }: { children: ReactNode, isPro: boolean }) {
  return (
    <UserTierContext.Provider value={{ isPro }}>
      {children}
    </UserTierContext.Provider>
  )
}

export function useUserTier() {
  return useContext(UserTierContext)
}
