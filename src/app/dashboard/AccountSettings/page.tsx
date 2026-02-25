'use client';

import { useState, useRef, useEffect } from 'react';
import { PencilIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ChevronLeft, LogOut, AtSign, Mail, X, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/stores/hooks';
import { clearAuth } from '@/stores/slices/auth.slice';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type EditModalType = 'username' | 'email' | null;

const USERNAME_MAX = 30;
const EMAIL_MAX = 254;

export default function AccountSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('davidosh');
  const [email, setEmail] = useState('davidosh2003@gmail.com');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editModalType, setEditModalType] = useState<EditModalType>(null);
  const [editModalValue, setEditModalValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwShowCurrent, setPwShowCurrent] = useState(false);
  const [pwShowNew, setPwShowNew] = useState(false);
  const [pwShowConfirm, setPwShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwErrors, setPwErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});

  const getStrength = (pw: string): { score: number; label: string; color: string } => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 2) return { score, label: 'Fair', color: '#f97316' };
    if (score <= 3) return { score, label: 'Good', color: '#eab308' };
    if (score <= 4) return { score, label: 'Strong', color: '#22c55e' };
    return { score, label: 'Very strong', color: '#16a34a' };
  };

  const pwStrength = getStrength(pwNew);
  const pwMismatch = pwConfirm.length > 0 && pwNew !== pwConfirm;
  const pwMatch = pwConfirm.length > 0 && pwNew === pwConfirm;

  const openPasswordModal = () => {
    setPwCurrent(''); setPwNew(''); setPwConfirm('');
    setPwShowCurrent(false); setPwShowNew(false); setPwShowConfirm(false);
    setPwErrors({});
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPwErrors({});
  };

  const handlePasswordSave = async () => {
    const errs: typeof pwErrors = {};
    if (!pwCurrent) errs.current = 'Current password is required';
    if (!pwNew) errs.new = 'New password is required';
    else if (pwNew.length < 8) errs.new = 'Must be at least 8 characters';
    if (!pwConfirm) errs.confirm = 'Please confirm your new password';
    else if (pwNew !== pwConfirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setPwSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setPwSaving(false);
    toast.success('Password updated successfully');
    closePasswordModal();
  };

  const currentMax = editModalType === 'username' ? USERNAME_MAX : EMAIL_MAX;
  const isEmailModal = editModalType === 'email';
  const hasChanged = editModalType
    ? editModalValue.trim() !== (editModalType === 'username' ? username : email)
    : false;
  const isEmpty = editModalValue.trim() === '';

  useEffect(() => {
    if (editModalType) {
      // focus after animation settles
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [editModalType]);

  const openEditModal = (type: 'username' | 'email') => {
    setEditModalType(type);
    setEditModalValue(type === 'username' ? username : email);
    setIsSaving(false);
  };

  const closeEditModal = () => {
    setEditModalType(null);
    setEditModalValue('');
  };

  const handleEditSave = async () => {
    const trimmed = editModalValue.trim();
    if (!trimmed) {
      toast.error(editModalType === 'username' ? 'Username cannot be empty' : 'Email cannot be empty');
      return;
    }
    if (!hasChanged) { closeEditModal(); return; }

    setIsSaving(true);
    // simulate async save
    await new Promise((r) => setTimeout(r, 800));

    if (editModalType === 'username') {
      setUsername(trimmed);
      toast.success('Username updated');
    } else if (editModalType === 'email') {
      setEmail(trimmed);
      toast.success('Email updated');
    }
    setIsSaving(false);
    closeEditModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEditSave();
    if (e.key === 'Escape') closeEditModal();
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    queryClient.clear();
    toast.success('Logged out successfully');
    router.push('/auth/sign-in');
  };

  return (
    <div className="min-h-screen bg-[#Fff7de] md:p-4 md:bg-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 px-4 py-6">
        <div className="flex md:hidden items-center justify-between">
          <button onClick={() => router.back()} className="p-2 flex gap-1 items-center -ml-2">
            <ChevronLeft className="inline mr-2" />
            <h1 className="font-extrabold text-[18px] text-[#331400]">Account Settings</h1>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-[20px] font-bold mb-6 text-gray-800">Personal Information</h2>

        {/* Username */}
        <div className="md:border-t md:border-gray-200 md:pt-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Username</h3>
              <p className="text-gray-500 text-[12px] mt-1">The username associated with your account.</p>
            </div>
            <button
              onClick={() => openEditModal('username')}
              className="flex items-center cursor-pointer gap-1 py-1 px-3 border border-gray-300 text-[12px] hover:bg-gray-50 hover:text-[#ff0000] transition-colors"
            >
              Edit <PencilIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="hidden md:flex items-center justify-between mt-3">
            <p className="text-sm font-medium">@{username}</p>
            <div className="flex items-center text-green-500 text-xs">
              <CheckCircleIcon className="w-3 h-3 mr-1" /> Verified
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Email Address</h3>
              <p className="text-gray-500 text-[12px] mt-1">The email address associated with your account.</p>
            </div>
            <button
              onClick={() => openEditModal('email')}
              className="flex items-center cursor-pointer gap-1 py-1 px-3 border border-gray-300 text-[12px] hover:bg-gray-50 hover:text-[#ff0000] transition-colors"
            >
              Edit <PencilIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="hidden md:flex items-center justify-between mt-3">
            <p className="text-sm font-medium">{email}</p>
            <div className="flex items-center text-green-500 text-xs">
              <CheckCircleIcon className="w-3 h-3 mr-1" /> Verified
            </div>
          </div>
        </div>

        <h2 className="text-[20px] font-bold my-6 text-gray-800">Security</h2>

        {/* Password */}
        <div className="md:border-t md:border-gray-200 md:pt-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Password</h3>
              <p className="text-gray-500 text-[12px] mt-1">Set a unique password to protect your account.</p>
            </div>
            <button
              className="px-4 py-1 text-[12px] font-medium border cursor-pointer border-gray-500 hover:bg-[#FED45C] transition-colors"
              onClick={openPasswordModal}
            >
              Change
            </button>
          </div>
        </div>

        {/* 2FA */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900">Two-Factor Authentication</h3>
              <p className="text-gray-500 text-[12px] mt-1">Add an extra layer of security to your account.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" className="sr-only peer" checked={is2FAEnabled} onChange={() => setIs2FAEnabled(!is2FAEnabled)} />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#7140EB] rounded-full peer peer-checked:ring-2 peer-checked:ring-[#7140EB] peer-checked:ring-opacity-50 transition-all duration-200">
                <div className="absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-transform duration-200" />
              </div>
            </label>
          </div>
        </div>


        {/* Delete */}
        <div className="border-t border-red-100 pt-6 mt-6 bg-red-50 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm text-red-600">Delete Account</h3>
              <p className="text-red-500 text-[12px] mt-1">Permanently delete your account and all associated data.</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)} className="text-sm cursor-pointer text-red-600 hover:underline transition-colors">
              Delete
            </button>
          </div>
        </div>

        {/* Mobile Logout */}
        <div className="hidden border-t border-gray-200 pt-4 mt-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50  w-full transition">
            <LogOut size={16} /> Log Out
          </button>
        </div>

        {/* ─── EDIT MODAL ─────────────────────────────────── */}
        <AnimatePresence>
          {editModalType && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closeEditModal}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] p-0 sm:p-4"
            >
              <motion.div
                key="modal"
                initial={{ y: 40, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 30, opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-md bg-white  shadow-2xl overflow-hidden"
              >
                {/* Top accent bar */}
                

                {/* Drag handle (mobile) */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                <div className="px-6 pt-4 pb-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-9 h-9  bg-[#FFF7DE] border border-[#FED45C]/60">
                        {isEmailModal
                          ? <Mail className="w-4 h-4 text-[#331400]" />
                          : <AtSign className="w-4 h-4 text-[#331400]" />}
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-[#331400] leading-tight">
                          {isEmailModal ? 'Edit Email Address' : 'Edit Username'}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {isEmailModal ? 'Used for sign‑in & notifications' : 'Visible in your profile URL'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeEditModal}
                      className="p-1.5 cursor-pointer  text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-4" />

                  {/* Input group */}
                  <div className="relative">
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      {isEmailModal ? 'Email Address' : 'Username'}
                    </label>
                    <div className="relative">
                      {/* Prefix icon */}
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {isEmailModal
                          ? <Mail className="w-4 h-4" />
                          : <span className="text-sm font-medium select-none">@</span>}
                      </div>
                      <input
                        ref={inputRef}
                        type={isEmailModal ? 'email' : 'text'}
                        value={editModalValue}
                        maxLength={currentMax}
                        onChange={(e) => setEditModalValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isEmailModal ? 'you@example.com' : 'your_username'}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200  bg-gray-50 text-gray-900 placeholder:text-gray-400
                          outline-none ring-0
                          focus:border-[#331400] focus:bg-white focus:ring-2 focus:ring-[#331400]/10
                          transition-all duration-150"
                      />
                    </div>

                    {/* Character count + hint row */}
                    <div className="flex items-center justify-between mt-1.5 px-0.5">
                      <p className="text-[11px] text-gray-400">
                        {isEmailModal
                          ? "We'll send account notifications here."
                          : 'Only letters, numbers, and underscores.'}
                      </p>
                      <span className={`text-[11px] tabular-nums transition-colors ${
                        editModalValue.length >= currentMax * 0.9 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {editModalValue.length}/{currentMax}
                      </span>
                    </div>
                  </div>

                  {/* Pill showing current value */}
                  {hasChanged && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-200  px-3 py-2"
                    >
                      <span className="text-gray-400">Current:</span>
                      <span className="font-medium text-gray-700 truncate">
                        {isEmailModal ? email : `@${username}`}
                      </span>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2.5 mt-5">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="flex-1 py-2.5 px-4 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleEditSave}
                      disabled={isEmpty || isSaving}
                      className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-[#331400] 
                        hover:bg-[#4a1f00] active:scale-[0.98]
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-150 cursor-pointer relative overflow-hidden"
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                            className="block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
                          />
                          Saving…
                        </span>
                      ) : (
                        <>
                          {hasChanged ? 'Save Changes' : 'Done'}
                          {/* yellow shimmer on hover when there are changes */}
                          {hasChanged && (
                            <span className="absolute inset-0 bg-[#FED45C]/10 opacity-0 cursor-pointer hover:opacity-100 transition-opacity" />
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── CHANGE PASSWORD MODAL ────────────────────────── */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              key="pw-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closePasswordModal}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] p-0 sm:p-4"
            >
              <motion.div
                key="pw-modal"
                initial={{ y: 40, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 30, opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-md bg-white  shadow-2xl overflow-hidden"
              >
                {/* Top accent bar */}
                

                {/* Mobile drag handle */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                <div className="px-6 pt-4 pb-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-9 h-9  bg-[#FFF7DE] border border-[#FED45C]/60">
                        <KeyRound className="w-4 h-4 text-[#331400]" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-[#331400] leading-tight">Change Password</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Choose a strong, unique password</p>
                      </div>
                    </div>
                    <button
                      onClick={closePasswordModal}
                      className="p-1.5  text-gray-400 cursor-pointer hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="border-t border-gray-100 my-4" />

                  {/* Fields */}
                  <div className="space-y-3">

                    {/* Current password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          type={pwShowCurrent ? 'text' : 'password'}
                          value={pwCurrent}
                          onChange={(e) => { setPwCurrent(e.target.value); setPwErrors((p) => ({ ...p, current: undefined })); }}
                          onKeyDown={(e) => e.key === 'Escape' && closePasswordModal()}
                          placeholder="Enter current password"
                          className={`w-full pl-9 pr-10 py-2.5 text-sm border  bg-gray-50 text-gray-900 placeholder:text-gray-400
                            outline-none ring-0 transition-all duration-150
                            focus:bg-white focus:ring-2
                            ${pwErrors.current
                              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
                              : 'border-gray-200 focus:border-[#331400] focus:ring-[#331400]/10'
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setPwShowCurrent((v) => !v)}
                          className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {pwShowCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {pwErrors.current && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-[11px] text-red-500">
                          {pwErrors.current}
                        </motion.p>
                      )}
                    </div>

                    {/* New password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <input
                          type={pwShowNew ? 'text' : 'password'}
                          value={pwNew}
                          onChange={(e) => { setPwNew(e.target.value); setPwErrors((p) => ({ ...p, new: undefined })); }}
                          onKeyDown={(e) => e.key === 'Escape' && closePasswordModal()}
                          placeholder="Create a new password"
                          className={`w-full pl-9 pr-10 py-2.5 text-sm border  bg-gray-50 text-gray-900 placeholder:text-gray-400
                            outline-none ring-0 transition-all duration-150
                            focus:bg-white focus:ring-2
                            ${pwErrors.new
                              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
                              : 'border-gray-200 focus:border-[#331400] focus:ring-[#331400]/10'
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setPwShowNew((v) => !v)}
                          className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {pwShowNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Strength meter */}
                      {pwNew.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                style={{ backgroundColor: i <= pwStrength.score ? pwStrength.color : '#e5e7eb' }}
                              />
                            ))}
                          </div>
                          <p className="text-[11px] font-medium" style={{ color: pwStrength.color }}>
                            {pwStrength.label}
                          </p>
                        </motion.div>
                      )}

                      {pwErrors.new && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-[11px] text-red-500">
                          {pwErrors.new}
                        </motion.p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          {pwMatch
                            ? <ShieldCheck className="w-4 h-4 text-green-500" />
                            : <ShieldCheck className="w-4 h-4" />}
                        </div>
                        <input
                          type={pwShowConfirm ? 'text' : 'password'}
                          value={pwConfirm}
                          onChange={(e) => { setPwConfirm(e.target.value); setPwErrors((p) => ({ ...p, confirm: undefined })); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordSave(); if (e.key === 'Escape') closePasswordModal(); }}
                          placeholder="Repeat new password"
                          className={`w-full pl-9 pr-10 py-2.5 text-sm border bg-gray-50 text-gray-900 placeholder:text-gray-400
                            outline-none ring-0 transition-all duration-150
                            focus:bg-white focus:ring-2
                            ${pwMismatch || pwErrors.confirm
                              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
                              : pwMatch
                                ? 'border-green-400 focus:border-green-400 focus:ring-green-400/10'
                                : 'border-gray-200 focus:border-[#331400] focus:ring-[#331400]/10'
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setPwShowConfirm((v) => !v)}
                          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {pwShowConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <AnimatePresence mode="wait">
                        {(pwErrors.confirm || pwMismatch) && (
                          <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 text-[11px] text-red-500">
                            {pwErrors.confirm || 'Passwords do not match'}
                          </motion.p>
                        )}
                        {pwMatch && !pwErrors.confirm && (
                          <motion.p key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 text-[11px] text-green-600 font-medium">
                            Passwords match ✓
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 mt-6">
                    <button
                      type="button"
                      onClick={closePasswordModal}
                      className="flex-1 py-2.5 px-4 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handlePasswordSave}
                      disabled={pwSaving}
                      className="flex-1 py-2.5 px-4 cursor-pointer text-sm font-semibold text-white bg-[#331400] 
                        hover:bg-[#4a1f00] active:scale-[0.98]
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-150 relative overflow-hidden"
                    >
                      {pwSaving ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                            className="block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
                          />
                          Updating…
                        </span>
                      ) : 'Update Password'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        
        {/* ─── DELETE MODAL ─────────────────────────────────── */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white  p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Delete Account Permanently</h3>
              <p className="text-gray-600 mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50  flex-1">Cancel</button>
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 cursor-pointer bg-red-600 text-white hover:bg-red-700  flex-1">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}