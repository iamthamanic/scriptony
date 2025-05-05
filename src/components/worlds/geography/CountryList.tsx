
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map } from 'lucide-react';
import { Country } from '@/types/worlds';
import CountryCard from './CountryCard';

interface CountryListProps {
  countries: Country[];
  expandedCountryId: string | null;
  onToggleExpand: (countryId: string) => void;
  onAddCountry: () => void;
  onEditCountry: (country: Country) => void;
  onDeleteCountry: (countryId: string) => void;
}

const CountryList: React.FC<CountryListProps> = ({
  countries,
  expandedCountryId,
  onToggleExpand,
  onAddCountry,
  onEditCountry,
  onDeleteCountry
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Länder</h3>
        <Button 
          onClick={onAddCountry}
          size="sm"
          className="bg-anime-purple hover:bg-anime-dark-purple"
        >
          <Plus className="h-4 w-4 mr-2" /> Land hinzufügen
        </Button>
      </div>
      
      {countries.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Map className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Keine Länder vorhanden. Fügen Sie ein neues Land hinzu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              isExpanded={expandedCountryId === country.id}
              onToggleExpand={() => onToggleExpand(country.id)}
              onEdit={() => onEditCountry(country)}
              onDelete={() => onDeleteCountry(country.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryList;
