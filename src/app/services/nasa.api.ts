import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NasaApi {
  readonly apiUrl: string = `https://images-api.nasa.gov/`;

  constructor(protected _httpClient: HttpClient) {}

  searchImagesApi$(searchTerm: string, images: boolean, videos: boolean) {
    const mediaTypes = [];

    if (images) {
      mediaTypes.push('image');
    }
    if (videos) {
      mediaTypes.push('video');
    }

    mediaTypes.join(',');

    return this._httpClient.get<any[]>(
      `${this.apiUrl}search?q=${searchTerm}&page=1&media_type=${mediaTypes}`
    );
  }
}
