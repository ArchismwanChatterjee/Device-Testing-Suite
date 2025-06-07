import React from 'react';
import { Table as Tabs, AlertTriangle, CheckCircle, ExternalLink, Eye, Users, Focus, Clock, Activity } from 'lucide-react';
import { TabInfo } from '../hooks/useDeviceInfo';

interface MultipleTabsCardProps {
  tabInfo: TabInfo;
}

const MultipleTabsCard: React.FC<MultipleTabsCardProps> = ({ tabInfo }) => {
  const hasAnyTabIssues = tabInfo.hasMultipleInstances || tabInfo.hasNewTabsOpened || !tabInfo.isCurrentlyFocused;

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDateTime = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Tabs className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Advanced Tab Monitoring</h3>
          <p className="text-gray-500 text-xs sm:text-sm">Real-time tab activity and focus detection</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">

        <div className={`p-3 sm:p-4 rounded-lg border ${
          hasAnyTabIssues 
            ? 'bg-red-50 border-red-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-start gap-3">
            {hasAnyTabIssues ? (
              <>
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 text-sm sm:text-base">Activity Detected</h4>
                  <p className="text-red-700 text-xs sm:text-sm mt-1">
                    {!tabInfo.isCurrentlyFocused && 'Tab is not focused. '}
                    {tabInfo.hasMultipleInstances && 'Multiple instances detected. '}
                    {tabInfo.hasNewTabsOpened && 'New tabs opened.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 text-sm sm:text-base">Optimal State</h4>
                  <p className="text-green-700 text-xs sm:text-sm mt-1">
                    Single focused tab with no additional activity detected.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`p-3 sm:p-4 rounded-lg border ${
          tabInfo.isCurrentlyFocused 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Focus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <span className="font-medium text-gray-800 text-sm sm:text-base">Focus Status</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              tabInfo.isCurrentlyFocused 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {tabInfo.isCurrentlyFocused ? 'FOCUSED' : 'NOT FOCUSED'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Focus Lost Count:</span>
                <span className="font-semibold text-gray-800">{tabInfo.focusLostCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Lost Time:</span>
                <span className="font-semibold text-gray-800">{formatTime(tabInfo.totalFocusLossTime)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Lost:</span>
                <span className="font-semibold text-gray-800">{formatDateTime(tabInfo.lastFocusLost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Gained:</span>
                <span className="font-semibold text-gray-800">{formatDateTime(tabInfo.lastFocusGained)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

          <div className={`p-3 sm:p-4 rounded-lg border ${
            tabInfo.hasMultipleInstances 
              ? 'bg-red-50 border-red-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="font-medium text-gray-800 text-sm sm:text-base">Multiple Instances</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Status:</span>
              <span className={`text-xs sm:text-sm font-semibold ${
                tabInfo.hasMultipleInstances ? 'text-red-700' : 'text-green-700'
              }`}>
                {tabInfo.hasMultipleInstances ? 'Detected' : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs sm:text-sm text-gray-600">Total Tabs:</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                {tabInfo.totalTabs}
              </span>
            </div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg border ${
            tabInfo.hasNewTabsOpened 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="font-medium text-gray-800 text-sm sm:text-base">New Tabs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Status:</span>
              <span className={`text-xs sm:text-sm font-semibold ${
                tabInfo.hasNewTabsOpened ? 'text-orange-700' : 'text-green-700'
              }`}>
                {tabInfo.hasNewTabsOpened ? 'Opened' : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs sm:text-sm text-gray-600">Count:</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                {tabInfo.newTabsCount}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="font-medium text-blue-800 text-sm sm:text-base">Monitoring Capabilities</span>
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-blue-700">
            <p><strong>✅ Tab Focus:</strong> Detects when you switch away from this tab</p>
            <p><strong>✅ Multiple Instances:</strong> Detects when the same app is open in multiple tabs</p>
            <p><strong>✅ New Tab Detection:</strong> Monitors when new tabs are opened from this app</p>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            <span className="font-medium text-gray-700 text-sm sm:text-base">Test Focus Detection</span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">
            Try switching to another tab, opening a new tab, or clicking outside the browser window. 
            The system will immediately detect and track the focus changes with timestamps and duration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultipleTabsCard;