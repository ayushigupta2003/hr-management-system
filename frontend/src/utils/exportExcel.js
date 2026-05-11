import * as XLSX from 'xlsx';

/**
 * Export attendance records to Excel (.xlsx)
 * @param {Array}  rows      Attendance records from API
 * @param {string} filename  Output filename (without extension)
 */
export function exportAttendanceToExcel(rows, filename = 'attendance') {
  const data = rows.map((row) => ({
    'Employee Name': row.employee?.full_name ?? '—',
    'Employee Code': row.employee?.employee_code ?? '—',
    'Department':    row.employee?.department?.name ?? '—',
    'Date':          row.attendance_date,
    'Check In':      row.check_in  ?? '—',
    'Check Out':     row.check_out ?? '—',
    'Status':        row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : '—',
    'Remarks':       row.remarks ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Column widths
  ws['!cols'] = [
    { wch: 22 }, // Employee Name
    { wch: 14 }, // Employee Code
    { wch: 18 }, // Department
    { wch: 12 }, // Date
    { wch: 10 }, // Check In
    { wch: 10 }, // Check Out
    { wch: 10 }, // Status
    { wch: 24 }, // Remarks
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Export monthly report to Excel
 * @param {Array}  report   Monthly report data from API
 * @param {number} year
 * @param {number} month
 */
export function exportMonthlyReportToExcel(report, year, month) {
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  const data = report.map((row) => ({
    'Employee Name':  row.employee?.full_name ?? '—',
    'Employee Code':  row.employee?.employee_code ?? '—',
    'Department':     row.employee?.department ?? '—',
    'Present':        row.summary?.present  ?? 0,
    'Late':           row.summary?.late     ?? 0,
    'Absent':         row.summary?.absent   ?? 0,
    'Leave':          row.summary?.leave    ?? 0,
    'Total Working':  (row.summary?.present ?? 0) + (row.summary?.late ?? 0),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 22 }, { wch: 14 }, { wch: 18 },
    { wch: 9 }, { wch: 7 }, { wch: 9 }, { wch: 8 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${monthName} ${year}`);
  XLSX.writeFile(wb, `attendance-report-${monthName}-${year}.xlsx`);
}
