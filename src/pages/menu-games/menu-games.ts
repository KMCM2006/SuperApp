import { Component } from '@angular/core';
import { WordPage } from './../word/word';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SmartAudio } from '../../providers/smart-audio/smart-audio';
import { AudioProvider } from '../../shared/providers/AudioProvider';
/**
 * Generated class for the MenuGamesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu-games',
  templateUrl: 'menu-games.html',
})
export class MenuGamesPage {

  imageSound:String="assets/imgs/soundon.png";
  constructor(public navCtrl: NavController, public navParams: NavParams, public smartAudio: SmartAudio, private audioProvider: AudioProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuGamesPage');
    this.audioProvider.playMainSound();
  }

  playSound() {
    this.audioProvider.playMainSound();
  }
  stopSound(){
    //this.audioProvider.stopMainSound();
    this.audioProvider.changeState();
    this.changeSoundIcon();
  }
  changeSoundIcon(){
    if(this.audioProvider.isMuted()){
      this.imageSound="assets/imgs/soundoff.png";
    }
    else{
      this.imageSound="assets/imgs/soundon.png";
    }
  }
  pushPageWord(){
    this.navCtrl.push(WordPage);
  }

  popPage(){
    this.navCtrl.pop();
  }
}
