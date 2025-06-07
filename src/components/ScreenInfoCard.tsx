import React from 'react';
import { Monitor, Smartphone, Palette } from 'lucide-react';
import { DeviceInfo } from '../hooks/useDeviceInfo';

interface ScreenInfoCardProps {
  deviceInfo: DeviceInfo;
}

const ScreenInfoCard: React.FC<ScreenInfoCardProps> = ({ deviceInfo }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Screen Information</h3>
          <p className="text-gray-500 text-xs sm:text-sm">Display details and resolution</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {deviceInfo.screens.map((screen, index) => (
          <div 
            key={index} 
            className={`p-3 sm:p-4 rounded-lg border ${
              screen.isPrimary 
                ? 'bg-purple-50 border-purple-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              {deviceInfo.deviceType === 'mobile' ? (
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              ) : (
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              )}
              <span className="font-semibold text-purple-800 text-sm sm:text-base">
                {screen.isPrimary ? 'Primary Display' : `Display ${index + 1}`}
              </span>
              {screen.isPrimary && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Main
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 text-xs sm:text-sm">Resolution:</span>
                  <span className="text-purple-800 font-semibold text-xs sm:text-sm">
                    {screen.width} × {screen.height}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 text-xs sm:text-sm">Aspect Ratio:</span>
                  <span className="text-purple-800 font-semibold text-xs sm:text-sm">
                    {(screen.width / screen.height).toFixed(2)}:1
                  </span>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 text-xs sm:text-sm flex items-center gap-1">
                    <Palette className="w-2 h-2 sm:w-3 sm:h-3" />
                    Color Depth:
                  </span>
                  <span className="text-purple-800 font-semibold text-xs sm:text-sm">
                    {screen.colorDepth}-bit
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 text-xs sm:text-sm">Total Pixels:</span>
                  <span className="text-purple-800 font-semibold text-xs sm:text-sm">
                    {(screen.width * screen.height / 1000000).toFixed(1)}MP
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScreenInfoCard;