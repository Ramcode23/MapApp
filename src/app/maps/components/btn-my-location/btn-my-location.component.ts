import { Component, OnInit } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent  {

  constructor(
    private placeesService:PlacesService,
    private mapServise:MapService

    ) { }

  goToMyLocation() {
    debugger
    if(!this.mapServise.isMapReady) throw new Error('Map is not ready');
    if(!this.placeesService.isUserLocation) throw new Error('Places are not loaded');
 this.mapServise.flyTo(this.placeesService.userLocaction!);
  }

}


