'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Cog6ToothIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useSidebarTitle } from '@/components/partials/SidebarTitleContext'

const DashboardTopNav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigateToAccountSettings = () => {
    setDropdownOpen(false)
    router.push('/dashboard/AccountSettings') 
  }

  const navigateBilling=()=> {
    setDropdownOpen(false)
    router.push('/dashboard/Billing')
  }
  const { title } = useSidebarTitle();
  return (
    <div className='sticky top-0 hidden md:flex justify-between bg-white items-center px-8 py-2  relative z-50'>
      <h1 className='text-xl font-bold w-full flex-1'>{title}</h1>

      <div className='flex items-center gap-6 relative'>
        {/* <button className='relative'>
          <Image src='/icons/notification.svg' width={24} height={24} alt="Notifications" />
          <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
        </button> */}

        <div className='relative' ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="w-8 h-8 overflow-hidden">
              {/* <Image
                src='/icons/Profile Picture.png'
                width={32}
                height={32}
                alt="Profile"
                className="object-cover"
              /> */}
            </div>
          </button>

          {dropdownOpen && (
            <div className='absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50'>
              <ul className='py-2 text-sm text-gray-700'>
                <li
                  className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick={navigateToAccountSettings}
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Account Settings</span>
                </li>
                <li
                  className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick={navigateBilling}
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Billings</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardTopNav





