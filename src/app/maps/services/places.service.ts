import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api/index';
import { Feature, PlacesResponse } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
 public userLocaction?:[number,number];
 public isLoandingPlaces:boolean = false;
 public places:Feature[] = [];


 public get isUserLocation() : boolean {
   return  !!this.userLocaction;
 }

  constructor( private placesIp:PlacesApiClient) {
    this.getUserLocation();
   }
public  async getUserLocation():Promise<[number,number]>{
  return new Promise((resolve,reject)=>{
    navigator.geolocation.getCurrentPosition(
    ({  coords})=>{
      this.userLocaction = [coords.longitude,coords.latitude];
        resolve([coords.longitude,coords.latitude]);
      },
      err=>{
        alert('Please enable location services');
        console.log(err);
        reject(err);
      }
    )
  });

}
getPlacesByQuery(query:string=''){
  if (query.trim().length === 0) {
   this.isLoandingPlaces=false;
    this.places = [];
    return;
  }


  if(!this.userLocaction) throw new Error('User location is not defined');
  this.isLoandingPlaces = true;

this.placesIp.get<PlacesResponse>(`/${query}.json`,{
  params:{
    proximity:this.userLocaction?.join(',')
  }
})
.subscribe( resp=>{

  this.places = resp.features;
  this.isLoandingPlaces = false;
});
}
}
