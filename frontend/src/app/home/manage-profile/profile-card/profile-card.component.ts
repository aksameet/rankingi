import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Profile } from '../../../services/profile.service';
import { MaterialModule } from '../../../shared/modules/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule],
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
  @Output() deleteProfile = new EventEmitter<string>();
  @Output() editProfile = new EventEmitter<Profile>();

  onDelete() {
    this.deleteProfile.emit(this.profile.id);
  }

  onEdit() {
    this.editProfile.emit(this.profile);
  }
}
