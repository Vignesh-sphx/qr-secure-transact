
/**
 * Utility to handle camera permissions
 */

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    // Stop all tracks to release the camera
    stream.getTracks().forEach(track => {
      track.stop();
    });
    
    return true;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const checkCameraPermission = async (): Promise<PermissionState | null> => {
  try {
    // Check if the permissions API is available
    if (navigator.permissions) {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state;
    }
    
    // If permissions API is not available, try to access the camera directly
    const hasAccess = await requestCameraPermission();
    return hasAccess ? 'granted' : 'denied';
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return null;
  }
};
