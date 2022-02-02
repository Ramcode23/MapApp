import { Component } from '@angular/core';
import { Feature } from '../../interfaces/places';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
public selectedId='';
  constructor(private placesServices:PlacesService,private mapService:MapService) { }


  public get isLoading() : Boolean {
    return this.placesServices.isLoandingPlaces;
  }


  public get places() : Feature[] {
    return this.placesServices.places;
  }

  flytTo(place:Feature){
    this.selectedId = place.id;
    const[lng,lat]=place.center
    this.mapService.flyTo([lng,lat]);
  }



}
