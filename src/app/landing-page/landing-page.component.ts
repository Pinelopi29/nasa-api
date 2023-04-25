import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NasaApi } from '../services/nasa.api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  title = 'nasa-api';

  searchTerm: string = '';
  images: boolean = false;
  videos: boolean = false;

  constructor(
    private _nasaApi: NasaApi,
    private _httpClient: HttpClient,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  onSearch(searchTerm: string) {
    const filterValue = searchTerm.trim().toLocaleLowerCase();
    if (filterValue) {
      this._nasaApi
        .searchImagesApi$(filterValue, this.images, this.videos)
        .subscribe((data: any) => {
          const galleryContainer = document.getElementById('gallery-container');
          if (galleryContainer) {
            galleryContainer.innerHTML = '';
            data.collection.items.forEach((asset: any) => {
              const imgDiv = document.createElement('div');
              if (asset.data[0].media_type == 'video') {
                this._httpClient
                  .get(asset.href, {
                    headers: new HttpHeaders({
                      'Access-Control-Allow-Origin': '*',
                    }),
                  })
                  .subscribe(
                    (jsonData: any) => {
                      let videoSourceUrl: any = null;
                      videoSourceUrl = jsonData[2];
                      const video = document.createElement('video');
                      video.src = videoSourceUrl;
                      video.setAttribute('type', 'video/mp4');
                      video.width = 300;
                      video.height = 300;
                      video.controls = true;
                      video.addEventListener('play', () => {
                        this._router.navigate([
                          '/assets',
                          {
                            asset: JSON.stringify(asset),
                            videoSourceUrl,
                          },
                        ]);
                      });
                      imgDiv.appendChild(video);
                      galleryContainer.appendChild(imgDiv);
                    },
                    (error) => console.error(error)
                  );
              } else if (asset.data[0].media_type == 'image') {
                const img = document.createElement('img');
                img.src = asset.links[0].href;
                img.alt = asset.data[0].title;
                imgDiv.className = 'gallery-item';
                imgDiv.addEventListener('click', () => {
                  this._router.navigate([
                    '/assets',
                    { asset: JSON.stringify(asset) },
                  ]);
                });
                imgDiv.appendChild(img);
                galleryContainer.appendChild(imgDiv);
              }
            });
          }
        });
    }
  }

  addVideo(videoUrl: any, imgDiv: any, galleryContainer: any) {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.setAttribute('type', 'video/mp4');
    video.controls = true;

    // imgDiv.appendChild(video);
    galleryContainer.appendChild(video);
  }

  onCheckboxChagen(event: any, value: any) {
    switch (value.toString()) {
      case 'images':
        this.images = event.checked;
        break;
      case 'videos':
        this.videos = event.checked;
        break;

      default:
        break;
    }
  }
}
