import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { NasaApi } from './services/nasa.api';
import { AssetsDialog } from './assetsDialog/assets-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @ViewChild('galleryContainer', { static: true })
  galleryContainerId?: ElementRef;

  title = 'nasa-api';

  searchTerm: string = '';
  images: boolean = false;
  videos: boolean = false;

  constructor(
    private _nasaApi: NasaApi,
    private _dialog: MatDialog,
    private _httpClient: HttpClient,
    private _router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  openDialog(asset: any): void {
    this._dialog.open(AssetsDialog, {
      data: { asset },
    });
  }

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
                      let videoSourceUrl = null;
                      videoSourceUrl = jsonData[2];
                      const video = this.renderer.createElement('video');
                      video.src = videoSourceUrl;
                      video.setAttribute('type', 'video/mp4');
                      video.width = 300;
                      video.height = 300;
                      video.controls = false;
                      video.addEventListener(
                        'play',
                        this._router.navigate(['/assets', { asset }])
                      );
                      imgDiv.className = 'gallery-item';
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
                  this._router.navigate(['/assets', { asset }]);
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
