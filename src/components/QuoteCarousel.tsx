import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface Quote {
  text: string;
  author: string;
  source: string;
  category: string;
}

type QuoteCarouselProps = {
  className?: string;
  autoPlayInterval?: number;
}

const QuoteCarousel: React.FC<QuoteCarouselProps> = ({ 
  className,
  autoPlayInterval = 8000 // Default to 8 seconds per quote
}) => {
  const { t, i18n } = useTranslation();
  const quotes = t('quotes.items', { returnObjects: true }) as Quote[];
  const [api, setApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Set up autoplay
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoPlayInterval);

    // Handle when the language changes - reset the carousel
    const onLangChange = () => {
      api.scrollTo(0);
      setCurrentIndex(0);
    };

    i18n.on('languageChanged', onLangChange);
    
    return () => {
      clearInterval(interval);
      i18n.off('languageChanged', onLangChange);
    };
  }, [api, autoPlayInterval, i18n]);

  // Keep track of current slide for indicators
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full py-8", className)}>
      <h2 className="text-xl font-semibold text-center mb-8">
        Inspiration
      </h2>
      
      <Carousel
        setApi={setApi}
        className="w-full max-w-3xl mx-auto"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent>
          {quotes.map((quote, index) => (
            <CarouselItem key={index}>
              <Card className="border-none">
                <CardContent className="p-6 text-center flex flex-col items-center justify-between min-h-[16rem]">
                  <div className="space-y-4">
                    <p className="text-lg md:text-xl italic mb-4 leading-relaxed">
                      "{quote.text}"
                    </p>
                    <p className="font-medium text-sm md:text-base">
                      {quote.author}
                    </p>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      {quote.source}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden md:block">
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </div>
        
        {/* Slide indicators */}
        <div className="flex justify-center gap-1 mt-4">
          {quotes.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index 
                  ? "bg-primary scale-125" 
                  : "bg-muted hover:bg-primary/50"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default QuoteCarousel;
