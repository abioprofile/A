'use client';

import { useState } from 'react';
import { PencilIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function AccountSettings() {
  const router = useRouter();
  const [username, setUsername] = useState('davidosh');
  const [email, setEmail] = useState('davidosh2003@gmail.com');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUsernameChange = () => {
    const newUsername = prompt('Enter new username', username);
    if (newUsername && newUsername !== username) {
      setUsername(newUsername); 
    }
  };

  const handleEmailChange = () => {
    const newEmail = prompt('Enter new email', email);
    if (newEmail && newEmail !== email) {
      setEmail(newEmail);
    }
  };

  const handleSave = () => {
    // Implement save logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className="md:min-h-screen bg-[#Fff7de] md:bg-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-[#Fff7de]  border-b border-gray-200 px-4 py-6">
        <div className="flex md:hidden items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="p-2 flex gap-1 items-center -ml-2"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-800" />
          {/* Title */}
          <h1 className="text-[16px] font-semibold text-gray-900">
            Account Settings
          </h1>
          </button>


          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#FED45C] text-gray-900 text-sm font-medium rounded-lg hover:bg-[#E5C052] transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-[16px] font-bold mb-6 text-gray-800">Security</h2>

        {/* Username Section - Mobile Optimized */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Username</h3>
              <p className="text-gray-500 text-[12px] mt-1">
                The username associated with your account.
              </p>
            </div>
            <button
              onClick={handleUsernameChange}
              className="flex items-center gap-1 py-1 px-3 border border-gray-300 text-[12px] hover:bg-gray-50 hover:text-[#ff0000] transition-colors rounded"
            >
              Edit <PencilIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm font-medium">@{username}</p>
            <div className="flex items-center text-green-500 text-xs">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Verified
            </div>
          </div>
        </div>

        {/* Email Section - Mobile Optimized */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Email Address</h3>
              <p className="text-gray-500 text-[12px] mt-1">
                The email address associated with your account.
              </p>
            </div>
            <button
              onClick={handleEmailChange}
              className="flex items-center gap-1 py-1 px-3 border border-gray-300 text-[12px] hover:bg-gray-50 hover:text-[#ff0000] transition-colors rounded"
            >
              Edit <PencilIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm font-medium">{email}</p>
            <div className="flex items-center text-green-500 text-xs">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Verified
            </div>
          </div>
        </div>

        {/* Password Section - Mobile Optimized */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Password</h3>
              <p className="text-gray-500 text-[12px] mt-1">
                Set a unique password to protect your account.
              </p>
            </div>
            <button 
              className="px-4 py-1 text-[12px] font-medium border border-gray-500 hover:bg-[#FED45C] transition-colors rounded"
              onClick={() => alert('Password change flow would open here')}
            >
              Change
            </button>
          </div>
        </div>

        {/* 2FA Section - Mobile Optimized */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900">Two-Factor Authentication</h3>
              <p className="text-gray-500 text-[12px] mt-1">
                Add an extra layer of security to your account.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={is2FAEnabled}
                onChange={() => setIs2FAEnabled(!is2FAEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#7140EB] rounded-full peer peer-checked:ring-2 peer-checked:ring-[#7140EB] peer-checked:ring-opacity-50 transition-all duration-200">
                <div className="absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-transform duration-200" />
              </div>
            </label>
          </div>
        </div>

        {/* Restricted Members Section - Mobile Optimized */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Restricted Members</h3>
              <p className="text-gray-500 text-[12px] mt-1">
                Members you've restricted from interacting with your account.
              </p>
            </div>
            <span className="text-sm text-gray-400">None</span>
          </div>
        </div>

        {/* Deactivate Account Section - Mobile Optimized */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm text-gray-900">Deactivate Account</h3>
              <p className="text-gray-500 text-[12px] mt-1">
                Temporarily disable your account. You can reactivate later.
              </p>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>

        {/* Delete Account Section - Mobile Optimized */}
        <div className="border-t border-red-100 pt-6 mt-6 bg-red-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm text-red-600">Delete Account</h3>
              <p className="text-red-500 text-[12px] mt-1">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-sm text-red-600 hover:underline transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Modals - Mobile Optimized */}
        {showDeactivateModal && (
          <div className="fixed  bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Deactivate Account</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to deactivate your account? You can reactivate it by logging in again.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeactivateModal(false);
                    // Implement deactivation logic
                  }}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg flex-1"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Delete Account Permanently</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    // Implement delete logic
                  }}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}