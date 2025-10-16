// components/EditModal.tsx
'use client';

import { FC } from 'react';
import Modal from '@/components/ui/modal';
import { toast } from 'sonner';

type EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (platform: string, url: string) => void;
  initialPlatform: string;
  initialUrl: string;
};

const EditModal: FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlatform,
  initialUrl,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const platform = (form.elements.namedItem('platform') as HTMLInputElement).value;
    const url = (form.elements.namedItem('url') as HTMLInputElement).value;
    
    onSave(platform, url);
    toast.success('Link updated');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full md:w-[400px] mx-auto">
        <h2 className="text-base md:text-lg font-semibold text-center mb-3 md:mb-4">Edit Link</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 md:mb-4">
            <label htmlFor="platform" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <input
              id="platform"
              name="platform"
              type="text"
              defaultValue={initialPlatform}
              className="w-full border border-2 border-[#7140EB80] rounded-md px-3 py-2 text-xs md:text-sm"
              required
            />
          </div>

          <div className="mb-3 md:mb-4">
            <label htmlFor="url" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              defaultValue={initialUrl}
              className="w-full border border-2 border-[#7140EB80] rounded-md px-3 py-2 text-xs md:text-sm"
              required
            />
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] w-full text-white px-4 py-2 text-xs md:text-sm rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditModal;