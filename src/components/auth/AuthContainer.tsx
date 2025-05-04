
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AuthContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ 
  title, 
  description, 
  children, 
  footer 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-2"
        onClick={() => navigate('/landing')}
      >
        <ArrowLeft className="h-4 w-4" /> {t('common.back')}
      </Button>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && (
          <CardFooter className="flex justify-center border-t pt-4">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AuthContainer;
