'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 h-screen flex items-center justify-center">
      {/* Background blur and dim */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={cn("relative bg-white p-6 z-50 shadow-md", className)}>
        {children}
      </div>
    </div>
  )
}

export default Modal
