import {AfterViewInit, Component, ElementRef, Input} from '@angular/core';
import * as L from 'leaflet';
import {CommonModule} from '@angular/common';
import {NgIconComponent} from '@ng-icons/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  template: `
    <div *ngIf="showMap">
      <div id="map"></div>
      <p>Mauvais emplacement ?
        <a
          href="https://www.openstreetmap.org/edit?editor=id&node={{coords.id}}#map={{_zoom}}/{{coords.lat}}/{{coords.lng}}"
          target="_blank"
          aria-label="Lien vers OpenStreetMap">Contribuez ici !</a>
      </p>
    </div>
  `,
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements AfterViewInit {
  @Input() address: {
    name: string;
    streetNumber: string;
    street: string;
    city: string;
    zip_code: string;
    country: string
  } | null = null;
  private map: L.Map | undefined;
  protected _zoom = 18                              ;
  protected showMap = false
  protected coords: { lat: number; lng: number; id: number; } = {lat: 0, lng: 0, id: 0};

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    if (this.address) {
      this.fetchCoordinates(this.address).then(coords => {
        if (coords) {
          this.coords = coords;
          console.log(JSON.stringify(coords))
          // Show the map container
          this.showMap = true;
          // Delay map initialization to ensure DOM is updated
          setTimeout(() => this.initializeMap(coords.lat, coords.lng), 0);
        } else {
          // Hide the map if no coordinates are found
          this.showMap = false;
        }
      });
    }
  }

  private initializeMap(lat: number, lng: number): void {
    const mapContainer = this.el.nativeElement.querySelector('#map');
    if (mapContainer) {
      this.map = L.map(mapContainer,
        {
          dragging: false,
          scrollWheelZoom: false,
          minZoom: 15}
      ).setView([lat, lng], this._zoom);

      // Add OpenStreetMap tile layer
      L.tileLayer(environment.apiUrl + '/osm/tiles?x={x}&y={y}&z={z}', {
        attribution: '&copy; Contributeurs <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      // Marker icon
      const customIcon = L.icon({
        iconUrl: 'assets/pin.png',
        iconSize: [38, 38],
        iconAnchor: [17, 38],
        popupAnchor: [0, -40]
      });

      // Add marker
      L.marker([lat, lng], {icon: customIcon}).addTo(this.map).bindPopup(this.address?.name!).openPopup();
    }
  }

  async fetchCoordinates(address: any): Promise<{ lat: number; lng: number, id: number } | null> {
    const query = `?amenity=${address.name}&street=${address.streetNumber} ${address.street}
    &city=${address.city}
    &postalcode=${address.zip_code}
    &country=${address.country}`;
    const response = await fetch(`https://nominatim.openstreetmap.org/search${query}&format=json`);
    const data = await response.json();
    if (data.length > 0) {
      return {lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), id: data[0].osm_id};
    }
    return null;
  }
}
