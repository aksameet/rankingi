import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as ExcelJS from 'exceljs';
import { ProfileService, Profile } from '../services/profile.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/modules/material.module';

@Component({
  standalone: true,
  selector: 'app-excel-upload',
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class ExcelUploadComponent implements OnChanges {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() selectedType: string = 'profiles';
  @Output() bulkUploadComplete = new EventEmitter<void>();

  jsonData: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  saveMessage: string = '';
  isErrorMessage: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedType'] && !changes['selectedType'].firstChange) {
      this.clearData();
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    this.clearMessages();

    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!validTypes.includes(file.type)) {
        this.setErrorMessage(
          'Please upload a valid Excel file (.xlsx or .xls)'
        );
        return;
      }

      this.isLoading = true;
      const reader = new FileReader();

      reader.onload = async (e: any) => {
        try {
          const arrayBuffer = e.target.result;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(arrayBuffer);
          const worksheet = workbook.worksheets[0];
          this.jsonData = this.convertSheetToJSON(worksheet);
        } catch {
          this.setErrorMessage('Error processing Excel file.');
        } finally {
          this.isLoading = false;
        }
      };

      reader.onerror = () => {
        this.setErrorMessage('Error reading file.');
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
        }
      }
    });

    return jsonData;
  }

  saveToBackend(): void {
    if (this.jsonData.length === 0) {
      this.setErrorMessage('No data to save.');
      return;
    }

    this.isSaving = true;
    this.clearMessages();

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

    this.profileService
      .createProfiles({ profiles }, this.selectedType)
      .subscribe({
        next: () => {
          this.setSaveMessage('Data saved successfully!');
          this.jsonData = [];
          this.bulkUploadComplete.emit();
        },
        error: () => {
          this.setErrorMessage('Error saving data.');
          this.isSaving = false;
          this.clearData();
        },
        complete: () => {
          this.isSaving = false;
        },
      });
  }

  clearData(): void {
    this.jsonData = [];
    this.clearMessages();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.saveMessage = '';
    this.isErrorMessage = false;
  }

  private setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.isErrorMessage = true;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private setSaveMessage(message: string): void {
    this.saveMessage = message;
    this.isErrorMessage = false;
    setTimeout(() => {
      this.saveMessage = '';
    }, 5000);
  }
}
