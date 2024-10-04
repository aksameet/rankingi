import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from '../../../shared/modules/material.module';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input() profileForm!: FormGroup;
  @Input() editingProfileId!: string | null;
  @Input() selectedImage!: string | null;
  @Input() $loading!: BehaviorSubject<boolean>;

  @Output() submitProfile = new EventEmitter<void>();
  @Output() resetProfileForm = new EventEmitter<void>();
  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageCleared = new EventEmitter<void>();

  ngOnInit() {}

  onSubmit() {
    this.submitProfile.emit();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageSelected.emit(file);
    } else {
      console.log('Error handling file upload');
    }
  }

  clearImage() {
    this.imageCleared.emit();
  }

  resetForm() {
    this.resetProfileForm.emit();
  }
}
