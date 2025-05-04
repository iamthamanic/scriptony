
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const { t } = useTranslation();
  
  const dimensions = {
    sm: { logoSize: 30, textSize: 'text-lg' },
    md: { logoSize: 40, textSize: 'text-xl' },
    lg: { logoSize: 60, textSize: 'text-2xl' },
  };

  const { logoSize, textSize } = dimensions[size];

  return (
    <div className="flex items-center gap-2">
      <img
        src="/lovable-uploads/49c12d7f-e474-417e-bdb5-39d785433846.png"
        alt="ScriptBuddy Logo"
        width={logoSize}
        height={logoSize}
        className="object-contain"
      />
      {showText && (
        <span className={`font-bold text-anime-purple ${textSize}`}>
          ScriptBuddy
        </span>
      )}
    </div>
  );
};

export default Logo;
