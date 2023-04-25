import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'assets-dialog',
  templateUrl: './assets-dialog.component.html',
  styleUrls: ['./assets-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssetsDialog {
  constructor(private route: ActivatedRoute) {}

  title = '';
  desc = '';
  asset = '';

  ngOnInit(): void {
    let parseAsset = JSON.parse(this.route.snapshot.params['asset']);

    const imgDiv = document.createElement('div');
    const content = document.getElementById('dialog-content');

    if (parseAsset.data[0].media_type == 'video') {
      this.title = parseAsset.data[0].title;
      this.desc = parseAsset.data[0].description;

      const video = document.createElement('video');
      video.src = this.route.snapshot.params['videoSourceUrl'];
      video.setAttribute('type', 'video/mp4');
      video.width = 600;
      video.height = 600;
      video.controls = true;
      imgDiv.className = 'video-flex';
      imgDiv.appendChild(video);
      content?.appendChild(imgDiv);
    } else {
      this.title = parseAsset.data[0].title;
      this.desc = parseAsset.data[0].description;
      const img = document.createElement('img');
      img.src = parseAsset.links[0].href;
      img.alt = parseAsset.data[0].title;
      imgDiv.className = 'gallery-item';

      imgDiv.appendChild(img);
      content?.appendChild(imgDiv);
    }
  }

  ngAfterViewInit(): void {}
}
