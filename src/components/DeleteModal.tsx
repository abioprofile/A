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
        <h2 className="text-base md:text-lg font-bold">Are you sure you want to delete?</h2>
        {/* <p className="text-[10px] md:text-[12px]">Are you sure you want to delete this link?</p> */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="text-black font-bold px-3 md:px-4 py-1 md:py-2 border-1 border-black text-xs md:text-sm hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="bg-[#FED45C] text-xs md:text-sm font-bold px-3 md:px-4 py-1 md:py-2 "
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
