'use client'
import React, { useEffect, useState } from 'react';
import { FaInstagram, FaTwitter, FaMousePointer, FaLinkedin } from "react-icons/fa";
import { FiEye, FiTrendingUp, FiSmartphone, FiMonitor, FiTablet } from "react-icons/fi";
import { IconType } from "react-icons";
import Skeleton from '@/components/Skeleton/Skeleton';

interface StatCardProps {
  icon?: IconType;
  value: number;
  subtitle: string;
  color?: string;
}

interface TableRowProps {
  icon?: IconType | null;
  name: string;
  views: number;
  clicks: number;
  clickRate: number;
  isDevice?: boolean;
  flag?: string;
}

interface LinkPerformance extends Omit<TableRowProps, 'isDevice' | 'flag'> {}
interface DeviceStats extends Omit<TableRowProps, 'flag'> {}
interface LocationStats extends Omit<TableRowProps, 'isDevice' | 'icon'> {
  flag: string;
}

const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const lifetimeStats = {
    views: 4000,
    clicks: 4000,
    clickRate: 40
  };

  const linkPerformance: LinkPerformance[] = [
    { name: 'Instagram', icon: FaInstagram, views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'Behance', icon: null, views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'add on snapchat', icon: null, views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'Linkedin', icon: FaLinkedin, views: 1000, clicks: 1000, clickRate: 10 }
  ];

  const deviceStats: DeviceStats[] = [
    { name: 'Mobile', icon: FiSmartphone, views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'Desktop', icon: FiMonitor, views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'Tablet', icon: FiTablet, views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'Laptop', icon: FiMonitor, views: 1000, clicks: 1000, clickRate: 10 }
  ];

  const locationStats: LocationStats[] = [
    { name: 'Nigeria', flag: '🇳🇬', views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'Finland', flag: '🇫🇮', views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'United Kingdom', flag: '🇬🇧', views: 1000, clicks: 1000, clickRate: 10 },
    { name: 'Ghana', flag: '🇬🇭', views: 1000, clicks: 1000, clickRate: 10 }
  ];

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, subtitle, color = "" }) => (
    <div className="flex items-center gap-3">
      {Icon && (
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      )}
      <div>
        <div className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</div>
        <div className="text-[15px]">{subtitle}</div>
      </div>
    </div>
  );

  const TableRow: React.FC<TableRowProps> = ({ icon: Icon, name, views, clicks, clickRate, isDevice = false, flag }) => (
    <tr className="border-b border-[#B698FF]">
      <td className="py-3 px-1">
        <div className="flex items-center gap-3">
          {flag ? (
            <span className="text-lg">{flag}</span>
          ) : Icon ? (
            <Icon className={`w-5 h-5 ${isDevice ? 'text-[#B698FF]' : 'text-black'}`} />
          ) : (
            <div
              className={`w-5 h-5 rounded ${
                name === 'Behance'
                  ? 'bg-blue-500'
                  : name === 'add on snapchat'
                  ? 'bg-yellow-400'
                  : 'bg-gray-400'
              }`}
            ></div>
          )}
          <span className="text-black text-[14px]">{name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-right text-[14px]">{views.toLocaleString()}</td>
      <td className="py-3 px-4 text-right text-[14px]">{clicks.toLocaleString()}</td>
      <td className="py-3 px-4 text-right text-[14px]">{`${clickRate}%`}</td>
    </tr>
  );

  const SkeletonTableRow = () => (
    <tr className="border-b border-gray-200">
      <td className="py-3 px-1">
        <div className="flex items-center gap-3">
          <Skeleton width="20px" height="20px"  />
          <Skeleton width="100px" height="15px" />
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <Skeleton width="50px" height="15px" className="ml-auto" />
      </td>
      <td className="py-3 px-4 text-right">
        <Skeleton width="50px" height="15px" className="ml-auto" />
      </td>
      <td className="py-3 px-4 text-right">
        <Skeleton width="50px" height="15px" className="ml-auto" />
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fd] p-6">
        <div className="max-w-5xl bg-[#fff] p-6 mx-auto space-y-6">
          
          {/* Lifetime Stats Skeleton */}
          <div className="bg-gray-100 border border-gray-200 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton width="80px" height="24px" />
              <Skeleton width="16px" height="16px"  />
            </div>
            <div className="grid grid-cols-4 gap-8 relative">
              {[...Array(4)].map((_, i) => (
                <div className="flex items-center gap-3" key={i}>
                  <Skeleton width="40px" height="40px"  />
                  <div className="space-y-2">
                    <Skeleton width="60px" height="24px" />
                    <Skeleton width="80px" height="16px" />
                  </div>
                </div>
              ))}
              <div className="absolute right-0 -top-10">
                <Skeleton width="100px" height="100px" />
              </div>
            </div>
          </div>

          {/* Audience Container */}
          <div className="bg-gray-100 border border-gray-200 p-6  space-y-6">
            {/* Link Performance Skeleton */}
            <div className="bg-white p-6 ">
              <Skeleton width="150px" height="24px" className="mb-4" />
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-1">
                      <Skeleton width="80px" height="16px" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="50px" height="16px" className="ml-auto" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="50px" height="16px" className="ml-auto" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="60px" height="16px" className="ml-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, i) => (
                    <SkeletonTableRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Devices Skeleton */}
            <div className="bg-white p-6 rounded-lg">
              <Skeleton width="80px" height="24px" className="mb-4" />
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-1">
                      <Skeleton width="60px" height="16px" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="50px" height="16px" className="ml-auto" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="50px" height="16px" className="ml-auto" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="60px" height="16px" className="ml-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, i) => (
                    <SkeletonTableRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Location Skeleton */}
            <div className="bg-white p-6 rounded-lg">
              <Skeleton width="80px" height="24px" className="mb-6" />
              <div className="p-8 mb-6 flex justify-center">
                <Skeleton width="65%" height="150px" className="rounded-lg" />
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-1">
                      <Skeleton width="60px" height="16px" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="50px" height="16px" className="ml-auto" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="50px" height="16px" className="ml-auto" />
                    </th>
                    <th className="text-right py-3 px-4">
                      <Skeleton width="60px" height="16px" className="ml-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, i) => (
                    <SkeletonTableRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fd] p-6">
      <div className="max-w-5xl bg-[#fff] p-6 mx-auto space-y-6">
        {/* Lifetime Stats */}
        <div className="bg-gray-100 border border-gray-200 p-6 ">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold">Lifetime</h2>
            <div className="w-4 h-4 rounded-full border-1 border-[#000] flex items-center justify-center">
              <span className="text-xs text-gray-600">?</span>
            </div>  
          </div>
          <div className="grid grid-cols-4 relative gap-8 ">
            <StatCard icon={FiEye} value={lifetimeStats.views} subtitle="Views" color="text-gray-400" />
            <StatCard icon={FaMousePointer} value={lifetimeStats.clicks} subtitle="Overall click" color="text-green-500" />
            <StatCard icon={FiTrendingUp} value={lifetimeStats.clickRate} subtitle="Click Rate" color="text-purple-600" />
            <img
              src="/Analytics 1.png"
              alt="World map showing audience locations"
              className="w-[20%] right-0 -top-10 absolute object-contain"
            />
          </div>
        </div>

        {/* Audience */}
        <div className="bg-gray-100 border border-gray-200 p-6 ">
          {/* Link Performance */}
          <div className="mb-8 bg-white p-6 ">
            <h3 className="text-[17px] font-semibold mb-4">Link Performance</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 mb-4">
                  <th className="text-left py-3 px-1 text-[15px] font-semibold">Link Name</th>
                  <th className="text-right py-3 px-4 text-[15px] font-semibold">Views</th>
                  <th className="text-right py-3 px-4 text-[15px] font-semibold">Clicks</th>
                  <th className="text-right py-3 px-4 text-[15px] font-semibold">Click Rate</th>
                </tr>
              </thead>
              <tbody>
                {linkPerformance.map((link, i) => (
                  <TableRow key={i} {...link} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Devices */}
          <div className="mb-8 bg-white p-6 ">
            <h3 className="text-base font-medium text-gray-900 mb-4">Devices</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#B698FF]">
                  <th className="text-left py-3 px-1 text-sm font-medium text-gray-500">Device</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Clicks</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Click Rate</th>
                </tr>
              </thead>
              <tbody>
                {deviceStats.map((d, i) => (
                  <TableRow key={i} {...d} isDevice />
                ))}
              </tbody>
            </table>
          </div>

          {/* Location */}
          <div className="bg-white p-6 ">
            <h3 className="text-base font-medium text-gray-900 mb-6">Location</h3>
            <div className="p-8 mb-6 flex justify-center">
              <img
                src="/map.svg"
                alt="World map showing audience locations"
                className="w-[65%] object-contain"
              />
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-1 text-sm font-medium text-gray-500"></th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Clicks</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Click Rate</th>
                </tr>
              </thead>
              <tbody>
                {locationStats.map((l, i) => (
                  <TableRow key={i} {...l} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;





