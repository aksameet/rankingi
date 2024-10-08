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
import { ProfileFormComponent } from './profile-form/profile-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ProfileCardComponent,
    ProfileFormComponent,
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
  selectedType: string = 'profiles'; // Default type

  constructor(private profileService: ProfileService) {
    // Initialize the form group with controls and validators
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required]),
      rank: new FormControl(0),
      image: new FormControl(null),
      description: new FormControl(''),
    });
  }

  ngOnInit() {
    this.loadProfiles(); // Load profiles initially with default type
  }

  // Load profiles based on the selected type
  loadProfiles() {
    this.$loading.next(true);
    this.profileService.getProfiles(this.selectedType).subscribe(
      (data) => {
        this.$loading.next(false);
        this.profiles = data;
        this.sortProfiles();
      },
      (error) => {
        this.$loading.next(false);
        console.error('Error loading profiles:', error);
      }
    );
  }

  // Handle sorting logic
  sortProfiles() {
    this.profiles.sort((a, b) => {
      const rankA = a.rank;
      const rankB = b.rank;

      const isRankANull = rankA == null || rankA === 0;
      const isRankBNull = rankB == null || rankB === 0;

      if (isRankANull && isRankBNull) {
        return 0; // Both ranks are null, undefined, or 0
      }
      if (isRankANull) {
        return 1; // 'a' has no rank or rank 0, place it after 'b'
      }
      if (isRankBNull) {
        return -1; // 'b' has no rank or rank 0, place 'a' before 'b'
      }
      return rankA - rankB; // Both ranks are valid numbers, sort normally
    });
  }

  // Handle profile addition or update
  addOrUpdateProfile() {
    if (this.profileForm.valid) {
      const profileData: Profile = {
        id: this.editingProfileId || '',
        name: this.profileForm.value.name,
        email: this.profileForm.value.email,
        rank: this.profileForm.value.rank,
        image: this.profileForm.value.image,
        description: this.profileForm.value.description,
      };

      if (this.selectedImage) {
        // Remove the data URL prefix
        const base64Data = this.selectedImage.replace(
          /^data:image\/\w+;base64,/,
          ''
        );
        profileData.image = base64Data;
      }

      this.$loading.next(true);

      if (this.editingProfileId) {
        // Update existing profile
        this.profileService
          .updateProfile(profileData, this.selectedType)
          .subscribe(
            (updatedProfile) => {
              this.$loading.next(false);
              // Update the profile in the list
              const index = this.profiles.findIndex(
                (p) => p.id === updatedProfile.id
              );
              if (index !== -1) {
                this.profiles[index] = updatedProfile;
              }
              this.sortProfiles();
              this.resetForm();
            },
            (error) => {
              this.$loading.next(false);
              console.error('Error updating profile:', error);
            }
          );
      } else {
        // Add new profile
        this.profileService
          .createProfile(profileData, this.selectedType)
          .subscribe(
            (createdProfile) => {
              this.$loading.next(false);
              this.profiles.push(createdProfile);
              this.sortProfiles();
              this.resetForm();
            },
            (error) => {
              this.$loading.next(false);
              console.error('Error creating profile:', error);
            }
          );
      }
    } else {
      // Mark all controls as touched to show validation errors
      this.profileForm.markAllAsTouched();
    }
  }

  // Handle file selection and compression
  onFileSelected(file: File) {
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

  // Edit profile and populate form with existing data
  onEditProfile(profile: Profile) {
    this.editingProfileId = profile.id;
    this.profileForm.patchValue({
      name: profile.name,
      email: profile.email,
      rank: profile.rank,
      description: profile.description,
    });

    if (profile.image) {
      this.selectedImage = 'data:image/jpeg;base64,' + profile.image;
      this.profileForm.get('image')?.setValue(this.selectedImage);
    }
  }

  // Reset form after profile submission or cancellation
  resetForm() {
    this.profileForm.reset();
    this.selectedImage = null;
    this.editingProfileId = null;
  }

  // Clear selected image
  clearImage() {
    this.selectedImage = null;
    this.profileForm.get('image')?.setValue(null);
  }

  // Delete profile
  deleteProfile(id: string) {
    this.$loading.next(true);
    this.profileService.deleteProfile(id, this.selectedType).subscribe(
      () => {
        this.$loading.next(false);
        this.profiles = this.profiles.filter((profile) => profile?.id !== id);
        this.sortProfiles();
      },
      (error) => {
        this.$loading.next(false);
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

  // Triggered when profile type changes in the dropdown
  onTypeChanged(event: string) {
    this.profiles = []; // Clear the current list of profiles
    this.selectedType = event;
    this.loadProfiles(); // Re-fetch profiles based on selected type
  }
}
