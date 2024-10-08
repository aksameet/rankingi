// excel-upload.component.ts
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { ProfileService, Profile } from '../services/profile.service';

@Component({
  standalone: true,
  selector: 'app-excel-upload',
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.scss'],
  imports: [CommonModule],
})
export class ExcelUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  jsonData: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  saveMessage: string = '';

  constructor(private profileService: ProfileService) {}

  // Programmatically trigger the file input click
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  // Handles file input change event
  onFileChange(event: any): void {
    const file: File = event.target.files[0];

    this.errorMessage = '';
    this.jsonData = [];
    this.saveMessage = '';

    if (file) {
      // Validate file type
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

  // Converts worksheet data to JSON and filters out objects missing the 'name' key or with empty 'name'
  convertSheetToJSON(worksheet: ExcelJS.Worksheet): any[] {
    const jsonData: any[] = [];
    const headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // First row - headers
        row.eachCell((cell, colNumber) => {
          headers[colNumber - 1] = cell.text.trim();
        });
      } else {
        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1] || `Column ${colNumber}`;
          rowData[header] = cell.text.trim();
        });

        // Check if 'name' key exists and is not empty
        if (rowData['name'] && rowData['name'].trim() !== '') {
          jsonData.push(rowData);
        } else {
          console.warn(`Row ${rowNumber} skipped: Missing 'name' value.`);
        }
      }
    });

    return jsonData;
  }

  // Save data to backend
  saveToBackend(): void {
    if (this.jsonData.length === 0) {
      this.saveMessage = 'No data to save.';
      return;
    }

    this.isSaving = true;
    this.saveMessage = '';

    const profiles: Profile[] = this.jsonData.map((item) => ({
      id: item.id || '',
      name: item.name,
      email: item.email,
      rank: Number(item.rank),
      image: item.image,
      description: item.description,
    }));

    this.profileService.createProfiles(profiles, 'profiles').subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
        this.saveMessage = 'Data saved successfully!';
      },
      error: (error) => {
        console.error('Error saving data:', error);
        this.saveMessage = 'Error saving data.';
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }
}
