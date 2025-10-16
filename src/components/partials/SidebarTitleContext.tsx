'use client'

import React, { createContext, useContext, useState } from 'react'

type SidebarTitleContextType = {
  title: string
  setTitle: (title: string) => void
}

const SidebarTitleContext = createContext<SidebarTitleContextType | undefined>(undefined)

export const SidebarTitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState('A.Bio Links')
  return (
    <SidebarTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </SidebarTitleContext.Provider>
  )
}

export const useSidebarTitle = () => {
  const context = useContext(SidebarTitleContext)
  if (!context) throw new Error('')
  return context
}
