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

  // Load existing profiles
  loadProfiles() {
    this.profileService.getProfiles().subscribe((data) => {
      this.profiles = data;
    });
  }

  // Method to add a new profile
  addProfile() {
    if (this.profileForm.valid) {
      const newProfile: Profile = {
        id: '',
        name: this.profileForm.value.name,
        email: this.profileForm.value.email,
      };

      if (this.selectedImage) {
        // Remove the data URL prefix
        const base64Data = this.selectedImage.replace(
          /^data:image\/\w+;base64,/,
          ''
        );
        newProfile.image = base64Data;
      }

      this.profileService.createProfile(newProfile).subscribe(
        (createdProfile) => {
          this.profiles.push(createdProfile);
          this.profileForm.reset();
          this.selectedImage = null;
        },
        (error) => {
          console.error('Error creating profile:', error);
        }
      );
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
    this.deleteProfile(id);
  }
}
