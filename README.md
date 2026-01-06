# 🎉 Fountain Birthdays

A beautiful, modern birthday tracking application built with Next.js, React, and Tailwind CSS. Track birthdays, view them in card or calendar format, and never miss a celebration!

## Features

- **Card Wall View**: Responsive grid of birthday cards with hover animations
- **Calendar View**: Month grid showing birthdays with day-by-day breakdown
- **Search & Filter**: Search by name, filter by today, this month, or next 30 days
- **Today's Birthdays**: Special celebration section for birthdays happening today
- **Upcoming List**: Sidebar showing the next 10 upcoming birthdays
- **CRUD Operations**: Add, edit, and delete birthday entries
- **CSV Import/Export**: Import from CSV or export your data
- **LocalStorage Persistence**: All data is saved locally in your browser
- **Accessibility**: Respects `prefers-reduced-motion` and includes manual toggle
- **Leap Day Handling**: Properly handles February 29th birthdays

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default CSV Loading

The app automatically loads birthdays from `/public/data/birthdays.csv` on first launch. This file should contain:

- **Required columns**: `Name` and `DOB`
- **Date format**: `MM/DD/YYYY` or `MM/DD` (year optional)
- **Example**:
  ```csv
  Name,DOB
  John Doe,05/22/1994
  Jane Smith,06/15
  ```

The CSV parser:
- Ignores extra columns (only uses Name and DOB)
- Handles quoted fields
- Skips invalid rows
- For dates without year, uses current year (or next year if date has passed)

## Data Management

### Replacing/Resetting Data

1. **Import CSV**: Click "Import CSV" in the header and select a CSV file
2. **Manual Entry**: Use the "+ Add Person" button to add entries one by one
3. **Edit/Delete**: Click on any birthday card to open the modal with edit/delete options

### Exporting Data

Click "Export CSV" in the header to download your current data as a CSV file. The exported file contains only `Name` and `DOB` columns.

### LocalStorage

All birthday data is automatically saved to browser localStorage under the key `fountain-birthdays-data`. To reset:
- Clear browser localStorage, or
- Delete all entries manually, or
- Import a new CSV (replaces existing data)

## Leap Day Handling

The app properly handles February 29th birthdays:

- **In leap years**: Uses February 29th
- **In non-leap years**: Uses February 28th
- **Next birthday calculation**: Correctly finds the next occurrence, accounting for leap years

Example: Someone born on Feb 29, 2000 will have their next birthday on:
- Feb 29, 2024 (leap year)
- Feb 28, 2025 (non-leap year)
- Feb 29, 2026 (non-leap year, but 2026 is not a leap year, so Feb 28)

## Accessibility

- **Reduced Motion**: Automatically respects `prefers-reduced-motion` media query
- **Manual Toggle**: Click the motion toggle button (🎭/🎬) in the header to manually control animations
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper labels for screen readers

## Project Structure

```
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── BirthdayCard.tsx      # Individual birthday card
│   ├── BirthdayModal.tsx     # Modal with full details
│   ├── CalendarView.tsx      # Calendar month view
│   ├── CsvDropzone.tsx       # CSV import component
│   ├── HeaderControls.tsx    # Header with search/filter/view
│   ├── PersonForm.tsx        # Add/edit person form
│   └── UpcomingList.tsx      # Sidebar with upcoming birthdays
├── lib/
│   ├── birthdayUtils.ts      # Date calculations and utilities
│   ├── loadDefaultCsv.ts     # Load CSV from public/data
│   ├── parseCsv.ts           # CSV parsing and validation
│   ├── storage.ts            # localStorage wrapper
│   ├── types.ts              # TypeScript types
│   └── __tests__/
│       └── birthdayUtils.test.ts  # Unit tests
└── public/
    └── data/
        └── birthdays.csv     # Default CSV file
```

## Testing

Run unit tests with:

```bash
npm test
```

Tests cover:
- Next birthday calculation (including leap day handling)
- Days-until calculation
- Leap day rules
- Sorting by soonest birthday
- Filtering logic

## Deployment

### Vercel

This app is ready for Vercel deployment:

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

The app works as a static site (with client-side rendering) and doesn't require any server-side configuration.

### Build for Production

```bash
npm run build
npm start
```

## Technologies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **date-fns**: Date manipulation
- **Vitest**: Testing framework

## License

MIT

## Contributing

Feel free to open issues or submit pull requests!


