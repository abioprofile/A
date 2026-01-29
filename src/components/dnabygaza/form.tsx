'use client'
import React, { useState, FormEvent } from 'react'

type FormStatus = 'idle' | 'loading' | 'ok' | 'err'

export default function DnaFormV1() {
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [dob, setDob] = useState<string>('') // Date of Birth as DD/MM
  const [status, setStatus] = useState<FormStatus>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    
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

  // Helper function to validate DOB format (DD/MM)
  const validateDOB = (value: string): boolean => {
    if (value.length > 5) return false // DD/MM is max 5 characters including slash
    
    // Allow only numbers and slash
    const regex = /^[0-9/]*$/
    return regex.test(value)
  }

  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (!validateDOB(value)) return
    
    // Auto-format as DD/MM
    if (value.length === 2 && dob.length === 1) {
      setDob(value + '/')
    } else {
      setDob(value)
    }
  }

  return (
    <div className="relative">
      <form
        onSubmit={submit}
        className="p-3 bg-[#000000]/35 backdrop-blur-md space-y-4 text-center border border-white/10"
      >
        <h2 className="text-lg font-semibold text-white tracking-wide">
          DNA Checkup
        </h2>

        {/* Name */}
        <input
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full p-3 bg-white/10 border border-white/70 text-sm placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
          required
          disabled={status === 'loading'}
        />

        {/* DOB */}
        <div className="text-left">
          <label className="text-xs text-white mb-1 block">Date of Birth</label>
          <input
            type="text"
            value={dob}
            onChange={handleDOBChange}
            placeholder="DD/MM"
            maxLength={5}
            pattern="\d{2}/\d{2}"
            className="w-full p-3 bg-white/10 border border-white/70 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF0000] placeholder-gray-300"
            required
            disabled={status === 'loading'}
          />
          <p className="text-xs text-gray-400 mt-1">Format: DD/MM (e.g., 15/05 for May 15th)</p>
        </div>

        {/* Phone number */}
        <div className="text-left">
          <label className="text-xs text-white mb-1 block">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            placeholder="+234"
            pattern="^\+?[\d\s\-\(\)]+$"
            className="w-full p-3 bg-white/10 border border-white/70 text-sm placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
            required
            disabled={status === 'loading'}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full p-3 bg-white text-black font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
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