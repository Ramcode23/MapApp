import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Map,Popup,Marker} from 'mapbox-gl';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
@ViewChild('mapDiv') mapDivElement!:ElementRef
  constructor( private placeesService:PlacesService,
    private mapServise:MapService) { }

  ngAfterViewInit(): void {
    if (!this.placeesService.userLocaction) throw new Error('User location is not defined');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.placeesService.userLocaction,
      zoom: 14 // starting zoom
      });


      const popup = new Popup()
      .setHTML('<h6>Im here </h6> <span>In this places </span>');
      new Marker({color: 'red'})
      .setLngLat(this.placeesService.userLocaction)
      .setPopup(popup)
      .addTo(map);

      this.mapServise.setMap(map);
    }



}
