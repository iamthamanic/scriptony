
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Shield, BarChart2, TestTube2 } from "lucide-react";
import { checkIsAdmin } from "@/utils/trackUsage";
import { trackPageView } from '@/utils/trackUsage';

const Admin: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      setLoading(true);
      const admin = await checkIsAdmin();
      setIsAdmin(admin);
      setLoading(false);
      
      // Track page view
      if (admin) {
        trackPageView('admin_dashboard');
      }
    };
    
    verifyAdmin();
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center h-64">
          <p>Verifiziere Admin-Berechtigungen...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }
  
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 mr-3 text-anime-purple" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2" />
              Usage Analytics
            </CardTitle>
            <CardDescription>
              Überwache die Nutzung der Anwendung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">
              Analysiere Benutzeraktivitäten, Funktionsnutzung und mehr.
            </p>
            <Button onClick={() => navigate('/admin/usage')} className="w-full">
              Zu Analytics
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube2 className="h-5 w-5 mr-2" />
              Tests & Debugging
            </CardTitle>
            <CardDescription>
              Teste Funktionen und finde Fehler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">
              Führe Tests durch und überprüfe die Funktionalität der Anwendung.
            </p>
            <Button onClick={() => navigate('/admin/tests')} className="w-full">
              Zu Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
