// src/app/services/excel-helper.service.ts
import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Profile } from './profile.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelHelperService {
  constructor() {}

  downloadProfilesAsExcel(
    profiles: Profile[],
    selectedType: string,
    dateField?: string
  ): void {
    if (profiles.length === 0) {
      console.warn('No profiles available to download.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Profiles');

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
      { header: 'opinions', key: 'opinions', width: 8 },
      { header: 'website', key: 'website', width: 20 },
      { header: 'city', key: 'city', width: 15 },
      { header: 'company', key: 'company', width: 25 },
      { header: 'own_stars', key: 'company', width: 10 },
    ];

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
        opinions:
          profile.opinions !== undefined ? Number(profile.opinions) : '',
        website: profile.website || '',
        city: profile.city || '',
        company: profile.company || '',
        own_stars: profile.own_stars || '',
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFADD8E6' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

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

  private formatDate(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const yy = (date.getFullYear() % 100).toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');

    return `${d}.${m}.${yy}-${h}${min}`;
  }
}
