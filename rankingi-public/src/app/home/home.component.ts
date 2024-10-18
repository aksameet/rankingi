import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { MaterialModule } from '../shared/modules/material.module';
import { Profile, ProfileService } from '../services/profiles.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, ProfileCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  profiles: Profile[] = [];
  selectedType: string = 'profiles'; // Default type

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.$loading.next(true);
    this.profileService.getProfiles(this.selectedType).subscribe(
      (data) => {
        console.log(data);
        this.$loading.next(false);
        this.profiles = data;
        this.sortProfiles();
      },
      (error) => {
        this.$loading.next(false);
        this.profiles = [];
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
}
