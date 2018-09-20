import { LoadingPage } from './../pages/loading/loading';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListaPage } from '../pages/lista/lista';
import { WordPage } from '../pages/word/word';
import { MenuGamesPage } from '../pages/menu-games/menu-games';
import { ProductsPage } from '../pages/products/products';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { LevelCompletePage } from '../pages/level-complete/level-complete';

import { SmartAudio } from '../providers/smart-audio/smart-audio';
import { NativeAudio } from '@ionic-native/native-audio';
import { ProductProvider } from '../shared/providers/ProductProvider';
import { ArrayProductProvider } from '../providers/Array/ArrayProductProvider';
import { ArrayColorProvider } from '../providers/Array/ArrayColorProvider';
import { ColorProvider } from '../shared/providers/ColorProvider';
import { WordDragDropProvider } from '../shared/providers/WordDragDropProvider';
import { DragulaWordDragDropProvider } from '../providers/Dragula/DragulaWordDragDropProvider';
import { AudioProvider } from '../shared/providers/AudioProvider';
import { NativeAudioProvider } from '../providers/Native/NativeAudioProvider';
import { SelectLevelPage } from '../pages/select-level/select-level';
import { SoundsProvPage } from '../pages/sounds-prov/sounds-prov';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuGamesPage,
    ListaPage,
    WordPage,
    ProductsPage, 
    LevelCompletePage,
    LoadingPage,
    SelectLevelPage,
    SoundsProvPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    DragulaModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuGamesPage,
    ListaPage,
    WordPage,
    ProductsPage, 
    LevelCompletePage,
    LoadingPage,
    SelectLevelPage,
    SoundsProvPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    SmartAudio,
    NativeAudio,
    DragulaService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: ProductProvider, useClass: ArrayProductProvider},
    {provide: ColorProvider, useClass: ArrayColorProvider},
    {provide: WordDragDropProvider, useClass: DragulaWordDragDropProvider, deps: [DragulaService, Platform]},
    {provide: AudioProvider, useClass: NativeAudioProvider, deps: [NativeAudio]}
  ]
})
export class AppModule { }
