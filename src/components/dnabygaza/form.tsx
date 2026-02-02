'use client'
import React, { useState, FormEvent } from 'react'

type FormStatus = 'idle' | 'loading' | 'ok' | 'err'

export default function DnaFormV1() {
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [dob, setDob] = useState<string>('') // Date of Birth as DD/MM
  const [status, setStatus] = useState<FormStatus>('idle')
  const [dobError, setDobError] = useState<string>('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // Validate DOB before submitting
    if (!validateDOBFormat(dob)) {
      setDobError('Please enter a valid date in DD/MM format')
      return
    }
    
    setStatus('loading')
    setDobError('')
    
    try {
      const res = await fetch('https://sheetdb.io/api/v1/02p8r1kfblerq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              name,
              phone,
              dob,
            },
          ],
        }),
      })

      if (res.ok) {
        setStatus('ok')
        setName('')
        setPhone('')
        setDob('')
        setDobError('')
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setStatus('idle')
        }, 3000)
      } else {
        setStatus('err')
      }
    } catch (err) {
      console.error(err)
      setStatus('err')
    }
  }

  // Strict DOB validation
  const validateDOBFormat = (value: string): boolean => {
    // Check if format is exactly DD/MM
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/
    return regex.test(value)
  }

  // Validate if date is valid (e.g., not 31/02)
  const isValidDate = (day: number, month: number): boolean => {
    // Check month range
    if (month < 1 || month > 12) return false
    
    // Days in each month
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    
    // Check day range for the given month
    return day >= 1 && day <= daysInMonth[month - 1]
  }

  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Remove any non-digit characters except slash
    value = value.replace(/[^0-9/]/g, '')
    
    // Don't allow more than 5 characters
    if (value.length > 5) return
    
    // Auto-format as DD/MM
    if (value.length === 2 && dob.length <= 2) {
      // When user types 2 digits, auto-add slash
      if (value.length === 2 && !value.includes('/')) {
        // Validate first two digits as day (01-31)
        const day = parseInt(value)
        if (day < 1 || day > 31) {
          setDobError('Day must be between 01 and 31')
          setDob(value)
          return
        }
        setDobError('')
        setDob(value + '/')
        return
      }
    }
    
    // Handle backspace deletion
    if (value.length === 2 && dob.length === 3) {
      // User deleted the slash
      setDob(value)
      return
    }
    
    // Validate as user types
    if (value.includes('/') && value.length >= 4) {
      const parts = value.split('/')
      if (parts.length === 2) {
        const day = parseInt(parts[0])
        const month = parseInt(parts[1])
        
        // Validate day (01-31)
        if (day < 1 || day > 31) {
          setDobError('Day must be between 01 and 31')
        }
        // Validate month (01-12)
        else if (month < 1 || month > 12) {
          setDobError('Month must be between 01 and 12')
        }
        // Validate specific date (e.g., not 31/02)
        else if (!isValidDate(day, month)) {
          setDobError(`Invalid date: ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')} doesn't exist`)
        }
        else {
          setDobError('')
        }
      }
    } else if (value.length === 0) {
      setDobError('')
    }
    
    setDob(value)
  }

  const handleDOBBlur = () => {
    if (dob.length === 5 && !validateDOBFormat(dob)) {
      setDobError('Please enter a valid date in DD/MM format (e.g., 15/05)')
    } else if (dob.length > 0 && dob.length < 5) {
      setDobError('Please complete the date in DD/MM format')
    }
  }

  return (
    <div className="relative">
      <form
        onSubmit={submit}
        className="p-3 bg-[#000000]/35 backdrop-blur-md space-y-4 text-center border border-white/10"
      >
        <h2 className="text-[14px] font-semibold text-white tracking-wide">
          DNA Checkup
        </h2>

        {/* Name */}
        <input
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full p-2 bg-white/10 border border-white/70 text-[10px] placeholder:text-[10px] placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
          required
          disabled={status === 'loading'}
        />

        {/* DOB */}
        <div className="text-left">
          <label className="text-[10px] text-white mb-1 block">Date of Birth</label>
          <input
            type="text"
            value={dob}
            onChange={handleDOBChange}
            onBlur={handleDOBBlur}
            placeholder="DD/MM"
            maxLength={5}
            pattern="\d{2}/\d{2}"
            className={`w-full p-2 bg-white/10 border text-[10px] border-white/70 placeholder:text-[10px] text-white focus:outline-none focus:ring-2 focus:ring-[#FF0000] placeholder-gray-300 ${
              dobError ? 'border-red-500' : ''
            }`}
            required
            disabled={status === 'loading'}
          />
          {dobError ? (
            <p className="text-[9px] text-red-400 mt-1">{dobError}</p>
          ) : (
            <p className="text-[9px] text-gray-400 mt-1">Format: DD/MM (e.g., 15/05 for May 15th)</p>
          )}
        </div>

        {/* Phone number */}
        <div className="text-left">
          <label className="text-[10px] text-white mb-1 block">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            placeholder="+234"
            pattern="^\+?[\d\s\-\(\)]+$"
            className="w-full p-2 bg-white/10 border border-white/70 text-[10px] placeholder:text-[10px] placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
            required
            disabled={status === 'loading'}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !!dobError}
          className="w-full p-2 bg-white text-[10px] text-black font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit'}
        </button>

        {status === 'ok' && (
          <p className="text-green-300 text-xs animate-pulse mt-2">
            ✅ Thanks, we received your information!
          </p>
        )}
        {status === 'err' && (
          <p className="text-red-400 text-xs animate-pulse mt-2">
            ⚠️ Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  )
}