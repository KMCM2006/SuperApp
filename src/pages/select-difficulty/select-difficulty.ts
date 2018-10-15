import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WordPage } from '../word/word';
import { AudioProvider } from '../../shared/providers/AudioProvider';
import { DifficultyProvider } from '../../shared/providers/DifficultyProvider';
import { Difficulty } from '../../shared/models/Difficulty.model';
@Component({
    selector: 'page-select-difficulty',
    templateUrl: 'select-difficulty.html',
})
export class SelectDifficultyPage {

    private imageSound:String;
    
    constructor(
        public navCtrl             : NavController, 
        public navParams           : NavParams,
        private audioProvider      : AudioProvider,
        private difficultyProvider : DifficultyProvider
    ) {}

    stopSound(){
        this.audioProvider.changeState();
        this.changeSoundIcon();
    }
  
    ionViewDidEnter() {
        this.changeSoundIcon(); 
    }

    changeSoundIcon(){
        if(this.audioProvider.isMuted()){
            this.imageSound = "assets/imgs/soundoff.png";
        }
        else{
            this.imageSound = "assets/imgs/soundon.png";
        }
    }

    changeState() {
        this.audioProvider.changeState();
    }

    openEasyMode() {
        this.navCtrl.push(WordPage, {'level':1});
    }

    openMediumMode() {
        this.navCtrl.push(WordPage, {'level':16});
    }

    openHardMode() {
        this.navCtrl.push(WordPage, {'level':31});
    }

    openExpertMode() {
        this.navCtrl.push(WordPage, {'level':125});
    }

    ionViewDidLoad() {
        this.difficultyProvider.countRows().then(number => {
            if(number < 4) {
                this.startDatabase();
            }
        })
    }

    startDatabase() {
        let modes: Difficulty[] = [
            Difficulty.createDifficulty(1, '000000000000000', 0, 1),
            Difficulty.createDifficulty(2, '000000000000000', 1, 16),
            Difficulty.createDifficulty(3, '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 2, 31),
            Difficulty.createDifficulty(4, '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 3, 125)
        ];
        for(let index = 0; index < 4; ++index) {
            this.difficultyProvider.saveDifficulty(modes[index]);
        }        
    }
}
