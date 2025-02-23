
// Function to normalize strings for comparison
export const normalizeString = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ');

// Function to check if a wage falls within a range
export const isInHourlyWageRange = (wage: string, range: string) => {
  if (!wage) return false;
  const numericWage = parseInt(wage.replace(/[^0-9]/g, ''));
  if (isNaN(numericWage)) return false;
  
  const [min, max] = range.split('-').map(num => parseInt(num.replace(/\D/g, '')));
  if (range.endsWith('+')) return numericWage >= min;
  return numericWage >= min && numericWage <= max;
};
