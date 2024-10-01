import { Component, OnInit } from '@angular/core';
import { ProfileService, Profile } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  profiles: Profile[] = [];

  // New profile object bound to the form
  newProfile: Profile = {
    id: '',
    name: '',
    email: '',
  };
  selectedImage: string | null = null;

  constructor(private profileService: ProfileService) {}

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
    if (this.newProfile.name && this.newProfile.email) {
      if (this.selectedImage) {
        // Remove the data URL prefix
        const base64Data = this.selectedImage.replace(
          /^data:image\/\w+;base64,/,
          ''
        );
        this.newProfile.image = base64Data;
      }
      this.profileService.createProfile(this.newProfile).subscribe(
        (createdProfile) => {
          this.profiles.push(createdProfile);
          this.newProfile = { id: '', name: '', email: '' };
          this.selectedImage = null;
        },
        (error) => {
          console.error('Error creating profile:', error);
        }
      );
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 0.00025, // Maximum file size in MB
        maxWidthOrHeight: 800, // Max width or height
        useWebWorker: true,
      };
      imageCompression(file, options)
        .then((compressedFile) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedImage = reader.result as string;
          };
          reader.readAsDataURL(compressedFile);
        })
        .catch((error) => {
          console.error('Error compressing image:', error);
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
}
