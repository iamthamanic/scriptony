
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PricingSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const plans = [
    {
      name: t('landing.pricing.free.name'),
      price: t('landing.pricing.free.price'),
      features: t('landing.pricing.free.features', { returnObjects: true }) as string[]
    },
    {
      name: t('landing.pricing.pro.name'),
      price: t('landing.pricing.pro.price'),
      features: t('landing.pricing.pro.features', { returnObjects: true }) as string[]
    },
    {
      name: t('landing.pricing.studio.name'),
      price: t('landing.pricing.studio.price'),
      features: t('landing.pricing.studio.features', { returnObjects: true }) as string[]
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{t('landing.pricing.title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`hover-scale ${index === 1 ? 'border-primary shadow-lg' : ''}`}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <div className="pt-4 space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`mt-6 w-full ${index === 1 ? 'bg-primary hover:bg-primary/90' : ''}`} 
                    variant={index === 1 ? 'default' : 'outline'} 
                    onClick={() => navigate('/auth')}
                  >
                    {t('landing.pricing.select')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
