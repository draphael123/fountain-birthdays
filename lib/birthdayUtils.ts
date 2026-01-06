import { BirthdayPerson } from './types';
import { format, isLeapYear, addYears, differenceInDays, startOfDay, isToday, isSameMonth, isSameYear, parse } from 'date-fns';

/**
 * Calculate the next birthday date for a person
 * Handles leap day birthdays (Feb 29) by using Feb 28 in non-leap years
 */
export function getNextBirthday(dob: Date): Date {
  const today = startOfDay(new Date());
  const currentYear = today.getFullYear();
  
  // Get month and day from DOB
  const birthMonth = dob.getMonth();
  const birthDay = dob.getDate();
  
  // Handle leap day birthdays
  let nextBirthday: Date;
  if (birthMonth === 1 && birthDay === 29) {
    // Feb 29 birthday
    if (isLeapYear(currentYear)) {
      nextBirthday = new Date(currentYear, 1, 29);
      if (nextBirthday < today) {
        // Already passed this year, check next leap year
        let nextLeapYear = currentYear + 1;
        while (!isLeapYear(nextLeapYear)) {
          nextLeapYear++;
        }
        nextBirthday = new Date(nextLeapYear, 1, 29);
      }
    } else {
      // Not a leap year, use Feb 28
      nextBirthday = new Date(currentYear, 1, 28);
      if (nextBirthday < today) {
        // Check next year
        if (isLeapYear(currentYear + 1)) {
          nextBirthday = new Date(currentYear + 1, 1, 29);
        } else {
          nextBirthday = new Date(currentYear + 1, 1, 28);
        }
      }
    }
  } else {
    // Regular birthday
    nextBirthday = new Date(currentYear, birthMonth, birthDay);
    if (nextBirthday < today) {
      // Already passed this year, use next year
      nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
    }
  }
  
  return startOfDay(nextBirthday);
}

/**
 * Calculate days until next birthday
 */
export function getDaysUntilBirthday(dob: Date): number {
  const nextBirthday = getNextBirthday(dob);
  const today = startOfDay(new Date());
  return differenceInDays(nextBirthday, today);
}

/**
 * Check if birthday is today
 */
export function isBirthdayToday(dob: Date): boolean {
  const nextBirthday = getNextBirthday(dob);
  return isToday(nextBirthday);
}

/**
 * Get formatted birthday string (Month Day)
 */
export function getFormattedBirthday(dob: Date): string {
  return format(dob, 'MMMM d');
}

/**
 * Get formatted full date of birth
 */
export function getFormattedDOB(dob: Date): string {
  return format(dob, 'MMMM d, yyyy');
}

/**
 * Get formatted next birthday date
 */
export function getFormattedNextBirthday(dob: Date): string {
  const nextBirthday = getNextBirthday(dob);
  return format(nextBirthday, 'MMMM d, yyyy');
}

/**
 * Sort birthdays by soonest (next birthday date)
 */
export function sortBySoonestBirthday(people: BirthdayPerson[]): BirthdayPerson[] {
  return [...people].sort((a, b) => {
    const daysA = getDaysUntilBirthday(a.dob);
    const daysB = getDaysUntilBirthday(b.dob);
    return daysA - daysB;
  });
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate a birthday message
 */
export function generateBirthdayMessage(name: string): string {
  return `🎉 Happy Birthday ${name}! Wishing you a wonderful day filled with joy and celebration! 🎂🎈`;
}

/**
 * Filter birthdays based on filter type
 */
export function filterBirthdays(people: BirthdayPerson[], filter: 'all' | 'today' | 'thisMonth' | 'next30Days'): BirthdayPerson[] {
  const today = new Date();
  
  switch (filter) {
    case 'today':
      return people.filter(person => isBirthdayToday(person.dob));
    
    case 'thisMonth':
      return people.filter(person => {
        const nextBirthday = getNextBirthday(person.dob);
        return isSameMonth(nextBirthday, today) && isSameYear(nextBirthday, today);
      });
    
    case 'next30Days':
      return people.filter(person => {
        const daysUntil = getDaysUntilBirthday(person.dob);
        return daysUntil >= 0 && daysUntil <= 30;
      });
    
    case 'all':
    default:
      return people;
  }
}

/**
 * Get birthdays happening this month
 */
export function getThisMonthBirthdays(people: BirthdayPerson[]): BirthdayPerson[] {
  return filterBirthdays(people, 'thisMonth');
}

/**
 * Get upcoming birthdays (next 10)
 */
export function getUpcomingBirthdays(people: BirthdayPerson[], count: number = 10): BirthdayPerson[] {
  const sorted = sortBySoonestBirthday(people);
  return sorted.slice(0, count);
}

