import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.local';
import * as querystring from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private EXTERNAL_URL = environment.EXTERNAL_URL;
  constructor(
    private http: HttpClient
  ) { }

  public getImage(options?: any) {
    options = querystring.stringify(options);
    return this.EXTERNAL_URL + `?${options}`;
  }

  public uploadImage(image: any, type: string): any {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', type);
    return this.http.post(this.EXTERNAL_URL + `/upload`, formData);
  }
}
