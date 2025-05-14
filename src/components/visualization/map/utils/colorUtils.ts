
// Get a color scale based on data category
export const getColorScaleForCategory = (category?: string): string[] => {
  // Color scales optimized for different data types
  const scales: Record<string, string[]> = {
    energy: ['#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32'],
    electricity: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'], // Added specific scale for electricity
    power: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'], // Similar to electricity
    health: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
    economics: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'],
    environment: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    default: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']
  };

  // Find the most appropriate color scale
  let key = 'default';
  if (category) {
    const lowerCategory = category.toLowerCase();
    for (const scaleKey of Object.keys(scales)) {
      if (lowerCategory.includes(scaleKey)) {
        key = scaleKey;
        break;
      }
    }
  }

  return scales[key];
};

// Format property values for display
export const formatPropertyValue = (value: any): string => {
  if (typeof value === 'number') {
    if (value % 1 !== 0) {
      return value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
    return value.toLocaleString();
  }
  return String(value);
};

// Format property keys for display (convert snake_case or camelCase to Title Case)
export const formatPropertyKey = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};
