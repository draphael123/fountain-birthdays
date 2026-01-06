import { BirthdayPerson } from './types';

const STORAGE_KEY = 'fountain-birthdays-data';

/**
 * Load birthdays from localStorage
 */
export function loadBirthdaysFromStorage(): BirthdayPerson[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const data = JSON.parse(stored);
    return data.map((person: any) => ({
      ...person,
      dob: new Date(person.dob),
    }));
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
}

/**
 * Save birthdays to localStorage
 */
export function saveBirthdaysToStorage(people: BirthdayPerson[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Clear birthdays from localStorage
 */
export function clearBirthdaysFromStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}


