import React, { useEffect, useState } from 'react';
import { useDriveConnection } from '@/hooks/useDriveConnection';
import DriveConnectionModal from './DriveConnectionModal';

interface DriveConnectionCheckerProps {
  children: React.ReactNode;
  enforceConnection?: boolean;
}

const DriveConnectionChecker: React.FC<DriveConnectionCheckerProps> = ({ 
  children,
  enforceConnection = false
}) => {
  const { connected, loading } = useDriveConnection();
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // If we're enforcing connection and not connected, show modal
    if (enforceConnection && connected === false && !loading) {
      setShowModal(true);
    }
  }, [connected, loading, enforceConnection]);
  
  // When connection is loading, or we're not enforcing, just show children
  if (loading || !enforceConnection) {
    return <>{children}</>;
  }
  
  // Otherwise render with modal if needed
  return (
    <>
      {children}
      <DriveConnectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        showCloseButton={false}
      />
    </>
  );
};

export default DriveConnectionChecker;
