import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocTypesService {

  public base_url:string = environment.base_url;
  constructor(private http:HttpClient) { }

  GetDocTypes(){
    const url = `${this.base_url}/document-type/`;
    return this.http.get(url);
  };
}
