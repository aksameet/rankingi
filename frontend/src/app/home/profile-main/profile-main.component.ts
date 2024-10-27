import { Component, Input } from '@angular/core';
import { Profile } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/modules/material.module';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.scss'],
  animations: [
    trigger('slideToggle', [
      state(
        'collapsed',
        style({
          height: '0px',
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          overflow: 'hidden',
        })
      ),
      transition('collapsed <=> expanded', animate('200ms ease-in-out')),
    ]),
  ],
})
export class ProfileMainComponent {
  @Input() profile!: Profile;
  expanded: boolean = false;

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
