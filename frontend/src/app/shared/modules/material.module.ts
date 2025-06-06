import { NgModule } from '@angular/core';

// Angular Material Components
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
// Add more imports as needed

const materialModules = [
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatDialogModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatPaginatorModule,
  MatCheckboxModule,
  MatDialogModule,
  // Add more modules here
];

@NgModule({
  exports: materialModules,
})
export class MaterialModule {}
