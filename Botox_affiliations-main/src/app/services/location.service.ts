import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  public base_url:string = environment.base_url;
  constructor(private http:HttpClient) { }

  GetCountries(){
    const url = `${this.base_url}/country`;
    return this.http.get(url);
  };

  GetDepartments(country:string){
    const url = `${this.base_url}/department/?country=${country}`;
    return this.http.get(url);
  };

  GetMunicipality(department:string){
    const url = `${this.base_url}/municipality/?department=${department}`;
    return this.http.get(url)
  };

  GetNeighborhood(municipality:string, limit:number, offset:number) {
    const url = `${this.base_url}/neighborhood/?municipality=${municipality}&limit=${limit}&offset=${offset}`;
    return this.http.get(url);
  };


}
