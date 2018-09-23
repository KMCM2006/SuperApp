import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductsPage } from '../products/products';
import { FakeProducts } from '../../providers/FakeService/FakeProducts';
import { FakeListProducts } from '../../providers/FakeService/FakeListProducts';
import { DragulaService } from 'ng2-dragula';
import { SmartAudio } from '../../providers/smart-audio/smart-audio';
import { AudioProvider } from '../../shared/providers/AudioProvider';
@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html',
  viewProviders: [DragulaService]
})
export class ListaPage implements OnInit, OnDestroy, AfterViewInit {
  
  path_images = '../../assets/imgs/Products/';
  actualSelectedElement:any;
  actualSelectedContainer:any;
  products: Array<{id: number, title: string, image: string}> = [];
  quantityproductsString:string;
  quantityOfProducts: number;
  imageSound: String;

  constructor(public navCtrl: NavController, private dragulaService: DragulaService,public smartAudio: SmartAudio, private audioProvider: AudioProvider) {
    this.products = FakeProducts.getProducts();
    this.quantityOfProducts = FakeListProducts.getQuantityOfProducts();
    this.quantityproductsString = this.quantityOfProducts.toString();
    this.changeSoundIcon();
  }

  ngOnInit() {
    this.dragulaService.createGroup("PRODUCT", {
      revertOnSpill: false,
      moves: (element, container, handle) => {
        return !(container.id==='ignore-item');
      },
      accepts: (element, target, source, sibling) => {
        if(!target.classList.contains('objetive-container')) {
          return false;
        }
        return true;
      }
    });
      
  }

  ngOnDestroy() {
    this.dragulaService.destroy("PRODUCT");
  }

  ngAfterViewInit() {
    this.dragulaService.drop("PRODUCT").subscribe(({ el, target, source, sibling }) => {
      let product_id = +(el.id.split("-")[1]);
      let product = FakeProducts.getProductById(product_id);
      FakeListProducts.addProduct(product);
      this.quantityOfProducts = FakeListProducts.getQuantityOfProducts();
      this.quantityproductsString = this.quantityOfProducts.toString();
      el.remove();
      FakeProducts.removeProduct(this.products.indexOf(product));
    });
  }

  playSound() {
    this.audioProvider.playMainSound();
  }

  stopSound(){
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

  changeState()
  {
    this.smartAudio.changeState();
  }
  pushPageList(){
    this.navCtrl.push(ListaPage);    
  }

  pushProducts(){
    this.navCtrl.pop();
    this.navCtrl.push(ProductsPage);
  }

  goToRoot() {
    this.navCtrl.popToRoot();
  }
}
