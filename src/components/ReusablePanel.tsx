'use client';

type Props = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const ReusablePanel = ({ title, children, onClose }: Props) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-sm text-[#7140EB] hover:underline focus:outline-none"
        >
          Close
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ReusablePanel;
