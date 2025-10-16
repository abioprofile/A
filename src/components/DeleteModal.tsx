// components/DeleteModal.tsx
'use client';

import { FC } from 'react';
import Modal from '@/components/ui/modal';

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal: FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[300px] md:w-[400px] mx-auto text-center space-y-3 md:space-y-4">
        <h2 className="text-base md:text-lg font-bold">Delete Link</h2>
        <p className="text-[10px] md:text-[12px]">Are you sure you want to delete this link?</p>
        <div className="flex justify-center gap-3 md:gap-4 mt-3 md:mt-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-white font-medium px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-xs md:text-sm font-medium px-3 md:px-4 py-1 md:py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
