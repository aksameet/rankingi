// src/app/services/excel-helper.service.ts

import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Profile } from './profile.service'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root',
})
export class ExcelHelperService {
  constructor() {}

  /**
   * Downloads profiles data as an Excel file.
   * @param profiles Array of Profile objects to include in the Excel file.
   * @param selectedType The type/category of profiles, used in the filename.
   * @param dateField Optional. The field name in Profile that contains the date to format.
   */
  downloadProfilesAsExcel(
    profiles: Profile[],
    selectedType: string,
    dateField?: string
  ): void {
    if (profiles.length === 0) {
      console.warn('No profiles available to download.');
      return;
    }

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Profiles');

    // Define worksheet columns
    worksheet.columns = [
      { header: 'name', key: 'name', width: 18 },
      { header: 'address', key: 'address', width: 22 },
      { header: 'telephone', key: 'telephone', width: 14 },
      { header: 'email', key: 'email', width: 22 },
      { header: 'rank', key: 'rank', width: 8 },
      { header: 'description', key: 'description', width: 40 },
      { header: 'specialization', key: 'specialization', width: 20 },
      { header: 'geolocation', key: 'geolocation', width: 20 },
      { header: 'stars', key: 'stars', width: 6 },
      { header: 'website', key: 'website', width: 20 },
      // Add more columns if needed
    ];

    // Add rows to the worksheet
    profiles.forEach((profile) => {
      worksheet.addRow({
        name: profile.name,
        address: profile.address || '',
        telephone: profile.telephone || '',
        email: profile.email || '',
        rank: profile.rank !== undefined ? Number(profile.rank) : '',
        description: profile.description || '',
        specialization: profile.specialization || '',
        geolocation: profile.geolocation || '',
        stars: profile.stars !== undefined ? Number(profile.stars) : '',
        website: profile.website || '',
        // Add more fields if needed
      });
    });

    // Styling (Optional)
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFADD8E6' }, // Light Blue
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Optionally format date fields if provided
    if (dateField) {
      const dateCol = worksheet.columns.findIndex(
        (col) => col.key === dateField
      );
      if (dateCol !== -1) {
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header
          const cell = row.getCell(dateCol + 1);
          if (cell.value instanceof Date) {
            cell.numFmt = 'dd.mm.yyyy';
          }
        });
      }
    }

    // Generate buffer and trigger download
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const formattedDate = this.formatDate(new Date());
        saveAs(blob, `${selectedType}_${formattedDate}.xlsx`);
      })
      .catch((error) => {
        console.error('Error generating Excel file:', error);
      });
  }

  /**
   * Formats a Date object as DD.MM.YYYY
   * @param date Date to format
   * @returns Formatted date string
   */
  private formatDate(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const yy = (date.getFullYear() % 100).toString().padStart(2, '0'); // Last two digits of the year
    const h = date.getHours().toString().padStart(2, '0'); // Hours in 24-hour format
    const min = date.getMinutes().toString().padStart(2, '0'); // Hours in 24-hour format

    return `${d}.${m}.${yy}-${h}${min}`;
  }
}
