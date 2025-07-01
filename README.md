# Glucose Tracker

A comprehensive, mobile-optimized glucose tracking application built with React and TypeScript. Monitor your daily glucose levels with detailed reports, data visualization, and export functionality.

## Features

### 📊 Daily Tracking
- Add glucose readings with timestamps
- Categorize readings by meal type (before/after breakfast, lunch, dinner, bedtime)
- Add notes, medication, exercise, and stress level information
- Mobile-optimized input forms

### 📈 Data Visualization
- Interactive line charts showing glucose trends
- Color-coded readings (low, normal, high, very high)
- Target range reference lines
- Responsive charts that work on all devices

### 📋 Reports & Analytics
- Comprehensive statistics (average, min/max, in-range percentage)
- Meal type analysis
- Date range filtering (today, 7 days, 30 days, custom periods)
- Detailed data tables

### 📤 Export Functionality
- Export to CSV format
- Export to Excel with multiple sheets
- Generate PDF reports
- Backup and restore data

### ⚙️ Settings & Customization
- Customizable target glucose ranges
- Unit selection (mg/dL or mmol/L)
- Reminder settings
- Data management (import/export/delete)

### 📱 Mobile Optimization
- Progressive Web App (PWA) support
- Touch-friendly interface
- Responsive design
- Bottom navigation for easy access
- Optimized for mobile screens

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date handling**: date-fns
- **Export**: xlsx, jsPDF, html2canvas
- **Notifications**: react-hot-toast
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd glucose-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The build files will be created in the `build` folder.

## Usage

### Adding a Reading
1. Navigate to the "Add Entry" tab
2. Enter your glucose value
3. Set the date and time
4. Select meal type (optional)
5. Add notes, medication, exercise, or stress level (optional)
6. Save the reading

### Viewing Reports
1. Go to the "Reports" tab
2. Select a time period
3. View statistics and charts
4. Export data in your preferred format

### Customizing Settings
1. Access the "Settings" tab
2. Adjust target glucose ranges
3. Change units (mg/dL or mmol/L)
4. Configure reminders
5. Manage your data

## Data Storage

All data is stored locally in your browser's localStorage. This ensures:
- Privacy - your data never leaves your device
- Offline functionality
- No account required
- Fast performance

## Export Options

### CSV Export
- Simple comma-separated values format
- Compatible with Excel, Google Sheets, and other spreadsheet applications
- Includes all entry data

### Excel Export
- Multi-sheet workbook
- Formatted data with headers
- Optional statistics sheet
- Professional appearance

### PDF Export
- Printable report format
- Summary statistics
- Recent readings table
- Clean, professional layout

## Mobile Features

- **PWA Support**: Install as a mobile app
- **Touch Optimized**: Large touch targets and swipe gestures
- **Responsive Design**: Works on all screen sizes
- **Offline Capable**: Works without internet connection
- **Fast Loading**: Optimized for mobile networks

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This application is for educational and personal use. Always consult with healthcare professionals for medical advice regarding glucose management. 