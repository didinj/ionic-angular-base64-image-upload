import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  photoDataUrl: string | null = null;

  constructor(private http: HttpClient) { }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    this.photoDataUrl = image.dataUrl!;
  }

  async pickImage() {
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
    this.photoDataUrl = image.dataUrl!;
  }

  upload() {
    if (!this.photoDataUrl) return;

    const blob = this.dataUrlToBlob(this.photoDataUrl);
    const formData = new FormData();
    formData.append('file', blob, 'photo.jpg');

    this.http.post('https://your-server.com/upload', formData)
      .subscribe({
        next: res => console.log('Upload success', res),
        error: err => console.error('Upload failed', err)
      });
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}
