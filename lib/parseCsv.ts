import { BirthdayPerson } from './types';

/**
 * Parse CSV content and extract Name and DOB columns
 * Handles various date formats and missing years
 */
export function parseCsv(csvContent: string): BirthdayPerson[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }

  // Parse header to find Name and DOB column indices
  const header = lines[0].split(',').map(col => col.trim().toLowerCase());
  const nameIndex = header.findIndex(col => col === 'name');
  const dobIndex = header.findIndex(col => col === 'dob' || col === 'date of birth' || col === 'birthday');

  if (nameIndex === -1 || dobIndex === -1) {
    throw new Error('CSV must contain "Name" and "DOB" columns');
  }

  const people: BirthdayPerson[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim());

    if (fields.length <= Math.max(nameIndex, dobIndex)) {
      continue;
    }

    const name = fields[nameIndex]?.trim();
    const dobStr = fields[dobIndex]?.trim();

    if (!name || !dobStr) {
      continue;
    }

    // Parse date - handle formats like MM/DD/YYYY, M/D/YYYY, MM/DD, M/D
    let dob: Date | null = null;
    
    // Try MM/DD/YYYY or M/D/YYYY
    const dateMatch = dobStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dateMatch) {
      const month = parseInt(dateMatch[1], 10);
      const day = parseInt(dateMatch[2], 10);
      const year = parseInt(dateMatch[3], 10);
      dob = new Date(year, month - 1, day);
    } else {
      // Try MM/DD or M/D (no year) - use current year or next year if date has passed
      const dateMatchNoYear = dobStr.match(/^(\d{1,2})\/(\d{1,2})$/);
      if (dateMatchNoYear) {
        const month = parseInt(dateMatchNoYear[1], 10);
        const day = parseInt(dateMatchNoYear[2], 10);
        const testDate = new Date(currentYear, month - 1, day);
        const today = new Date();
        
        // If the date has passed this year, use next year
        if (testDate < today) {
          dob = new Date(currentYear + 1, month - 1, day);
        } else {
          dob = testDate;
        }
      }
    }

    if (!dob || isNaN(dob.getTime())) {
      continue;
    }

    // Generate ID from name and DOB
    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${dob.getTime()}`;

    people.push({
      id,
      name,
      dob,
    });
  }

  return people;
}

