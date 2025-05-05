
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { mcpClient } from '@/utils/mcpClient';

/**
 * FeatureDetector is a utility component that automatically detects
 * and registers routes in the application for testing purposes.
 * 
 * This component should be mounted high in the component tree to detect route changes.
 */
const FeatureDetector = () => {
  const location = useLocation();
  const registeredRoutes = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Register the current route if we haven't registered it before
    const currentPath = location.pathname;
    
    if (!registeredRoutes.current.has(currentPath)) {
      registeredRoutes.current.add(currentPath);
      
      // Get a simplified name for the route
      const routeName = currentPath.replace(/^\/+|\/+$/g, '') || 'home';
      const displayName = routeName.split('/').pop() || routeName;
      
      // Register the route with the MCP testing module
      mcpClient.execute('testing.registerFeature', {
        name: `Route: ${displayName}`,
        type: 'route',
        path: currentPath
      }).then(() => {
        console.log(`FeatureDetector: Registered route ${currentPath}`);
      }).catch(err => {
        console.error(`FeatureDetector: Failed to register route ${currentPath}`, err);
      });
    }
  }, [location.pathname]);
  
  // This is a utility component that doesn't render anything
  return null;
};

export default FeatureDetector;
