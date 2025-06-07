import React from 'react';
import { Monitor, Smartphone, Tablet, HardDrive } from 'lucide-react';
import { DeviceInfo } from '../hooks/useDeviceInfo';

interface DeviceInfoCardProps {
  deviceInfo: DeviceInfo;
}

const DeviceInfoCard: React.FC<DeviceInfoCardProps> = ({ deviceInfo }) => {
  const getDeviceIcon = () => {
    switch (deviceInfo.deviceType) {
      case 'mobile':
        return <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />;
      case 'tablet':
        return <Tablet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />;
      default:
        return <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />;
    }
  };

  const getOSIcon = () => {
    return <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        {getDeviceIcon()}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Device Information</h3>
          <p className="text-gray-500 text-xs sm:text-sm">System and browser details</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-gray-600 font-medium text-sm sm:text-base">Device Type</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-800 capitalize font-semibold text-sm sm:text-base">{deviceInfo.deviceType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-gray-600 font-medium text-sm sm:text-base">Operating System</span>
          <div className="flex items-center gap-2">
            {getOSIcon()}
            <span className="text-gray-800 font-semibold text-sm sm:text-base">
              {deviceInfo.osName} {deviceInfo.osVersion && `${deviceInfo.osVersion}`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-gray-600 font-medium text-sm sm:text-base">Browser</span>
          <span className="text-gray-800 font-semibold text-sm sm:text-base">
            {deviceInfo.browser} {deviceInfo.browserVersion}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-gray-600 font-medium text-sm sm:text-base">Platform</span>
          <span className="text-gray-800 font-semibold text-sm sm:text-base">{deviceInfo.platform}</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoCard;