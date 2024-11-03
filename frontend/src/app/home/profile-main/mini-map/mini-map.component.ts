import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  standalone: true,
  selector: 'app-mini-map',
  imports: [GoogleMapsModule],
  templateUrl: './mini-map.component.html',
})
export class MiniMapComponent {
  @Input() latitude!: number;
  @Input() longitude!: number;

  center: google.maps.LatLngLiteral = {
    lat: 52.069167,
    lng: 19.480278,
  };
  zoom = 8;

  ngOnInit(): void {
    this.center = {
      lat: this.latitude || 52.069167,
      lng: this.longitude || 19.480278,
    };
  }

  onMapReady(map: any): void {
    console.log(map);
    // Create the AdvancedMarkerElement
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: this.center,
      map: map,
    });
  }
}
