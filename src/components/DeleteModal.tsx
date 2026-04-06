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
      <div className="w-full max-w-xs md:max-w-sm mx-auto text-center space-y-3">
        <h2 className="text-sm md:text-base font-bold">Are you sure you want to delete?</h2>
        <div className="flex justify-center gap-4 mt-5">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="text-black font-medium px-5 py-2 border border-black text-sm hover:text-white hover:bg-[#ff0000] transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="shadow-[4px_4px_0px_0px_#000000] font-semibold bg-[#fed45c] px-5 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
