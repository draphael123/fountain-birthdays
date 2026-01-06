# Adding Team Information

The app now supports team/department information for each person. Here's how to add team data:

## CSV Format

Update your CSV file to include a `Team` column:

```csv
Name,DOB,Team
John Doe,05/22/1994,Engineering
Jane Smith,06/15/1990,Marketing
Bob Johnson,07/10/1988,Sales
```

## Adding Teams to Existing Data

### Option 1: Update CSV and Re-import

1. Export your current data (click "Export CSV")
2. Open the CSV in Excel or Google Sheets
3. Add a "Team" column
4. Fill in team names for each person
5. Save and re-import the CSV

### Option 2: Edit Individual Records

1. Click on any birthday card
2. Click "Edit"
3. Enter the team name in the "Team (Optional)" field
4. Click "Update"

### Option 3: Convert Excel to CSV with Teams

If you have the "General Staff Directory" Excel file:

1. Open the Excel file
2. Ensure it has columns: Name, DOB, and Team (or Department/Group)
3. Export/Save as CSV
4. Import the CSV using "Import CSV" button

## Team Filtering

Once teams are added:
- Use the "Team" dropdown in the header to filter by team
- Search will also search team names
- Teams are displayed on birthday cards and in the modal

## CSV Column Names Supported

The parser recognizes these column names for teams:
- `Team`
- `Department`
- `Group`

