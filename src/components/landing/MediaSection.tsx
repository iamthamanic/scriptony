
import React from 'react';
import { useTranslation } from 'react-i18next';

const MediaSection = () => {
  const { t } = useTranslation();
  
  const mediaTypes = [
    { emoji: "🎬", title: t('landing.media.film') },
    { emoji: "🎧", title: t('landing.media.audio') },
    { emoji: "🎭", title: t('landing.media.theater') },
    { emoji: "🎮", title: t('landing.media.game') }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{t('landing.media.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('landing.media.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {mediaTypes.map((media, index) => (
            <div key={index} className="p-4 hover:bg-accent rounded-lg transition-colors">
              <p className="text-2xl mb-2">{media.emoji}</p>
              <p className="font-medium">{media.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
