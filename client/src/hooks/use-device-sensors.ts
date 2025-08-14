import { useState, useEffect, useCallback } from 'react';

interface DeviceInfo {
  battery: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  } | null;
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  } | null;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    heading: number | null;
    speed: number | null;
  } | null;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  permissions: {
    geolocation: PermissionState | null;
    camera: PermissionState | null;
    microphone: PermissionState | null;
    notifications: PermissionState | null;
  };
  connection: {
    online: boolean;
    type: string;
    effectiveType: string;
  };
}

interface SystemMetrics {
  cpuUsage: number | null;
  memoryUsage: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  devicePixelRatio: number;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
}

export const useDeviceSensors = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    battery: null,
    network: null,
    location: null,
    deviceMemory: null,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    permissions: {
      geolocation: null,
      camera: null,
      microphone: null,
      notifications: null,
    },
    connection: {
      online: navigator.onLine,
      type: 'unknown',
      effectiveType: 'unknown',
    },
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: null,
    memoryUsage: null,
    devicePixelRatio: window.devicePixelRatio,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [isScanning, setIsScanning] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Battery API
  const updateBatteryInfo = useCallback(async () => {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        setDeviceInfo(prev => ({
          ...prev,
          battery: {
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          },
        }));

        // Listen for battery events
        battery.addEventListener('chargingchange', () => updateBatteryInfo());
        battery.addEventListener('levelchange', () => updateBatteryInfo());
      }
    } catch (error) {
      setErrors(prev => [...prev, 'Battery API not supported']);
    }
  }, []);

  // Network Information API
  const updateNetworkInfo = useCallback(() => {
    try {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        setDeviceInfo(prev => ({
          ...prev,
          network: {
            effectiveType: connection.effectiveType || 'unknown',
            downlink: connection.downlink || 0,
            rtt: connection.rtt || 0,
            saveData: connection.saveData || false,
          },
          connection: {
            online: navigator.onLine,
            type: connection.type || 'unknown',
            effectiveType: connection.effectiveType || 'unknown',
          },
        }));
      }
    } catch (error) {
      setErrors(prev => [...prev, 'Network Information API not supported']);
    }
  }, []);

  // Geolocation API
  const updateLocationInfo = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeviceInfo(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              heading: position.coords.heading,
              speed: position.coords.speed,
            },
          }));
        },
        (error) => {
          setErrors(prev => [...prev, `Geolocation error: ${error.message}`]);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

  // Performance and Memory Monitoring
  const updateSystemMetrics = useCallback(() => {
    try {
      // Memory usage (Chrome only)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setSystemMetrics(prev => ({
          ...prev,
          memoryUsage: {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
          },
        }));
      }

      // Device memory hint
      if ('deviceMemory' in navigator) {
        setDeviceInfo(prev => ({
          ...prev,
          deviceMemory: (navigator as any).deviceMemory,
        }));
      }

      // Update screen info
      setSystemMetrics(prev => ({
        ...prev,
        devicePixelRatio: window.devicePixelRatio,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
      }));
    } catch (error) {
      setErrors(prev => [...prev, 'System metrics collection failed']);
    }
  }, []);

  // Check permissions
  const checkPermissions = useCallback(async () => {
    try {
      if ('permissions' in navigator) {
        const permissions = await Promise.allSettled([
          navigator.permissions.query({ name: 'geolocation' as PermissionName }),
          navigator.permissions.query({ name: 'camera' as PermissionName }),
          navigator.permissions.query({ name: 'microphone' as PermissionName }),
          navigator.permissions.query({ name: 'notifications' as PermissionName }),
        ]);

        setDeviceInfo(prev => ({
          ...prev,
          permissions: {
            geolocation: permissions[0].status === 'fulfilled' ? permissions[0].value.state : null,
            camera: permissions[1].status === 'fulfilled' ? permissions[1].value.state : null,
            microphone: permissions[2].status === 'fulfilled' ? permissions[2].value.state : null,
            notifications: permissions[3].status === 'fulfilled' ? permissions[3].value.state : null,
          },
        }));
      }
    } catch (error) {
      setErrors(prev => [...prev, 'Permissions API not supported']);
    }
  }, []);

  // Request specific permission
  const requestPermission = useCallback(async (permission: 'geolocation' | 'camera' | 'microphone' | 'notifications') => {
    try {
      switch (permission) {
        case 'geolocation':
          updateLocationInfo();
          break;
        case 'camera':
          await navigator.mediaDevices.getUserMedia({ video: true });
          break;
        case 'microphone':
          await navigator.mediaDevices.getUserMedia({ audio: true });
          break;
        case 'notifications':
          await Notification.requestPermission();
          break;
      }
      await checkPermissions();
    } catch (error) {
      setErrors(prev => [...prev, `Permission request failed: ${permission}`]);
    }
  }, [updateLocationInfo, checkPermissions]);

  // Start comprehensive scan
  const startDeviceScan = useCallback(async () => {
    setIsScanning(true);
    setErrors([]);
    
    try {
      await Promise.all([
        updateBatteryInfo(),
        updateNetworkInfo(),
        updateSystemMetrics(),
        checkPermissions(),
      ]);
    } catch (error) {
      setErrors(prev => [...prev, 'Device scan failed']);
    } finally {
      setIsScanning(false);
    }
  }, [updateBatteryInfo, updateNetworkInfo, updateSystemMetrics, checkPermissions]);

  // Setup event listeners
  useEffect(() => {
    const handleOnline = () => {
      setDeviceInfo(prev => ({
        ...prev,
        connection: { ...prev.connection, online: true },
      }));
    };

    const handleOffline = () => {
      setDeviceInfo(prev => ({
        ...prev,
        connection: { ...prev.connection, online: false },
      }));
    };

    const handleConnectionChange = () => {
      updateNetworkInfo();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial scan
    startDeviceScan();

    // Periodic updates
    const interval = setInterval(() => {
      updateSystemMetrics();
      updateNetworkInfo();
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
      clearInterval(interval);
    };
  }, [startDeviceScan, updateNetworkInfo, updateSystemMetrics]);

  return {
    deviceInfo,
    systemMetrics,
    isScanning,
    errors,
    startDeviceScan,
    requestPermission,
    updateLocationInfo,
  };
};