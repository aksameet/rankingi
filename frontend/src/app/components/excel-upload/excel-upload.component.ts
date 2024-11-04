// src/app/excel-upload/excel-upload.component.ts
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
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material.module';
import { Profile, ProfileService } from '../../services/profile.service';

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
      const validExtensions = ['.xlsx', '.xls'];

      if (!validTypes.includes(file.type)) {
        this.setErrorMessage(
          'Please upload a valid Excel file (.xlsx or .xls).'
        );
        return;
      }

      const fileExtension = file.name
        .substring(file.name.lastIndexOf('.'))
        .toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        this.setErrorMessage(
          'Invalid file extension. Please upload a file with .xlsx or .xls extension.'
        );
        return;
      }

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        this.setErrorMessage('File size exceeds the 5MB limit.');
        return;
      }

      this.isLoading = true;
      const reader = new FileReader();

      reader.onload = async (e: any) => {
        try {
          const arrayBuffer = e.target.result;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(arrayBuffer);

          if (workbook.worksheets.length === 0) {
            throw new Error('The Excel file contains no worksheets.');
          }

          const worksheet = workbook.worksheets[0];

          if (worksheet.rowCount === 0) {
            throw new Error('The worksheet is empty.');
          }

          this.jsonData = this.convertSheetToJSON(worksheet);

          if (this.jsonData.length === 0) {
            throw new Error('No valid data found in the Excel file.');
          }
        } catch (error: any) {
          console.error('Error processing Excel file:', error);
          const userFriendlyMessage = this.getUserFriendlyErrorMessage(error);
          this.setErrorMessage(userFriendlyMessage);
        } finally {
          this.isLoading = false;
        }
      };

      reader.onerror = () => {
        console.error('FileReader error:', reader.error);
        this.setErrorMessage('Error reading the file.');
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
          const header = this.getCellStringValue(cell);
          headers[colNumber - 1] = header.toLowerCase();
        });

        const requiredHeaders = [
          'name',
          'address',
          'telephone',
          'email',
          'rank',
          'description',
          'specialization',
          'geolocation',
          'stars',
          'opinions',
          'website',
          'city',
          'company',
          'own_stars',
        ];
        const missingHeaders = requiredHeaders.filter(
          (header) => !headers.includes(header)
        );
        if (missingHeaders.length > 0) {
          throw new Error(
            `Missing required columns: ${missingHeaders.join(', ')}`
          );
        }
      } else {
        const rowData: any = {};
        let isEmptyRow = true;

        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1] || `column${colNumber}`;
          const cellValue = this.getCellStringValue(cell);
          if (cellValue !== '') {
            isEmptyRow = false;
          }
          rowData[header] = cellValue;
        });

        if (!isEmptyRow && rowData['name'] && rowData['name'].trim() !== '') {
          jsonData.push(rowData);
        }
      }
    });

    return jsonData;
  }

  private getCellStringValue(cell: ExcelJS.Cell): string {
    if (!cell || cell.value === null || cell.value === undefined) {
      return '';
    }

    const isObject = (val: unknown): val is object =>
      typeof val === 'object' && val !== null;

    switch (cell.type) {
      case ExcelJS.ValueType.String:
        return typeof cell.value === 'string' ? cell.value.trim() : '';
      case ExcelJS.ValueType.Number:
        return typeof cell.value === 'number'
          ? cell.value.toString().trim()
          : '';
      case ExcelJS.ValueType.Boolean:
        return typeof cell.value === 'boolean'
          ? cell.value
            ? 'TRUE'
            : 'FALSE'
          : '';
      case ExcelJS.ValueType.Date:
        return cell.value instanceof Date ? cell.value.toISOString() : '';
      case ExcelJS.ValueType.Formula:
        if (isObject(cell.value) && 'result' in cell.value) {
          if (typeof cell.value.result === 'string') {
            return cell.value.result.trim();
          } else if (typeof cell.value.result === 'number') {
            return cell.value.result.toString().trim();
          }
        }
        return '';
      case ExcelJS.ValueType.RichText:
        if (
          isObject(cell.value) &&
          'richText' in cell.value &&
          Array.isArray((cell.value as ExcelJS.CellRichTextValue).richText)
        ) {
          return (cell.value as ExcelJS.CellRichTextValue).richText
            .map((rt) => rt.text)
            .join('')
            .trim();
        }
        return '';
      case ExcelJS.ValueType.Hyperlink:
        if (
          isObject(cell.value) &&
          'text' in cell.value &&
          typeof (cell.value as ExcelJS.CellHyperlinkValue).text === 'string'
        ) {
          const hyperlinkValue = cell.value as ExcelJS.CellHyperlinkValue;
          const visibleText = hyperlinkValue.text
            ? hyperlinkValue.text.trim()
            : '';
          const emailLink = hyperlinkValue.hyperlink
            ? hyperlinkValue.hyperlink.trim()
            : '';

          // If it's a mailto link, extract the email address
          if (emailLink.startsWith('mailto:')) {
            return visibleText || emailLink.replace('mailto:', '');
          }

          return visibleText || emailLink;
        }

        // Handle cases where hyperlink and richText are part of the model structure (your example)
        if (isObject(cell.value) && 'hyperlink' in cell.value) {
          const hyperlinkModel = cell.value as any;
          const mailtoLink = hyperlinkModel.hyperlink
            ? hyperlinkModel.hyperlink
            : '';
          const richText =
            hyperlinkModel.text?.richText
              ?.map((rt: any) => rt.text)
              .join('')
              .trim() || '';

          // If it's a mailto link, extract the email address
          if (mailtoLink.startsWith('mailto:')) {
            return richText || mailtoLink.replace('mailto:', '');
          }

          return richText || mailtoLink;
        }

        return '';
      case ExcelJS.ValueType.Merge:
        return typeof cell.value === 'string' ? cell.value.trim() : '';
      case ExcelJS.ValueType.Error:
        if (
          isObject(cell.value) &&
          'error' in cell.value &&
          typeof (cell.value as ExcelJS.CellErrorValue).error === 'string'
        ) {
          return `Error: ${(cell.value as ExcelJS.CellErrorValue).error}`;
        }
        return 'Error';
      default:
        return '';
    }
  }

  private getUserFriendlyErrorMessage(error: any): string {
    if (error instanceof Error) {
      if (error.message.includes('unsupported file format')) {
        return 'The uploaded file format is not supported.';
      } else if (error.message.includes('no worksheets')) {
        return 'The Excel file does not contain any worksheets.';
      } else if (error.message.includes('empty')) {
        return 'The uploaded Excel file is empty.';
      } else if (error.message.includes('Missing required columns')) {
        return error.message;
      } else if (error.message.startsWith('Error:')) {
        return error.message;
      } else {
        return 'An unexpected error occurred while processing the Excel file.';
      }
    }

    return 'An unknown error occurred while processing the Excel file.';
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
      opinions: Number(item.opinions),
      website: item.website,
      city: item.city,
      company: item.company,
      own_stars: item.own_stars,
    }));

    this.profileService
      .createProfiles({ profiles }, this.selectedType)
      .subscribe({
        next: () => {
          this.setSaveMessage('Data saved successfully!');
          this.jsonData = [];
          this.bulkUploadComplete.emit();
        },
        error: (error) => {
          console.error('Error saving data:', error);
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
