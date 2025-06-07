import { useState, useEffect } from 'react';
import { RefreshCw, TestTube, AlertCircle, CheckCircle, Eye, EyeOff, Menu, X } from 'lucide-react';
import { useDeviceInfo } from './hooks/useDeviceInfo';
import DeviceInfoCard from './components/DeviceInfoCard';
import AudioDevicesCard from './components/AudioDevicesCard';
import ScreenInfoCard from './components/ScreenInfoCard';
import MultipleTabsCard from './components/MultipleTabsCard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { deviceInfo, getInfo, tabInfo } = useDeviceInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetDeviceInfo = async () => {
    setIsLoading(true);
    await getInfo(() => {
      setIsLoading(false);
      setHasPermissions(true);
    });
  };

  useEffect(() => {
    
    handleGetDeviceInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <TestTube className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Device Testing Suite</h1>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Comprehensive device and browser capability testing</p>
              </div>
            </div>
            

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>


            <div className="hidden lg:flex items-center gap-4">

              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                tabInfo.isCurrentlyFocused 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {tabInfo.isCurrentlyFocused ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {tabInfo.isCurrentlyFocused ? 'Focused' : 'Not Focused'}
                </span>
              </div>

              <button
                onClick={handleGetDeviceInfo}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Testing...' : 'Run Tests'}
              </button>
            </div>
          </div>


          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 space-y-3">

              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                tabInfo.isCurrentlyFocused 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {tabInfo.isCurrentlyFocused ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {tabInfo.isCurrentlyFocused ? 'Tab Focused' : 'Tab Not Focused'}
                </span>
              </div>

              <button
                onClick={() => {
                  handleGetDeviceInfo();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Testing...' : 'Run Tests'}
              </button>
            </div>
          )}
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {deviceInfo.error ? (
          <div className="mb-6 lg:mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 text-sm sm:text-base">Error Accessing Device Information</h3>
                <p className="text-red-700 text-sm mt-1">{deviceInfo.error}</p>
                <p className="text-red-600 text-xs sm:text-sm mt-2">
                  Please ensure you grant microphone permissions when prompted.
                </p>
              </div>
            </div>
          </div>
        ) : hasPermissions && !isLoading ? (
          <div className="mb-6 lg:mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800 text-sm sm:text-base">Device Information Retrieved Successfully</h3>
                <p className="text-green-700 text-xs sm:text-sm mt-1">
                  All device capabilities have been tested and are displayed below.
                </p>
              </div>
            </div>
          </div>
        ) : null}


        {(tabInfo.hasMultipleInstances || tabInfo.hasNewTabsOpened || !tabInfo.isCurrentlyFocused) && (
          <div className="mb-6 lg:mb-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 text-sm sm:text-base">Tab Activity Detected</h3>
                <div className="text-orange-700 text-xs sm:text-sm space-y-1 mt-1">
                  {!tabInfo.isCurrentlyFocused && (
                    <p>• Tab is currently not focused (switched away or minimized)</p>
                  )}
                  {tabInfo.hasMultipleInstances && (
                    <p>• Multiple instances detected ({tabInfo.totalTabs} tabs total)</p>
                  )}
                  {tabInfo.hasNewTabsOpened && (
                    <p>• {tabInfo.newTabsCount} new tab(s) opened from this application</p>
                  )}
                  {tabInfo.focusLostCount > 0 && (
                    <p>• Focus lost {tabInfo.focusLostCount} time(s), total time away: {Math.round(tabInfo.totalFocusLossTime / 1000)}s</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


        {isLoading && (
          <div className="mb-6 lg:mb-8 bg-white rounded-xl shadow-lg p-8 lg:p-12 border border-gray-100">
            <div className="text-center">
              <LoadingSpinner />
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mt-4">Testing Device Capabilities</h3>
              <p className="text-gray-600 mt-2 text-sm lg:text-base">
                Please allow microphone access when prompted to complete all tests.
              </p>
            </div>
          </div>
        )}

        {!isLoading && hasPermissions && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <DeviceInfoCard deviceInfo={deviceInfo} />
            <AudioDevicesCard deviceInfo={deviceInfo} />
            <ScreenInfoCard deviceInfo={deviceInfo} />
            <MultipleTabsCard tabInfo={tabInfo} />
          </div>
        )}

        <div className="mt-8 lg:mt-12 bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">What This Tool Tests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <TestTube className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">System Info</h3>
              <p className="text-gray-600 text-xs lg:text-sm">
                Operating system, browser version, platform, and device type detection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <TestTube className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Audio Devices</h3>
              <p className="text-gray-600 text-xs lg:text-sm">
                Microphone enumeration, active device settings, and audio capabilities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <TestTube className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Screen Details</h3>
              <p className="text-gray-600 text-xs lg:text-sm">
                Display resolution, color depth, and multi-monitor configuration.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-lg w-fit mx-auto mb-3">
                <TestTube className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Advanced Tab Monitoring</h3>
              <p className="text-gray-600 text-xs lg:text-sm">
                Real-time detection of tab focus, multiple instances, and new tab activity.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-8 bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
          <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">Test Tab Detection & Focus Monitoring</h3>
          <p className="hidden text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">
            Use these methods to test the comprehensive tab monitoring functionality:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3 text-sm lg:text-base">Tab Detection Tests:</h4>
              <div className="flex flex-col gap-2 lg:gap-3">
                <a 
                  href={window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors"
                >
                  Open in New Tab
                </a>
                <button 
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors"
                >
                  Open via JavaScript
                </button>
                <a 
                  href={window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors"
                  onMouseDown={(e) => e.button === 1 && e.preventDefault()} // Middle click
                >
                  Middle-Click to Test
                </a>
              </div>
            </div>
        
            <div>
              <h4 className="font-medium text-gray-700 mb-3 text-sm lg:text-base">Focus Detection Tests:</h4>
              <div className="grid grid-cols-2 gap-2 lg:gap-3 text-xs lg:text-sm text-gray-600">
                <p>• Switch to another tab or window</p>
                <p>• Minimize the browser</p>
                <p>• Click outside the browser window</p>
                <p>• Use Alt+Tab (Cmd+Tab on Mac)</p>
                <p>• Open developer tools (F12)</p>
              </div>
            </div>
          </div>
        
          <div className="hidden mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-xs lg:text-sm">
              <strong>Note:</strong> Due to browser security restrictions, this tool cannot detect when you visit 
              external websites like GitHub or ChatGPT. It can only monitor focus changes and tabs opened from this application.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2 text-sm lg:text-base">
              This tool demonstrates comprehensive device testing capabilities using modern web APIs.
            </p>
            <p className="text-xs lg:text-sm">
              Built with React, TypeScript, and Tailwind CSS. No data is stored or transmitted.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;