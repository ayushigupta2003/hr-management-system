import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BRAND = [25, 87, 216]; // #1957d8

function addHeader(doc, title, subtitle) {
  // Header bar
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, 210, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('HR Management System', 14, 11);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 196, 11, { align: 'right' });

  // Title
  doc.setTextColor(23, 32, 51);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 30);
  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 14, 37);
  }
}

/**
 * Export daily attendance records to PDF
 */
export function exportAttendanceToPdf(rows, date) {
  const doc = new jsPDF({ orientation: 'landscape' });

  addHeader(doc, 'Attendance Report', `Date: ${date}`);

  const tableData = rows.map((row) => [
    row.employee?.full_name ?? '—',
    row.employee?.employee_code ?? '—',
    row.employee?.department?.name ?? '—',
    row.attendance_date,
    row.check_in  ?? '—',
    row.check_out ?? '—',
    (row.status ?? '').charAt(0).toUpperCase() + (row.status ?? '').slice(1),
    row.remarks ?? '',
  ]);

  autoTable(doc, {
    startY: 42,
    head: [['Employee', 'Code', 'Department', 'Date', 'Check In', 'Check Out', 'Status', 'Remarks']],
    body: tableData,
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 22 },
      2: { cellWidth: 30 },
      3: { cellWidth: 24 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${data.pageNumber}`, 148, 205, { align: 'center' });
    },
  });

  doc.save(`attendance-${date}.pdf`);
}

/**
 * Export monthly attendance report to PDF
 */
export function exportMonthlyReportToPdf(report, year, month) {
  const doc = new jsPDF();
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  addHeader(doc, 'Monthly Attendance Report', `${monthName} ${year}`);

  const tableData = report.map((row) => [
    row.employee?.full_name ?? '—',
    row.employee?.employee_code ?? '—',
    row.employee?.department ?? '—',
    row.summary?.present  ?? 0,
    row.summary?.late     ?? 0,
    row.summary?.absent   ?? 0,
    row.summary?.leave    ?? 0,
    (row.summary?.present ?? 0) + (row.summary?.late ?? 0),
  ]);

  autoTable(doc, {
    startY: 42,
    head: [['Employee', 'Code', 'Department', 'Present', 'Late', 'Absent', 'Leave', 'Working Days']],
    body: tableData,
    headStyles: { fillColor: BRAND, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 14, halign: 'center' },
      5: { cellWidth: 16, halign: 'center' },
      6: { cellWidth: 14, halign: 'center' },
      7: { cellWidth: 24, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${data.pageNumber}`, 105, 290, { align: 'center' });
    },
  });

  doc.save(`attendance-report-${monthName}-${year}.pdf`);
}
