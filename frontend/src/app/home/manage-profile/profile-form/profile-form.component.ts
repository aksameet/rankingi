// src/app/profile/profile-form/profile-form.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from '../../../shared/modules/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup;
  selectedImage: string | null = null;
  editingProfileId: string | null = null;
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfileFormComponent>
  ) {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl(''),
      rank: new FormControl(0),
      city: new FormControl('', Validators.required),
      image: new FormControl(null),
    });
    if (data && data.profile) {
      this.editingProfileId = data.profile.id || null;
      this.profileForm.patchValue({
        name: data.profile.name,
        email: data.profile.email,
        rank: data.profile.rank,
        city: data.profile.city,
        image: data.profile.image,
      });
      if (data.profile.image) {
        this.selectedImage = 'data:image/jpeg;base64,' + data.profile.image;
      }
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.profileForm.valid) {
      const profileData = { ...this.profileForm.value };
      if (this.selectedImage) {
        const base64Data = this.selectedImage.replace(
          /^data:image\/\w+;base64,/,
          ''
        );
        profileData.image = base64Data;
      }
      this.dialogRef.close({
        data: profileData,
        editingId: this.editingProfileId,
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.0025,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      this.$loading.next(true);
      imageCompression(file, options)
        .then((compressedFile) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedImage = reader.result as string;
            this.profileForm.get('image')?.setValue(this.selectedImage);
            this.$loading.next(false);
          };
          reader.readAsDataURL(compressedFile);
        })
        .catch((error) => {
          console.error('Error compressing image:', error);
          this.$loading.next(false);
        });
    } else {
      console.log('Error handling file upload');
    }
  }

  clearImage() {
    this.selectedImage = null;
    this.profileForm.get('image')?.setValue(null);
  }

  resetForm() {
    this.dialogRef.close();
  }
}
