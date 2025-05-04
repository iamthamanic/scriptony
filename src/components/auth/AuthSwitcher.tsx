
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

interface AuthSwitcherProps {
  isLogin: boolean;
  isPasswordReset: boolean;
  onToggle: () => void;
}

const AuthSwitcher: React.FC<AuthSwitcherProps> = ({ isLogin, isPasswordReset, onToggle }) => {
  const { t } = useTranslation();

  return (
    <Button variant="link" onClick={onToggle}>
      {isPasswordReset 
        ? t('common.backToLogin')
        : isLogin 
          ? t('common.notRegistered') 
          : t('common.alreadyRegistered')}
    </Button>
  );
};

export default AuthSwitcher;
