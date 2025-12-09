'use client';
import { PencilIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const history = [
  {
    date: '12/06/2024',
    order: '12234567890',
    product: 'Apcard 5',
    amount: '₦35,000',
    status: 'Successful',
  },
  {
    date: '22/07/2024',
    order: '12334567890',
    product: 'Apcard 5 plus',
    amount: '₦50,000',
    status: 'Failed',
  },
  {
    date: '22/07/2024',
    order: '12223456789',
    product: 'Apcard 5 plus',
    amount: '₦50,000',
    status: 'Successful',
  },
  {
    date: '22/07/2024',
    order: '12345678954',
    product: 'Apcard 5',
    amount: '₦35,000',
    status: 'Successful',
  },
  {
    date: '22/07/2024',
    order: '12345678900',
    product: 'Apcard 5 plus',
    amount: '₦50,000',
    status: 'Successful',
  },
  {
    date: '22/07/2024',
    order: '12342345678',
    product: 'Apcard 5',
    amount: '₦50,000',
    status: 'Successful',
  },
  {
    date: '22/07/2024',
    order: '12345678909',
    product: 'Apcard 5',
    amount: '₦35,000',
    status: 'Successful',
  },
  {
    date: '22/07/2024',
    order: '12345678909',
    product: 'Apcard 5 plus',
    amount: '₦50,000',
    status: 'Successful',
  },
  {
    date: '22/07/2024',
    order: '12345678769',
    product: 'Apcard 5 plus',
    amount: '₦50,000',
    status: 'Successful',
  },
];

export default function Billing() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Plan section */}
      <div className='p-6 bg-[#FEF4EA] mb-4'>
        
      <div className="bg-[#fff] p-6  text- mb-6">
        <h2 className="text-xl font-bold mb-1">Free Plan</h2>
        <p className="text-[12px]  mb-6">You can edit your card details here</p>

        <p className="font-bold mb-2 text-[15px]">Payment method</p>
        <div className="bg-[#FFE4A5] text-black p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/icons/Visa icon.png" alt="Visa" width={60} height={40} className="mr-4" />
            <div className="text-sm">
              <p className="font-semibold mb-2">Visa ending in 1234</p>
              <p className="text-[10px] text-gray-700 mb-2">Expiry 06/2024</p>
              <p className="text-[10px] text-gray-700 mb-1">💳 davidosh2003@gmail.com</p>
            </div>
          </div>
          <button className="bg-[#5D2D2B] hover:bg-[#5D2D2a] text-white text-sm px-6 py-1 flex items-center gap-1 transition">
            Edit
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      </div>

      {/* Billing history */}
      <div className='bg-[#FEF4EA] p-6'>
        <h2 className="text-xl font-bold mb-1">Billing history</h2>
        <p className="text-[12px] text-gray-600 mb-4">Get records of orders purchased</p>

        <div className="overflow-x-auto border border-[#B698FF] ">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-[#F9F9F9] text-left">
              <tr>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Order number</th>
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold">Amount</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index} className="border-t text-[12px] border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{item.date}</td>
                  <td className="py-3 px-4">{item.order}</td>
                  <td className="py-3 px-4">{item.product}</td>
                  <td className="py-3 px-4">{item.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-medium px-2 py-1  ${
                        item.status === 'Successful'
                          ? 'text-green-700 bg-green-100'
                          : 'text-red-600 bg-red-100'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#331400] font-medium hover:underline cursor-pointer">
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
