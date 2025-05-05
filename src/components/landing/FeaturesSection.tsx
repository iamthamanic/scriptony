
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation();
  
  const features = [
    { 
      emoji: "🪄", 
      title: t('landing.features.startProject'), 
      description: t('landing.features.startProjectDesc') 
    },
    { 
      emoji: "📚", 
      title: t('landing.features.chooseStructure'), 
      description: t('landing.features.chooseStructureDesc') 
    },
    { 
      emoji: "🎞️", 
      title: t('landing.features.visualizeScenes'), 
      description: t('landing.features.visualizeScenesDesc') 
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('landing.features.title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
