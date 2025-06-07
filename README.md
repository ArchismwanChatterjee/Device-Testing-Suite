# Device Testing Suite

A modern web-based tool for comprehensive device and browser capability testing.

🔗 **Live Demo**: [Device Testing Suite](https://device-testing.netlify.app/)

## 🚀 Features

- **System Info**  
  Detects device type, OS, platform, and browser version.

- **Audio Devices**  
  Lists available microphones and tests active microphone input, sample rate, echo cancellation, noise suppression, and latency.

- **Screen Details**  
  Displays resolution, color depth, and aspect ratio for each connected display (supports multi-monitor setups).

- **Advanced Focus oriented Tab Monitoring**  
  - Detects when the browser tab is not focused
  - Monitors activity duration and last focused time
  - Detects multiple tabs and new tab creation
  - Alerts when user switches tabs or windows

## 🧪 What It Tests

- Device and browser information
- Active audio input and capabilities
- Screen configuration and resolution
- Tab focus changes and activity monitoring

## 🛠 Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS

## ⚠️ Limitations

- 🔒 Limited by browser security for cross-tab and cross-origin detection

## 📂 Test Scenarios

Use the following actions to test tab monitoring:

- Switch to another browser tab or window
- Minimize the browser
- Click outside the browser window
- Open new tab (Ctrl+T / Cmd+T)
- Open Developer Tools (F12)

---

## 📚 References

- [MDN Web Docs](https://developer.mozilla.org/) – Comprehensive documentation for web APIs and browser features used in this project.


> This tool demonstrates comprehensive device testing capabilities using modern web APIs.  
> No data is stored or transmitted.
