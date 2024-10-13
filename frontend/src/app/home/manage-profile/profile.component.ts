// src/app/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ProfileService, Profile } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material.module';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { ExcelHelperService } from '../../services/excel-helper.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { ExcelUploadComponent } from '../../components/excel-upload/excel-upload.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ProfileCardComponent,
    ExcelUploadComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  profiles: Profile[] = [];
  selectedType: string = 'profiles';
  selectedCity: string = '';
  saveMessage: string = '';

  constructor(
    private profileService: ProfileService,
    private excelHelperService: ExcelHelperService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.$loading.next(true);
    this.profileService
      .getProfiles(this.selectedType, this.selectedCity)
      .subscribe(
        (data) => {
          this.$loading.next(false);
          this.profiles = data;
          this.sortProfiles();
        },
        (error) => {
          this.$loading.next(false);
          this.profiles = [];
          console.error('Error loading profiles:', error);
        }
      );
  }

  sortProfiles() {
    this.profiles.sort((a, b) => {
      const rankA = a.rank;
      const rankB = b.rank;

      const isRankANull = rankA == null || rankA === 0;
      const isRankBNull = rankB == null || rankB === 0;

      if (isRankANull && isRankBNull) {
        return 0;
      }
      if (isRankANull) {
        return 1;
      }
      if (isRankBNull) {
        return -1;
      }
      return rankA - rankB;
    });
  }

  onTypeChanged(selectedType: string) {
    this.profiles = [];
    this.selectedType = selectedType;
    this.loadProfiles();
  }

  onCityChanged(selectedCity: string) {
    this.selectedCity = selectedCity;
    this.loadProfiles();
  }

  openAddProfileDialog() {
    const dialogRef = this.dialog.open(ProfileFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data) {
        const profileData: Profile = {
          id: '',
          ...result.data,
          city: this.selectedCity,
        };
        this.addProfile(profileData);
      }
    });
  }

  addProfile(profileData: Profile) {
    this.$loading.next(true);
    this.profileService.createProfile(profileData, this.selectedType).subscribe(
      (createdProfile) => {
        this.$loading.next(false);
        this.profiles.push(createdProfile);
        this.sortProfiles();
      },
      (error) => {
        this.$loading.next(false);
        console.error('Error creating profile:', error);
      }
    );
  }

  onEditProfile(profile: Profile) {
    const dialogRef = this.dialog.open(ProfileFormComponent, {
      data: {
        profile: profile,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data) {
        const profileData: Profile = {
          id: result.editingId || '',
          ...result.data,
        };
        this.updateProfile(profileData);
      }
    });
  }

  updateProfile(profileData: Profile) {
    this.$loading.next(true);
    this.profileService.updateProfile(profileData, this.selectedType).subscribe(
      (updatedProfile) => {
        this.$loading.next(false);
        const index = this.profiles.findIndex(
          (p) => p.id === updatedProfile.id
        );
        if (index !== -1) {
          this.profiles[index] = updatedProfile;
        }
        this.sortProfiles();
      },
      (error) => {
        this.$loading.next(false);
        console.error('Error updating profile:', error);
      }
    );
  }

  onDeleteProfile(id: string) {
    this.deleteProfile(id);
  }

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

  onBulkUploadComplete(): void {
    this.loadProfiles();
  }

  deleteAllProfiles(): void {
    if (confirm('Are you sure you want to delete all profiles?')) {
      this.$loading.next(true);
      this.profileService
        .deleteAll(this.selectedType, this.selectedCity)
        .subscribe({
          next: () => {
            this.$loading.next(false);
            this.profiles = [];
            this.saveMessage = 'All profiles have been deleted successfully.';
          },
          error: (error: any) => {
            this.$loading.next(false);
            console.error('Error deleting all profiles:', error);
            this.saveMessage = 'Error deleting all profiles.';
          },
        });
    }
  }

  downloadProfilesAsExcel() {
    if (this.profiles.length === 0) {
      this.saveMessage = 'No profiles available to download.';
      return;
    }

    this.excelHelperService.downloadProfilesAsExcel(
      this.profiles,
      `${this.selectedType}_${this.selectedCity}`,
      'createdDate'
    );

    this.saveMessage = 'Profiles have been downloaded successfully.';
  }

  logout() {
    this.authService.logout();
  }
}
