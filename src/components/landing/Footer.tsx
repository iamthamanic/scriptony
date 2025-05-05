
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg">Scriptony</span>
            <p className="text-sm text-muted-foreground">{t('landing.footer.copyright')}</p>
          </div>
          <div className="flex gap-4">
            <Link to="#" className="text-muted-foreground hover:text-foreground">{t('landing.footer.imprint')}</Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground">{t('landing.footer.privacy')}</Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground">{t('landing.footer.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
