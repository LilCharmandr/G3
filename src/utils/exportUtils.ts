import { GlucoseEntry, ExportOptions, GlucoseStats } from '../types';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToCSV(entries: GlucoseEntry[], options: ExportOptions): Promise<string> {
  const headers = ['Date', 'Time', 'Glucose (mg/dL)', 'Meal Type', 'Notes', 'Medication', 'Exercise', 'Stress'];
  const rows = entries.map(entry => [
    format(new Date(entry.timestamp), 'yyyy-MM-dd'),
    format(new Date(entry.timestamp), 'HH:mm'),
    entry.value,
    entry.mealType ? formatMealType(entry.mealType) : '',
    entry.notes || '',
    entry.medication || '',
    entry.exercise ? 'Yes' : 'No',
    entry.stress || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
}

export async function exportToExcel(entries: GlucoseEntry[], options: ExportOptions): Promise<Blob> {
  const data = entries.map(entry => ({
    Date: format(new Date(entry.timestamp), 'yyyy-MM-dd'),
    Time: format(new Date(entry.timestamp), 'HH:mm'),
    'Glucose (mg/dL)': entry.value,
    'Meal Type': entry.mealType ? formatMealType(entry.mealType) : '',
    Notes: entry.notes || '',
    Medication: entry.medication || '',
    Exercise: entry.exercise ? 'Yes' : 'No',
    Stress: entry.stress || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Glucose Data');

  // Add stats sheet if requested
  if (options.includeStats) {
    const statsData = calculateStatsForExport(entries);
    const statsWs = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWs, 'Statistics');
  }

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function exportToPDF(entries: GlucoseEntry[], options: ExportOptions): Promise<Blob> {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Glucose Tracker Report', 20, 20);
  
  // Date range
  doc.setFontSize(12);
  doc.text(`Period: ${format(options.dateRange.startDate, 'MMM dd, yyyy')} - ${format(options.dateRange.endDate, 'MMM dd, yyyy')}`, 20, 35);
  
  // Summary stats
  const stats = calculateStatsForExport(entries);
  doc.setFontSize(14);
  doc.text('Summary Statistics:', 20, 50);
  
  let yPos = 60;
  stats.forEach(stat => {
    doc.setFontSize(10);
    doc.text(`${stat.Metric}: ${stat.Value}`, 20, yPos);
    yPos += 8;
  });
  
  // Data table
  yPos += 10;
  doc.setFontSize(12);
  doc.text('Glucose Readings:', 20, yPos);
  
  const headers = ['Date', 'Time', 'Glucose', 'Meal Type', 'Notes'];
  const data = entries.slice(0, 20).map(entry => [
    format(new Date(entry.timestamp), 'MM/dd'),
    format(new Date(entry.timestamp), 'HH:mm'),
    entry.value.toString(),
    entry.mealType ? formatMealType(entry.mealType) : '',
    entry.notes ? entry.notes.substring(0, 20) + '...' : ''
  ]);
  
  // Simple table layout
  const startX = 20;
  const colWidths = [20, 20, 25, 40, 60];
  let currentX = startX;
  
  // Headers
  yPos += 10;
  headers.forEach((header, index) => {
    doc.setFontSize(8);
    doc.text(header, currentX, yPos);
    currentX += colWidths[index];
  });
  
  // Data rows
  data.forEach(row => {
    yPos += 6;
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    
    currentX = startX;
    row.forEach((cell, index) => {
      doc.setFontSize(8);
      doc.text(cell, currentX, yPos);
      currentX += colWidths[index];
    });
  });
  
  return doc.output('blob');
}

function calculateStatsForExport(entries: GlucoseEntry[]) {
  if (entries.length === 0) return [];
  
  const values = entries.map(entry => entry.value);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return [
    { Metric: 'Total Readings', Value: entries.length },
    { Metric: 'Average Glucose', Value: `${Math.round(average)} mg/dL` },
    { Metric: 'Lowest Reading', Value: `${min} mg/dL` },
    { Metric: 'Highest Reading', Value: `${max} mg/dL` },
    { Metric: 'Date Range', Value: `${format(new Date(entries[0].timestamp), 'MMM dd')} - ${format(new Date(entries[entries.length - 1].timestamp), 'MMM dd')}` }
  ];
}

function formatMealType(mealType: string): string {
  return mealType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 