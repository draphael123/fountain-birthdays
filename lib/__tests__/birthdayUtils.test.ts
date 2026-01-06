import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getNextBirthday,
  getDaysUntilBirthday,
  isBirthdayToday,
  getFormattedBirthday,
  getFormattedDOB,
  getFormattedNextBirthday,
  sortBySoonestBirthday,
  getInitials,
  generateBirthdayMessage,
  filterBirthdays,
} from '../birthdayUtils';
import { BirthdayPerson } from '../types';

describe('birthdayUtils', () => {
  beforeEach(() => {
    // Mock current date to January 15, 2024 (Monday)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getNextBirthday', () => {
    it('should return birthday later this year if not yet passed', () => {
      const dob = new Date('1990-06-15');
      const nextBirthday = getNextBirthday(dob);
      expect(nextBirthday.getFullYear()).toBe(2024);
      expect(nextBirthday.getMonth()).toBe(5); // June (0-indexed)
      expect(nextBirthday.getDate()).toBe(15);
    });

    it('should return birthday next year if already passed this year', () => {
      const dob = new Date('1990-03-10'); // March 10, already passed
      const nextBirthday = getNextBirthday(dob);
      expect(nextBirthday.getFullYear()).toBe(2025);
      expect(nextBirthday.getMonth()).toBe(2); // March
      expect(nextBirthday.getDate()).toBe(10);
    });

    it('should handle leap day birthday in non-leap year', () => {
      const dob = new Date('2000-02-29'); // Leap day
      const nextBirthday = getNextBirthday(dob);
      // 2024 is a leap year, so should use Feb 29
      expect(nextBirthday.getFullYear()).toBe(2024);
      expect(nextBirthday.getMonth()).toBe(1); // February
      expect(nextBirthday.getDate()).toBe(29);
    });

    it('should handle leap day birthday when current year is not leap year', () => {
      // Set to 2023 (not a leap year)
      vi.setSystemTime(new Date('2023-01-15'));
      const dob = new Date('2000-02-29');
      const nextBirthday = getNextBirthday(dob);
      // Should use Feb 28 in 2023, or Feb 29 in 2024
      expect(nextBirthday.getFullYear()).toBe(2024);
      expect(nextBirthday.getMonth()).toBe(1);
      expect(nextBirthday.getDate()).toBe(29);
    });
  });

  describe('getDaysUntilBirthday', () => {
    it('should calculate correct days until birthday', () => {
      const dob = new Date('1990-06-15'); // June 15
      const daysUntil = getDaysUntilBirthday(dob);
      // From Jan 15 to June 15 = 152 days
      expect(daysUntil).toBe(152);
    });

    it('should return 0 if birthday is today', () => {
      const dob = new Date('1990-01-15'); // Same as mocked date
      const daysUntil = getDaysUntilBirthday(dob);
      expect(daysUntil).toBe(0);
    });

    it('should handle birthday that already passed this year', () => {
      const dob = new Date('1990-01-10'); // Jan 10, already passed
      const daysUntil = getDaysUntilBirthday(dob);
      // Should be next year's date, so 365 - 5 = 360 days
      expect(daysUntil).toBe(360);
    });
  });

  describe('isBirthdayToday', () => {
    it('should return true if birthday is today', () => {
      const dob = new Date('1990-01-15'); // Same as mocked date
      expect(isBirthdayToday(dob)).toBe(true);
    });

    it('should return false if birthday is not today', () => {
      const dob = new Date('1990-06-15');
      expect(isBirthdayToday(dob)).toBe(false);
    });
  });

  describe('getFormattedBirthday', () => {
    it('should format birthday correctly', () => {
      const dob = new Date('1990-06-15');
      const formatted = getFormattedBirthday(dob);
      expect(formatted).toBe('June 15');
    });
  });

  describe('getFormattedDOB', () => {
    it('should format full date of birth', () => {
      const dob = new Date('1990-06-15');
      const formatted = getFormattedDOB(dob);
      expect(formatted).toBe('June 15, 1990');
    });
  });

  describe('getFormattedNextBirthday', () => {
    it('should format next birthday date', () => {
      const dob = new Date('1990-06-15');
      const formatted = getFormattedNextBirthday(dob);
      expect(formatted).toBe('June 15, 2024');
    });
  });

  describe('sortBySoonestBirthday', () => {
    it('should sort birthdays by soonest', () => {
      const people: BirthdayPerson[] = [
        { id: '1', name: 'Alice', dob: new Date('1990-06-15') }, // 152 days
        { id: '2', name: 'Bob', dob: new Date('1990-03-10') }, // 55 days (next year)
        { id: '3', name: 'Charlie', dob: new Date('1990-02-20') }, // 36 days
      ];

      const sorted = sortBySoonestBirthday(people);
      expect(sorted[0].name).toBe('Charlie'); // 36 days
      expect(sorted[1].name).toBe('Bob'); // 55 days (next year)
      expect(sorted[2].name).toBe('Alice'); // 152 days
    });
  });

  describe('getInitials', () => {
    it('should return initials for full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Mary Jane Watson')).toBe('MW');
    });

    it('should handle single name', () => {
      expect(getInitials('Madonna')).toBe('MA');
    });

    it('should handle empty or whitespace', () => {
      expect(getInitials('  John  Doe  ')).toBe('JD');
    });
  });

  describe('generateBirthdayMessage', () => {
    it('should generate birthday message', () => {
      const message = generateBirthdayMessage('John');
      expect(message).toContain('John');
      expect(message).toContain('Happy Birthday');
    });
  });

  describe('filterBirthdays', () => {
    const people: BirthdayPerson[] = [
      { id: '1', name: 'Today', dob: new Date('1990-01-15') }, // Today
      { id: '2', name: 'This Month', dob: new Date('1990-01-20') }, // Jan 20
      { id: '3', name: 'Next Month', dob: new Date('1990-02-10') }, // Feb 10
      { id: '4', name: 'Far Away', dob: new Date('1990-06-15') }, // June 15
    ];

    it('should filter by today', () => {
      const filtered = filterBirthdays(people, 'today');
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Today');
    });

    it('should filter by this month', () => {
      const filtered = filterBirthdays(people, 'thisMonth');
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some(p => p.name === 'Today')).toBe(true);
      expect(filtered.some(p => p.name === 'This Month')).toBe(true);
    });

    it('should filter by next 30 days', () => {
      const filtered = filterBirthdays(people, 'next30Days');
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some(p => p.name === 'Today')).toBe(true);
      expect(filtered.some(p => p.name === 'This Month')).toBe(true);
      expect(filtered.some(p => p.name === 'Next Month')).toBe(true);
    });

    it('should return all for all filter', () => {
      const filtered = filterBirthdays(people, 'all');
      expect(filtered.length).toBe(people.length);
    });
  });
});

