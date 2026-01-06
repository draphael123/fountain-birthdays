import { parseCsv } from './parseCsv';
import { BirthdayPerson } from './types';

/**
 * Load default CSV from public/data/birthdays.csv
 */
export async function loadDefaultCsv(): Promise<BirthdayPerson[]> {
  try {
    const response = await fetch('/data/birthdays.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }
    const csvContent = await response.text();
    return parseCsv(csvContent);
  } catch (error) {
    console.error('Error loading default CSV:', error);
    return [];
  }
}


