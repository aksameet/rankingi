import { Component, OnInit } from '@angular/core';
import { ProfileService, Profile } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import imageCompression from 'browser-image-compression';
import { MaterialModule } from '../../shared/modules/material.module';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { BehaviorSubject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ProfileCardComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  profiles: Profile[] = [];
  profileForm: FormGroup;
  selectedImage: string | null = null;
  editingProfileId: string | null = null;

  constructor(private profileService: ProfileService) {
    // Initialize the form group with controls and validators
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required]),
      image: new FormControl(null),
    });
  }

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.profileService.getProfiles().subscribe((data) => {
      this.profiles = data;
    });
  }

  addOrUpdateProfile() {
    if (this.profileForm.valid) {
      const profileData: Profile = {
        id: this.editingProfileId || '',
        name: this.profileForm.value.name,
        email: this.profileForm.value.email,
      };

      if (this.selectedImage) {
        // Remove the data URL prefix
        const base64Data = this.selectedImage.replace(
          /^data:image\/\w+;base64,/,
          ''
        );
        profileData.image = base64Data;
      }

      if (this.editingProfileId) {
        // Update existing profile
        this.profileService.updateProfile(profileData).subscribe(
          (updatedProfile) => {
            // Update the profile in the list
            const index = this.profiles.findIndex(
              (p) => p.id === updatedProfile.id
            );
            if (index !== -1) {
              this.profiles[index] = updatedProfile;
            }
            this.resetForm();
          },
          (error) => {
            console.error('Error updating profile:', error);
          }
        );
      } else {
        // Add new profile
        this.profileService.createProfile(profileData).subscribe(
          (createdProfile) => {
            this.profiles.push(createdProfile);
            this.resetForm();
          },
          (error) => {
            console.error('Error creating profile:', error);
          }
        );
      }
    } else {
      // Mark all controls as touched to show validation errors
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
    }
  }

  onEditProfile(profile: Profile) {
    this.editingProfileId = profile.id;

    // Populate the form with existing profile data
    this.profileForm.patchValue({
      name: profile.name,
      email: profile.email,
    });

    // If there's an image, set it
    if (profile.image) {
      this.selectedImage = 'data:image/jpeg;base64,' + profile.image;
      this.profileForm.get('image')?.setValue(this.selectedImage);
    }
  }

  resetForm() {
    this.profileForm.reset();
    this.selectedImage = null;
    this.editingProfileId = null;
  }

  clearImage() {
    this.selectedImage = null;
    this.profileForm.get('image')?.setValue('');
  }

  deleteProfile(id: string) {
    this.profileService.deleteProfile(id).subscribe(
      () => {
        // Remove the profile from the list
        this.profiles = this.profiles.filter((profile) => profile?.id !== id);
      },
      (error) => {
        console.error('Error deleting profile:', error);
      }
    );
  }

  onDeleteProfile(id: string) {
    if (this.editingProfileId === id) {
      this.resetForm();
    }
    this.deleteProfile(id);
  }
}
