import React from 'react';
import { Mic, MicOff, Volume2, Settings } from 'lucide-react';
import { DeviceInfo } from '../hooks/useDeviceInfo';

interface AudioDevicesCardProps {
  deviceInfo: DeviceInfo;
}

const AudioDevicesCard: React.FC<AudioDevicesCardProps> = ({ deviceInfo }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Audio Devices</h3>
          <p className="text-gray-500 text-xs sm:text-sm">Microphone information and settings</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">

        {deviceInfo.activeMicrophone && (
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="font-semibold text-green-800 text-sm sm:text-base">Active Microphone</span>
            </div>
            <p className="text-green-700 mb-2 sm:mb-3 font-medium text-sm sm:text-base">
              {deviceInfo.activeMicrophone.label}
            </p>
            
            {deviceInfo.activeMicrophone.settings && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-800">Audio Settings</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Sample Rate:</span>
                    <span className="text-green-800 font-medium">
                      {deviceInfo.activeMicrophone.settings.sampleRate}Hz
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Channels:</span>
                    <span className="text-green-800 font-medium">
                      {deviceInfo.activeMicrophone.settings.channelCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Latency:</span>
                    <span className="text-green-800 font-medium">
                      {deviceInfo.activeMicrophone.settings.latency?.toFixed(3)}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Noise Suppression:</span>
                    <span className="text-green-800 font-medium">
                      {deviceInfo.activeMicrophone.settings.noiseSuppression ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Echo Cancellation:</span>
                    <span className="text-green-800 font-medium">
                      {deviceInfo.activeMicrophone.settings.echoCancellation ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Auto Gain:</span>
                    <span className="text-green-800 font-medium">
                      {deviceInfo.activeMicrophone.settings.autoGainControl ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <h4 className="font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
            Available Microphones ({deviceInfo.microphones.length})
          </h4>
          <div className="space-y-2">
            {deviceInfo.microphones.length > 0 ? (
              deviceInfo.microphones.map((mic, index) => (
                <div 
                  key={mic.deviceId} 
                  className={`p-2 sm:p-3 rounded-lg border ${
                    deviceInfo.activeMicrophone?.deviceId === mic.deviceId
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {deviceInfo.activeMicrophone?.deviceId === mic.deviceId ? (
                      <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    ) : (
                      <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    )}
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {mic.label || `Microphone ${index + 1}`}
                    </span>
                    {deviceInfo.activeMicrophone?.deviceId === mic.deviceId && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-mono break-all">
                    ID: {mic.deviceId.substring(0, 20)}...
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <MicOff className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No microphones detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDevicesCard;