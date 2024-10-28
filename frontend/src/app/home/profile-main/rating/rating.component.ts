import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent {
  @Input() rating: number | undefined = 0 || undefined;
  @Input() opinions: number | undefined = 0 || undefined; // The number of opinions

  fullStars: number[] = []; // Array for full stars
  halfStar: boolean = false; // Whether to show a half star
  emptyStars: number[] = []; // Array for empty stars

  ngOnInit() {
    const maxStars = 5; // Maximum number of stars to display

    // Calculate full stars
    if (this.rating) {
      const fullStarCount = Math.floor(this.rating);
      this.fullStars = Array(fullStarCount).fill(0);

      // Determine if there is a half star
      this.halfStar = this.rating - fullStarCount >= 0.5;

      // Calculate empty stars
      const emptyStarCount = maxStars - fullStarCount - (this.halfStar ? 1 : 0);
      this.emptyStars = Array(emptyStarCount).fill(0);
    }
  }
}
