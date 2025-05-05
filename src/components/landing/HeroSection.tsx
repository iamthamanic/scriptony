
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
              {t('landing.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate('/auth')}>
                {t('landing.hero.start')}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth', {
                state: {
                  mode: 'login'
                }
              })}>
                {t('landing.hero.login')}
              </Button>
            </div>
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <img alt="Scriptony Demo Scene" className="w-full h-auto object-cover" src="/lovable-uploads/edf9e706-94e5-41dc-9bc6-c6a6e0642216.png" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
