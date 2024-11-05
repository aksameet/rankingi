import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Profile, ProfileService } from '../services/profile.service';
import { BehaviorSubject } from 'rxjs';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/modules/material.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProfileMainComponent,
    FormsModule,
    MaterialModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  profiles: Profile[] = [];
  paginatedProfiles: Profile[] = [];
  selectedType: string = 'profiles';
  selectedCity: string = '';
  sortOrder: string = 'desc';
  isLogIn$!: any;
  pageSize = 25;
  currentPage = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.isLogIn$ = this.authService.isLoggedIn$;
    this.loadProfiles();
  }

  navigateToProfiles() {
    this.router.navigate(['/profiles']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  loadProfiles() {
    this.$loading.next(true);
    this.profileService
      .getProfiles(this.selectedType, this.selectedCity)
      .subscribe({
        next: (data) => {
          this.$loading.next(false);
          this.profiles = data.map((profile) => ({
            ...profile,
            score: this.computeScore(profile.opinions ?? 0, profile.stars ?? 0),
          }));
          this.sortProfiles();
          this.setPaginatedProfiles();
          console.log('Load Data =>', this.profiles);
        },
        error: (error) => {
          this.$loading.next(false);
          this.profiles = [];
          this.paginatedProfiles = [];
        },
      });
  }

  computeScore(opinions: number, stars: number): number {
    const starWeight = 10;
    const opinionWeight = 1;
    return stars * starWeight + opinions * opinionWeight;
  }

  sortProfiles() {
    if (this.sortOrder === 'desc') {
      this.profiles.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    } else {
      this.profiles.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    }
  }

  setPaginatedProfiles() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProfiles = this.profiles.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedProfiles();
  }

  onTypeChanged(selectedType: string) {
    this.profiles = [];
    this.paginatedProfiles = [];
    this.selectedType = selectedType;
    this.currentPage = 0;
    this.loadProfiles();
  }

  onCityChanged(selectedCity: string) {
    this.selectedCity = selectedCity;
    this.currentPage = 0;
    this.loadProfiles();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.sortProfiles();
    this.setPaginatedProfiles();
  }
}
