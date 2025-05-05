
import React from 'react';
import { Check, X, AlertCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';

const ComparisonSection = () => {
  const { t } = useTranslation();

  const features = [
    { id: 'visualScene', label: t('landing.comparison.features.visualScene') },
    { id: 'templates', label: t('landing.comparison.features.templates') },
    { id: 'shots', label: t('landing.comparison.features.shots') },
    { id: 'multimedia', label: t('landing.comparison.features.multimedia') },
    { id: 'export', label: t('landing.comparison.features.export') },
    { id: 'aiReady', label: t('landing.comparison.features.aiReady') },
  ];

  const competitors = [
    { id: 'scriptBuddy', name: t('landing.comparison.competitors.scriptBuddy') },
    { id: 'finalDraft', name: t('landing.comparison.competitors.finalDraft') },
    { id: 'celtx', name: t('landing.comparison.competitors.celtx') },
    { id: 'plottr', name: t('landing.comparison.competitors.plottr') },
    { id: 'storyboardThat', name: t('landing.comparison.competitors.storyboardThat') },
  ];

  // This represents which competitor has which feature
  // Full support: true, Partial support: 'partial', No support: false
  const featureMatrix = {
    visualScene: { scriptBuddy: true, finalDraft: false, celtx: 'partial', plottr: false, storyboardThat: true },
    templates: { scriptBuddy: true, finalDraft: false, celtx: true, plottr: true, storyboardThat: false },
    shots: { scriptBuddy: true, finalDraft: false, celtx: false, plottr: false, storyboardThat: 'partial' },
    multimedia: { scriptBuddy: true, finalDraft: false, celtx: false, plottr: 'partial', storyboardThat: false },
    export: { scriptBuddy: true, finalDraft: true, celtx: true, plottr: false, storyboardThat: false },
    aiReady: { scriptBuddy: true, finalDraft: false, celtx: false, plottr: false, storyboardThat: false },
  };

  const renderSupportIcon = (support: boolean | string) => {
    if (support === true) {
      return <Check className="h-5 w-5 mx-auto text-green-500" />;
    } else if (support === 'partial') {
      return <AlertCircle className="h-5 w-5 mx-auto text-amber-500" />;
    } else {
      return <X className="h-5 w-5 mx-auto text-red-500" />;
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{t('landing.comparison.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('landing.comparison.subtitle')}
          </p>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">{t('landing.comparison.title')}</th>
                {competitors.map((competitor) => (
                  <th key={competitor.id} className="px-4 py-3 text-center">{competitor.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {features.map((feature, index) => (
                <tr key={feature.id} className={index % 2 === 0 ? "bg-card" : "bg-background"}>
                  <td className="px-4 py-3">{feature.label}</td>
                  {competitors.map((competitor) => (
                    <td key={`${feature.id}-${competitor.id}`} className="px-4 py-3 text-center">
                      {renderSupportIcon(featureMatrix[feature.id as keyof typeof featureMatrix][competitor.id as keyof typeof featureMatrix[keyof typeof featureMatrix]])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
