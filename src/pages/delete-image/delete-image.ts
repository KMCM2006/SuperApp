import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DeleteImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-delete-image',
  templateUrl: 'delete-image.html',
})
export class DeleteImagePage {
  constructor(public navCtrl: NavController, public viewCtrl:ViewController ,public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    
  }
  public delete()
  {
    this.viewCtrl.dismiss(true);
  }
}
