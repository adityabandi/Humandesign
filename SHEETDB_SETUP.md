# SheetDB Integration Setup Guide

This guide explains how to set up SheetDB integration for collecting Human Design quiz responses.

## SheetDB Configuration

### Required Google Sheets Columns

Your Google Sheet should have the following column headers:

1. **id** - Unique identifier for each submission
2. **name** - User's full name
3. **email** - User's email address (required)
4. **birth_date** - Birth date (YYYY-MM-DD format)
5. **birth_time** - Birth time (HH:MM format)
6. **location** - Birth location (city, state/province, country)
7. **human_design_output** - Complete Human Design analysis result (JSON format)
8. **created_at** - Timestamp of submission

### Setup Instructions

1. **Create a Google Sheet** with the column headers listed above

2. **Get your SheetDB API URL**:
   - Go to [SheetDB.io](https://sheetdb.io)
   - Create an account and connect your Google Sheet
   - Copy your API URL (format: `https://sheetdb.io/api/v1/your-sheet-id`)

3. **Configure the application**:
   - Open `assets/sheetdb.js`
   - Replace `'https://sheetdb.io/api/v1/your-sheet-id'` with your actual API URL
   - Set `enabled: true` in the SHEETDB_CONFIG object

4. **Test the connection**:
   - The application includes error handling and fallbacks
   - If SheetDB is unavailable, data will be stored locally as backup
   - Check browser console for connection status

### Data Format

The `human_design_output` column will contain JSON data with:

```json
{
  "type": "Generator",
  "authority": "Sacral",
  "profile": "1/3",
  "centers": { ... },
  "insights": [ ... ]
}
```

### Security & Privacy

- All data transmission uses HTTPS
- No sensitive data is logged in browser console
- Local fallback ensures no data loss
- Users are informed about data collection

### Troubleshooting

1. **API Connection Issues**: Check the API URL and internet connectivity
2. **Missing Data**: Verify all required form fields are filled
3. **Sheet Permissions**: Ensure the Google Sheet is accessible to SheetDB
4. **Rate Limiting**: SheetDB has usage limits based on your plan

For more information, visit the [SheetDB documentation](https://docs.sheetdb.io/).