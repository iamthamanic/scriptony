
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import WorldsContainer from "../components/worlds/WorldsContainer";

const Worldbuilding = () => {
  const { user } = useAuth();
  
  return (
    <div className="py-6 px-4 md:px-6">
      <WorldsContainer user={user} />
    </div>
  );
};

export default Worldbuilding;
