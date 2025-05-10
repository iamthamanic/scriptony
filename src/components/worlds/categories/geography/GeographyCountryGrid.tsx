
import React from 'react';
import { Country } from "@/types/worlds/geography";
import GeographyCountryCard from './GeographyCountryCard';

interface GeographyCountryGridProps {
  countries: Country[];
}

const GeographyCountryGrid: React.FC<GeographyCountryGridProps> = ({ countries }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {countries.map((country) => (
        <GeographyCountryCard key={country.id} country={country} />
      ))}
    </div>
  );
};

export default GeographyCountryGrid;
