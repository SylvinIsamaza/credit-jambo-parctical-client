export class DeviceUtils {
  static generateDeviceName(userAgent?: string): string {
    if (!userAgent) return "Unknown Device";

    const browser = userAgent.includes("Chrome") ? "Chrome" :
                   userAgent.includes("Firefox") ? "Firefox" :
                   userAgent.includes("Safari") && !userAgent.includes("Chrome") ? "Safari" :
                   userAgent.includes("Edge") ? "Edge" : "Browser";

    const os = userAgent.includes("Windows") ? "Windows" :
              userAgent.includes("Mac") ? "macOS" :
              userAgent.includes("Linux") ? "Linux" :
              userAgent.includes("Android") ? "Android" :
              userAgent.includes("iOS") ? "iOS" : "Unknown";

    return `${browser} on ${os}`;
  }
}