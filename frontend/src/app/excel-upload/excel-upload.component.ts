// excel-upload.component.ts
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { ProfileService, Profile } from '../services/profile.service';
import { Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '../shared/modules/material.module';

@Component({
  standalone: true,
  selector: 'app-excel-upload',
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class ExcelUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() bulkUploadComplete = new EventEmitter<void>();

  jsonData: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  saveMessage: string = '';

  constructor(private profileService: ProfileService) {}

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];

    this.errorMessage = '';
    this.jsonData = [];
    this.saveMessage = '';

    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Please upload a valid Excel file (.xlsx or .xls)';
        console.error(this.errorMessage);
        return;
      }

      this.isLoading = true;
      const reader: FileReader = new FileReader();

      reader.onload = async (e: any) => {
        try {
          const arrayBuffer = e.target.result;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(arrayBuffer);
          const worksheet = workbook.worksheets[0];

          const jsonData = this.convertSheetToJSON(worksheet);
          this.jsonData = jsonData;
          console.log('Excel Data as JSON:', jsonData);
        } catch (error) {
          this.errorMessage = 'Error processing Excel file.';
          console.error('Error processing Excel file:', error);
        } finally {
          this.isLoading = false;
        }
      };

      reader.onerror = (error) => {
        this.errorMessage = 'Error reading file.';
        console.error('FileReader error:', error);
        this.isLoading = false;
      };

      reader.readAsArrayBuffer(file);
    }
  }

  convertSheetToJSON(worksheet: ExcelJS.Worksheet): any[] {
    const jsonData: any[] = [];
    const headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          headers[colNumber - 1] = cell.text.trim().toLowerCase();
        });
      } else {
        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1] || `column${colNumber}`;
          rowData[header] = cell.text.trim();
        });

        if (rowData['name'] && rowData['name'].trim() !== '') {
          jsonData.push(rowData);
        } else {
          console.warn(`Row ${rowNumber} skipped: Missing 'name' value.`);
        }
      }
    });

    return jsonData;
  }

  saveToBackend(): void {
    if (this.jsonData.length === 0) {
      this.saveMessage = 'No data to save.';
      return;
    }

    this.isSaving = true;
    this.saveMessage = '';
    this.errorMessage = '';

    const profiles: Profile[] = this.jsonData.map((item) => ({
      name: item.name,
      address: item.address,
      telephone: item.telephone,
      email: item.email,
      rank: Number(item.rank),
      description: item.description,
      specialization: item.specialization,
      geolocation: item.geolocation,
      stars: Number(item.stars),
      website: item.website,
    }));

    const payload = { profiles: profiles };

    this.profileService.createProfiles(payload, 'profiles').subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
        this.saveMessage = 'Data saved successfully!';
        this.jsonData = [];
        this.bulkUploadComplete.emit();
        setTimeout(() => {
          this.saveMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving data:', error);
        this.saveMessage = 'Error saving data.';
        setTimeout(() => {
          this.saveMessage = '';
        }, 3000);
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }
}
