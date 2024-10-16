import { Component, Input } from '@angular/core';
import { Profile } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material.module';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.scss',
})
export class ProfileMainComponent {
  @Input() profile!: Profile;
}
