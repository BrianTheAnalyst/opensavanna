
import { useState } from 'react';

export const useUploadForm = () => {
  // These could be fetched from an API in the future
  const categories = [
    { label: 'Economics', value: 'Economics' },
    { label: 'Health', value: 'Health' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Agriculture', value: 'Agriculture' },
    { label: 'Education', value: 'Education' },
    { label: 'Environment', value: 'Environment' },
    { label: 'Demographics', value: 'Demographics' },
    { label: 'Government', value: 'Government' },
    { label: 'Energy', value: 'Energy' }
  ];
  
  const countries = [
    { label: 'East Africa', value: 'East Africa' },
    { label: 'West Africa', value: 'West Africa' },
    { label: 'South Africa', value: 'South Africa' },
    { label: 'North Africa', value: 'North Africa' },
    { label: 'Central Africa', value: 'Central Africa' },
    { label: 'Global', value: 'Global' },
    { label: 'Kenya', value: 'Kenya' },
    { label: 'Nigeria', value: 'Nigeria' },
    { label: 'Ghana', value: 'Ghana' },
    { label: 'Ethiopia', value: 'Ethiopia' },
    { label: 'Uganda', value: 'Uganda' },
    { label: 'Tanzania', value: 'Tanzania' },
    { label: 'Rwanda', value: 'Rwanda' },
    { label: 'Egypt', value: 'Egypt' },
    { label: 'Morocco', value: 'Morocco' }
  ];
  
  const formats = [
    { label: 'CSV', value: 'CSV' },
    { label: 'JSON', value: 'JSON' },
    { label: 'GeoJSON', value: 'GeoJSON' }
  ];

  return {
    categories,
    countries,
    formats
  };
};
