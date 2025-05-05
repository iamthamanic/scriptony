
import React from 'react';
import { Check } from "lucide-react";
import { useTranslation } from 'react-i18next';

const FeatureListSection = () => {
  const { t } = useTranslation();
  
  const features = t('landing.featureList.features', { returnObjects: true }) as string[];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('landing.featureList.title')}</h2>
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center p-3 bg-card rounded-lg shadow">
              <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureListSection;
