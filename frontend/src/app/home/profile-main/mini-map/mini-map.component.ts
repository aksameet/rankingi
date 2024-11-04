import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
  GoogleMap,
} from '@angular/google-maps';

@Component({
  standalone: true,
  selector: 'app-mini-map',
  imports: [GoogleMapsModule],
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss'],
})
export class MiniMapComponent {
  @ViewChild(GoogleMap) map!: GoogleMap;
  @Input() latitude!: number;
  @Input() longitude!: number;

  center: google.maps.LatLngLiteral = {
    lat: 52.069167,
    lng: 19.480278,
  };
  zoom = 14;

  ngOnInit(): void {
    this.center = {
      lat: this.latitude || 52.069167,
      lng: this.longitude || 19.480278,
    };
  }

  openInfoWindow(marker: MapMarker): void {
    // if (this.infoWindow) {
    //   this.infoWindow.open(marker);
    // }
  }
}
