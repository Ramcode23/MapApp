import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Route } from '../interfaces/directions';
import { Feature } from '../interfaces/places';
;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;

  private markers: Marker[] = [];
  get isMapReady() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  constructor(private directionApi: DirectionsApiClient) { }

  flyTo(coord: LngLatLike) {

    if (!this.isMapReady) throw new Error('Map is not ready');

    this.map?.flyTo({
      zoom: 14,
      center: coord
    });
  }

  createMakerFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) throw new Error('Map is not ready');
    const newMarkers = [];
    for (const place of places) {
      const [lng, lat] = place.center
      const popup = new Popup()
        .setHTML(`
      <h6>${place.text}</h6>
       <span>${place.place_name}</span>`);

      this.markers.forEach(marker => marker.remove());
      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
      newMarkers.push(newMarker)
    }
    this.markers = newMarkers;
    if (places.length === 0) return;
    const bounds = new LngLatBounds()
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);
    this.map.fitBounds(bounds, { padding: 200 });
  }

  getRouteBetweenPonts(start: [number, number], end: [number, number]) {
    return this.directionApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`).subscribe(
      res => { this.drawPoline(res.routes[0]) }

    );

  }

  private drawPoline(route: Route) {
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });
    if (!this.map) throw Error('Map is not  ready');
    const coods = route.geometry.coordinates;
    const start = coods[0] as [number, number];
    const bounds = new LngLatBounds();
    coods.forEach(([lng, lat]) => {
      bounds.extend([lng, lat])
    })

    this.map.fitBounds(bounds, {
      padding: 200
    })

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coods
            }
          }
          ]
      }
    }


// clean route
if( this.map.getLayer('RouteString')){
  this.map.removeLayer('RouteString');
  this.map.removeSource('RouteString');
}

 this.map.addSource('RouteString',sourceData);

 this.map.addLayer(
   {
     id:'RouterString',
     type:'line',
     source:'RouteString',
     layout:{
       'line-cap':'round',
       'line-join':'round'
     },
     paint:{
       'line-color':'red',
       'line-width':3
     }
   }
 );
  }
}


