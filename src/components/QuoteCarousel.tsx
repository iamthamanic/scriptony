
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
    <div className={cn("w-full py-16 bg-gradient-to-b from-background to-secondary/20", className)}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-12 text-foreground/90">
          Inspiration
        </h2>
        
        <Carousel
          setApi={setApi}
          className="w-full mx-auto"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent>
            {quotes.map((quote, index) => (
              <CarouselItem key={index}>
                <Card className="border-none bg-transparent shadow-none">
                  <CardContent className="p-8 text-center flex flex-col items-center justify-between min-h-[22rem]">
                    <div className="relative space-y-6">
                      <span className="absolute -top-10 -left-6 text-6xl font-serif text-primary/30">"</span>
                      <p className="text-lg md:text-2xl italic mb-8 leading-relaxed relative z-10">
                        {quote.text}
                      </p>
                      <span className="absolute -bottom-16 -right-6 text-6xl font-serif text-primary/30">"</span>
                      <div className="pt-4">
                        <p className="font-medium text-base md:text-lg">
                          {quote.author}
                        </p>
                        <p className="text-muted-foreground text-sm md:text-base mt-2">
                          {quote.source}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious className="left-1 border-primary/40 bg-background/80 backdrop-blur-sm hover:bg-primary/10" />
            <CarouselNext className="right-1 border-primary/40 bg-background/80 backdrop-blur-sm hover:bg-primary/10" />
          </div>
          
          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {quotes.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-500",
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
    </div>
  );
};

export default QuoteCarousel;
