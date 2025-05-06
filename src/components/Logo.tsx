
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isDevelopmentMode } from '@/utils/devMode';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true
}) => {
  const { t } = useTranslation();
  const devMode = isDevelopmentMode();
  
  const dimensions = {
    sm: {
      logoSize: 30,
      textSize: 'text-lg'
    },
    md: {
      logoSize: 40,
      textSize: 'text-xl'
    },
    lg: {
      logoSize: 60,
      textSize: 'text-2xl'
    }
  };
  
  const { logoSize, textSize } = dimensions[size];
  
  return (
    <div className="flex items-center gap-2">
      <img 
        alt="Scriptony Logo" 
        width={logoSize} 
        height={logoSize} 
        className="object-contain" 
        src="/lovable-uploads/f9945795-2fd8-4c63-b289-7fd7a6522dd2.png" 
      />
      {showText && (
        <div>
          <span className={`font-bold text-anime-purple ${textSize}`}>
            Scriptony
          </span>
          {devMode && (
            <span className="text-xs text-muted-foreground ml-1">(Dev)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
