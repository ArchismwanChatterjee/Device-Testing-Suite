import { getSystemInfo } from "../helpers/utils/system-info";
import { useState, useCallback, useEffect } from "react";

export interface AudioSettings {
  sampleRate?: number;
  latency?: number;
  channelCount?: number;
  noiseSuppression?: boolean;
  echoCancellation?: boolean;
  autoGainControl?: boolean;
}

export interface Microphone {
  deviceId: string;
  label: string;
}

export interface ActiveMicrophone extends Microphone {
  settings?: AudioSettings;
}

export interface ScreenInfo {
  width: number;
  height: number;
  colorDepth: number;
  isPrimary: boolean;
}

export interface TabInfo {
  hasMultipleInstances: boolean;
  hasNewTabsOpened: boolean;
  totalTabs: number;
  newTabsCount: number;
  isCurrentlyFocused: boolean;
  focusLostCount: number;
  lastFocusLost?: Date;
  lastFocusGained?: Date;
  totalFocusLossTime: number;
}

export interface DeviceInfo {
  platform: string;
  osName: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  deviceType: string;
  microphones: Microphone[];
  activeMicrophone?: ActiveMicrophone;
  screens: ScreenInfo[];
  tabInfo: TabInfo;
  error?: string;
}

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: "",
    osName: "",
    osVersion: "",
    browser: "",
    browserVersion: "",
    deviceType: "unknown",
    microphones: [],
    screens: [],
    tabInfo: {
      hasMultipleInstances: false,
      hasNewTabsOpened: false,
      totalTabs: 1,
      newTabsCount: 0,
      isCurrentlyFocused: true,
      focusLostCount: 0,
      totalFocusLossTime: 0,
    },
  });

  const [tabInfo, setTabInfo] = useState<TabInfo>({
    hasMultipleInstances: false,
    hasNewTabsOpened: false,
    totalTabs: 1,
    newTabsCount: 0,
    isCurrentlyFocused: true,
    focusLostCount: 0,
    totalFocusLossTime: 0,
  });

  const getInfo = useCallback(async (onStatusChange: () => void) => {
    try {
      const {
        platform,
        osName,
        osVersion,
        browser,
        browserVersion,
        deviceType,
      } = getSystemInfo();

      // Get screen info
      let screens: ScreenInfo[] = [];
      if ("getScreenDetails" in window) {
        try {
          const details = await (window.getScreenDetails as () => Promise<any>)();
          screens = details.screens.map((s: any) => ({
            width: s.width,
            height: s.height,
            colorDepth: s.colorDepth,
            isPrimary: s.isPrimary,
          }));
        } catch {}
      }

      if (screens.length === 0) {
        screens = [
          {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            isPrimary: true,
          },
        ];
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const microphones: Microphone[] = devices
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || "Unnamed Microphone",
        }));

      const activeTrack = stream.getAudioTracks()[0];
      const settings = activeTrack.getSettings();
      const activeDeviceId = settings.deviceId;

      const activeMicrophone: ActiveMicrophone | undefined = microphones.find(
        (m) => m.deviceId === activeDeviceId
      )
        ? {
            ...microphones.find((m) => m.deviceId === activeDeviceId)!,
            settings: {
              sampleRate: settings.sampleRate,
              latency: settings.latency,
              channelCount: settings.channelCount,
              noiseSuppression: settings.noiseSuppression,
              echoCancellation: settings.echoCancellation,
              autoGainControl: settings.autoGainControl,
            },
          }
        : undefined;

      stream.getTracks().forEach((track) => track.stop());

      setDeviceInfo((prev) => ({
        ...prev,
        platform,
        osName,
        osVersion,
        browser,
        browserVersion,
        deviceType,
        microphones,
        activeMicrophone,
        screens,
        tabInfo: prev.tabInfo,
      }));

      onStatusChange();
    } catch (err: any) {
      setDeviceInfo((prev) => ({
        ...prev,
        error: err.message || "Could not access device info",
      }));
      onStatusChange();
    }
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel("interview-check");
    const tabId = `tab_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    let activeTabs = new Set<string>([tabId]);
    let newTabsOpened = 0;
    let gotResponse = false;
    let focusLostCount = 0;
    let lastFocusLost: Date | undefined;
    let lastFocusGained: Date | undefined;
    let totalFocusLossTime = 0;
    let focusLostTimestamp: number | null = null;

    channel.postMessage({ type: "ping", tabId });

    const timeout = setTimeout(() => {
      const currentTabInfo: TabInfo = {
        hasMultipleInstances: gotResponse,
        hasNewTabsOpened: newTabsOpened > 0,
        totalTabs: activeTabs.size,
        newTabsCount: newTabsOpened,
        isCurrentlyFocused: document.hasFocus(),
        focusLostCount,
        lastFocusLost,
        lastFocusGained,
        totalFocusLossTime,
      };

      setTabInfo(currentTabInfo);
      setDeviceInfo((prev) => ({
        ...prev,
        tabInfo: currentTabInfo,
      }));
    }, 500);

    const handleFocus = () => {
      const now = new Date();
      lastFocusGained = now;

      if (focusLostTimestamp) {
        const focusLossDuration = Date.now() - focusLostTimestamp;
        totalFocusLossTime += focusLossDuration;
        focusLostTimestamp = null;
      }

      const updatedTabInfo: TabInfo = {
        hasMultipleInstances: activeTabs.size > 1,
        hasNewTabsOpened: newTabsOpened > 0,
        totalTabs: activeTabs.size,
        newTabsCount: newTabsOpened,
        isCurrentlyFocused: true,
        focusLostCount,
        lastFocusLost,
        lastFocusGained,
        totalFocusLossTime,
      };

      setTabInfo(updatedTabInfo);
      setDeviceInfo((prev) => ({
        ...prev,
        tabInfo: updatedTabInfo,
      }));

      channel.postMessage({
        type: "focus_gained",
        tabId,
        timestamp: Date.now(),
      });
    };

    const handleBlur = () => {
      const now = new Date();
      lastFocusLost = now;
      focusLostCount++;
      focusLostTimestamp = Date.now();

      const updatedTabInfo: TabInfo = {
        hasMultipleInstances: activeTabs.size > 1,
        hasNewTabsOpened: newTabsOpened > 0,
        totalTabs: activeTabs.size,
        newTabsCount: newTabsOpened,
        isCurrentlyFocused: false,
        focusLostCount,
        lastFocusLost,
        lastFocusGained,
        totalFocusLossTime,
      };

      setTabInfo(updatedTabInfo);
      setDeviceInfo((prev) => ({
        ...prev,
        tabInfo: updatedTabInfo,
      }));

      channel.postMessage({
        type: "focus_lost",
        tabId,
        timestamp: Date.now(),
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      } else {
        handleFocus();
      }
    };

    // ping-pong based identification of tabs

    channel.onmessage = (event) => {
      const { type, tabId: senderTabId, timestamp } = event.data;

      if (type === "ping" && senderTabId !== tabId) {
        gotResponse = true;
        activeTabs.add(senderTabId);
        channel.postMessage({ type: "pong", tabId });
      } else if (type === "pong" && senderTabId !== tabId) {
        gotResponse = true;
        activeTabs.add(senderTabId);
      } else if (type === "new_tab" && senderTabId !== tabId) {
        newTabsOpened++;
        activeTabs.add(senderTabId);

        const updatedTabInfo: TabInfo = {
          hasMultipleInstances: true,
          hasNewTabsOpened: true,
          totalTabs: activeTabs.size,
          newTabsCount: newTabsOpened,
          isCurrentlyFocused: document.hasFocus(),
          focusLostCount,
          lastFocusLost,
          lastFocusGained,
          totalFocusLossTime,
        };

        setTabInfo(updatedTabInfo);
        setDeviceInfo((prev) => ({
          ...prev,
          tabInfo: updatedTabInfo,
        }));
      } else if (type === "tab_closed" && senderTabId !== tabId) {
        activeTabs.delete(senderTabId);

        const updatedTabInfo: TabInfo = {
          hasMultipleInstances: activeTabs.size > 1,
          hasNewTabsOpened: newTabsOpened > 0,
          totalTabs: activeTabs.size,
          newTabsCount: newTabsOpened,
          isCurrentlyFocused: document.hasFocus(),
          focusLostCount,
          lastFocusLost,
          lastFocusGained,
          totalFocusLossTime,
        };

        setTabInfo(updatedTabInfo);
        setDeviceInfo((prev) => ({
          ...prev,
          tabInfo: updatedTabInfo,
        }));
      }
    };

    const announceNewTab = () => {
      channel.postMessage({
        type: "new_tab",
        tabId,
        timestamp: Date.now(),
      });
    };

    const isNewTab = sessionStorage.getItem("app_visited") === "true";
    if (isNewTab) {
      announceNewTab();
    } else {
      sessionStorage.setItem("app_visited", "true");
    }

    const originalOpen = window.open;
    window.open = function (...args) {
      const newWindow = originalOpen.apply(this, args);
      if (newWindow) {
        setTimeout(() => {
          channel.postMessage({
            type: "new_tab",
            tabId: `tab_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            timestamp: Date.now(),
          });
        }, 100);
      }
      return newWindow;
    };

    const handleBeforeUnload = () => {
      channel.postMessage({ type: "tab_closed", tabId });
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      channel.postMessage({ type: "tab_closed", tabId });
      channel.close();
      window.open = originalOpen;
    };
  }, []);

  return { deviceInfo, getInfo, tabInfo };
};
