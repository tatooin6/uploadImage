import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [[Camera, File, WebView]]
})
export class HomePage {

  base64Image: any;
  selectedImage: string = '';

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private file: File,
    private webview: WebView,
    public http: HttpClient
  ) {}

  onInit() {
  }

  public async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    try {
      const tempImage = await this.camera.getPicture(options);
      let img = tempImage.split('/');
      let nombre = img[img.length - 1];
      let tempPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);
      let pathExternal = this.file.externalApplicationStorageDirectory;
      try {
        await this.file.moveFile(tempPath, nombre, pathExternal, 'prueba.jpg');
        this.base64Image = await this.webview.convertFileSrc(pathExternal + 'prueba.jpg');
        this.selectedImage = nombre;
        setTimeout(() => {
            // this.upload();
            console.log('Ready to send');
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }

    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64 (DATA_URL):
    //   this.base64Image = 'data:image/jpeg;base64,' + imageData;
    //  }, (err) => {
    //   // Handle error
    //  });
}

  openGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    // this.camera.getPicture(options).then(( imageData ) => {
    //   this.base64Image = 'data:image/jpeg;base64,' + ImageData;
    // }, ( err ) => {
    //   // Handle error;
    // });
}

  public uploadImage(){
    //let url = 'http://192.168.50.212/xm3/image.php';
    let url = 'http://192.168.50.75:8082/xm2/api/web/imgs/uploader.php0';
    let postData = new FormData();
    postData.append('file', this.base64Image);
    let data: Observable<any> = this.http.post(url, postData);
    data.subscribe((result) => {
      console.log(result);
    });
  }


}
