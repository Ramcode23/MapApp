import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  private deboucenceTime?: NodeJS.Timeout

  constructor(private placeservice:PlacesService) { }

  ngOnInit(): void {
  }

  onQueryChange(query: string='') {

    if (this.deboucenceTime) clearTimeout(this.deboucenceTime) ;

    this.deboucenceTime = setTimeout(() => {
        console.log( this.placeservice.getPlacesByQuery(query));
      }, 350)


  }
}
