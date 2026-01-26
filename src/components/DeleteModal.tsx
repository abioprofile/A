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
        <h2 className="text-[13px] md:text-lg font-bold">Are you sure you want to delete?</h2>
        {/* <p className="text-[10px] md:text-[12px]">Are you sure you want to delete this link?</p> */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="text-black font-medium px-4 py-2 border-1 border-black text-[12px] hover:text-white hover:bg-[#ff0000]"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className=" text-[13px] shadow-[4px_4px_0px_0px_#000000] font-semibold bg-[#fed45c] px-4 py-2 text-[12px]  "
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
