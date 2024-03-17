import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WompiService {
  public pub_wompi_key:string = environment.pub_wompi_test;
  get header() {
    return {
      headers: {
        'Authorization': `Bearer ${environment.pub_wompi_test}`
      }
    }
  };
  private wompi_url:string = environment.wompi_url;
  constructor(private http:HttpClient) { }

  SendCardToTokenize(data:{}){
    const url = `${this.wompi_url}/tokens/cards`;
    return this.http.post(url, data, this.header);
  };

  SendNequiToTokenize(data:{}){
    const url = `${this.wompi_url}/tokens/nequi`;
    return this.http.post(url, data, this.header);
  };

  GetTermsAndConditions(){
    const url = `${this.wompi_url}/merchants/${this.pub_wompi_key}`;
    return this.http.get(url);
  }
}
