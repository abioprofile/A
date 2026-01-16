'use client';

import { useState } from 'react';
import { PencilIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AccountSettings() {
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

  return (
    <div className="max-w-6xl bg-[#FFF7DE] h-[100vh] md:bg-transparent mx-auto md:my-6 p-4">
      <h1 className="text-2xl font-bold mb-8">Security</h1>

      {/* Username Section */}
      <SettingRow
        label="Username"
        value={`@${username}`}
        description="The username associated with your account."
        verified
        onEdit={handleUsernameChange}
      />

      {/* Email Section */}
      <SettingRow
        label="Email Address"
        value={email}
        description="The email address associated with your account."
        verified
        onEdit={handleEmailChange}
      />

      {/* Password Section */}
      <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm">Password</h3>
          <p className="text-gray-500 text-[12px] mt-1">
            Set a unique password to protect your account.
          </p>
        </div>
        <button 
          className="px-4 py-1 text-[12px] font-medium  border border-gray-500  hover:bg-[#FED45C]   transition-colors"
          onClick={() => {
            
            alert('Password change flow would open here');
          }}
        >
          Change Password
        </button>
      </div>

      {/* 2FA Section */}
      <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm">Two-Factor Authentication</h3>
          <p className="text-gray-500 text-[12px] mt-1">
            Add an extra layer of security to your account.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
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

      {/* Restricted Members Section */}
      <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm">Restricted Members</h3>
          <p className="text-gray-500 text-[12px] mt-1">
            Members you've restricted from interacting with your account.
          </p>
        </div>
        <span className="text-sm text-gray-400">None</span>
      </div>

      {/* Deactivate Account Section */}
      <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm">Deactivate Account</h3>
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

      {/* Delete Account Section */}
      <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm text-red-600">Delete Account</h3>
          <p className="text-gray-500 text-[12px] mt-1">
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

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6  7 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Deactivate Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate your account? You can reactivate it by logging in again.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-gray-300  text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  // Implement deactivation logic
                }}
                className="px-4 py-2 bg-red-600 text-white  hover:bg-red-700"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delete Account Permanently</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type SettingRowProps = {
  label: string;
  value: string;
  description: string;
  verified?: boolean;
  onEdit?: () => void;
};

const SettingRow = ({ label, value, description, verified, onEdit }: SettingRowProps) => (
  <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-start">
    <div className="flex-1">
      <h3 className="font-semibold text-sm">{label}</h3>
      <p className="text-gray-500 text-[12px] mt-1">{description}</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium">{value}</p>
        {verified && (
          <div className="flex items-center justify-end text-green-500 text-xs mt-1">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Verified
          </div>
        )}
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 py-1 px-3 border border-gray-300 text-[12px] hover:bg-gray-50 hover:text-[#ff0000] transition-colors"
        >
          Edit <PencilIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
);