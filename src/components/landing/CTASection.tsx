
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CTASection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-primary/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">{t('landing.footer.startProject')}</h2>
        <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate('/auth')}>
          {t('landing.footer.startFree')}
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
