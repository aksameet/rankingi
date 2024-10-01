import { Component, OnInit } from '@angular/core';
import { ProfileService, Profile } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    name: '',
    email: '',
  };

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
      this.profileService.createProfile(this.newProfile).subscribe(
        (createdProfile) => {
          // Add the new profile to the list
          this.profiles.push(createdProfile);
          // Reset the form
          this.newProfile = {
            name: '',
            email: '',
          };
        },
        (error) => {
          console.error('Error creating profile:', error);
        }
      );
    }
  }
}
