import { Component, Input } from '@angular/core';
import { Profile } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material.module';
import { RatingComponent } from './rating/rating.component';
import { MiniMapComponent } from './mini-map/mini-map.component';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [CommonModule, MaterialModule, RatingComponent, MiniMapComponent],
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
})
export class ProfileMainComponent {
  @Input() profile!: Profile;
  expanded: boolean = false;
  latitude!: number;
  longitude!: number;
  mapReady: boolean = false;

  ngOnInit(): void {
    if (this.profile.geolocation) {
      [this.latitude, this.longitude] = this.profile.geolocation
        .split(',')
        .map((coord) => parseFloat(parseFloat(coord.trim()).toFixed(4)));
    }
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
