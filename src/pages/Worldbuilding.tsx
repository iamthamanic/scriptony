
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import WorldsContainer from "../components/worlds/WorldsContainer";

const Worldbuilding = () => {
  const { user } = useAuth();
  
  return <WorldsContainer user={user} />;
};

export default Worldbuilding;
