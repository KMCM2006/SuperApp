import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Select, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../entities/user';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AvatarProvider } from '../../shared/providers/AvatarProvider';
import { SelectAvatarPage } from '../select-avatar/select-avatar';

/**
 * Generated class for the CreateUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserPage {
  @ViewChild('select') select1: Select;
  public username: string;
  public birthdate: Date;
  options: { quality: number; sourceType: number; saveToPhotoAlbum: boolean; correctOrientation: boolean; destinationType: number; mediaType: number; };
  Image: string;
  Picture:string;
  path: void;
  public avatars: { id: number, name: string } [];

  constructor(public navCtrl: NavController, public modalCtrl:ModalController, public navParams: NavParams, public userProvider: UserProvider,
              private toastCtrl: ToastController, public camera:Camera, public avatarProvider: AvatarProvider) {
              //this.Image="assets/imgs/user.png";
              this.avatars = this.avatarProvider.getAvatars();
              this.Image = "assets/imgs/avatars/avatar0.png";
              this.Picture="";
  }

  ionViewDidLoad() {
  }

  async saveUser() {
    let existsUsername = await this.userProvider.existsUsername(this.username);

    if (existsUsername) {
      let toast = this.toastCtrl.create({
        message: 'Ya existe un usuario con el nombre '+this.username,
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    } else {
      let newUser:User = new User(this.username, new Date(),this.Image);
      await this.userProvider.saveUser(newUser);

      let toast = this.toastCtrl.create({
        message: 'Usuario registrado con éxito',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
      this.afterSaveUser();
    }
  }

  afterSaveUser() {
    this.navCtrl.pop();
  }

  async takePicture(source) {
    try {
      let cameraOptions: CameraOptions = {
        quality: 50,
        targetWidth: 800,
        targetHeight: 800,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: (source == 'camera') ? true : false,
        allowEdit: true
      };
      
      cameraOptions.sourceType = (source == 'camera') ? this.camera.PictureSourceType.CAMERA :
                                                        this.camera.PictureSourceType.PHOTOLIBRARY;
      
      const result = await this.camera.getPicture(cameraOptions);
      const image = 'data:image/jpeg;base64,' + result;

      this.Image = image;
      
    } catch(e) {
      console.log(e);
    }
  }

  async showSelect(){
    let selectAvatar=this.modalCtrl.create(SelectAvatarPage);
    selectAvatar.onDidDismiss(
      (data)=>{
          if (data!=null)
          {
            this.changeImage(data);
          }
      }
    );
    await selectAvatar.present();
  }
  changeImage(data)
  {
    let reference:string="assets/imgs/avatars/avatar"+data.idAvatar+".png";
    this.Image=reference;
  }
  validate()
  {
    var size=this.username.length;
    if (size>8)
    {
      this.username=this.username.substring(0, size-1);
    }
  }
}
