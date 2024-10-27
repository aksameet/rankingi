import { Component, Input, Output, EventEmitter } from '@angular/core';
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
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          overflow: 'hidden',
          opacity: 0,
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          overflow: 'visible',
          opacity: 1,
        })
      ),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ProfileMainComponent {
  @Input() profile!: Profile;
  @Input() expanded: boolean = false;
  @Output() cardClick = new EventEmitter<void>();
}
