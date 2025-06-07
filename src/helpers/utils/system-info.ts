export interface SystemInfo {
  platform: string;
  osName: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  deviceType: string;
}

export const getSystemInfo = (): SystemInfo => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  // Detect OS
  let osName = 'Unknown';
  let osVersion = '';
  
  if (userAgent.includes('Windows NT')) {
    osName = 'Windows';
    const match = userAgent.match(/Windows NT ([0-9._]+)/);
    if (match) {
      const version = match[1];
      switch (version) {
        case '10.0': osVersion = '10/11'; break;
        case '6.3': osVersion = '8.1'; break;
        case '6.2': osVersion = '8'; break;
        case '6.1': osVersion = '7'; break;
        default: osVersion = version;
      }
    }
  } else if (userAgent.includes('Mac OS X')) {
    osName = 'macOS';
    const match = userAgent.match(/Mac OS X ([0-9_]+)/);
    if (match) {
      osVersion = match[1].replace(/_/g, '.');
    }
  } else if (userAgent.includes('Linux')) {
    osName = 'Linux';
  } else if (userAgent.includes('Android')) {
    osName = 'Android';
    const match = userAgent.match(/Android ([0-9.]+)/);
    if (match) {
      osVersion = match[1];
    }
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    osName = userAgent.includes('iPad') ? 'iPadOS' : 'iOS';
    const match = userAgent.match(/OS ([0-9_]+)/);
    if (match) {
      osVersion = match[1].replace(/_/g, '.');
    }
  }

  // Detect browser
  let browser = 'Unknown';
  let browserVersion = '';

  if (userAgent.includes('Firefox/')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (userAgent.includes('Chrome/')) {
    if (userAgent.includes('Edg/')) {
      browser = 'Microsoft Edge';
      const match = userAgent.match(/Edg\/([0-9.]+)/);
      if (match) browserVersion = match[1];
    } else if (userAgent.includes('OPR/')) {
      browser = 'Opera';
      const match = userAgent.match(/OPR\/([0-9.]+)/);
      if (match) browserVersion = match[1];
    } else {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/([0-9.]+)/);
      if (match) browserVersion = match[1];
    }
  }

  // Detect device type
  let deviceType = 'desktop';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent) || 
                   (userAgent.includes('Android') && !userAgent.includes('Mobile'));
  
  if (isTablet) {
    deviceType = 'tablet';
  } else if (isMobile) {
    deviceType = 'mobile';
  }

  return {
    platform,
    osName,
    osVersion,
    browser,
    browserVersion,
    deviceType,
  };
};