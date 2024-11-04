import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
          this.profiles = data;
          this.sortProfiles();
          this.setPaginatedProfiles();
          console.log('Load Data =>', data);
        },
        error: (error) => {
          this.$loading.next(false);
          this.profiles = [];
          this.paginatedProfiles = [];
        },
      });
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
}
