import { ArrayManager } from './../../Managers/ArrayManager';
import { UserProvider } from './../../providers/user/user';
import { LoginStatus } from './../../providers/login/LoginStatus';
import { CategoryProvider } from './../../providers/category/category';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core'; 
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular'; 
import { ProductsProvider } from '../../providers/product/product'; 
import {SuperMarketGame} from '../../shared/models/SupermarketGame'; 
import { AudioProvider } from '../../shared/providers/AudioProvider';
import { SupermarketDragDropProvider } from '../../shared/providers/SupermarketDragDropProvider';
import { SupermarketLevelCompletePage } from './../supermarket-level-complete/supermarket-level-complete';
import { Product } from '../../entities/product';
import { SupermarketDifficultyProvider } from '../../shared/providers/SupermarketDifficultyProvider';
import { SelectLevelPage } from './../select-level/select-level';
import { Login } from '../../providers/login/Login';
import { Category } from '../../entities/category';
import { User } from '../../entities/user';
import { List } from '../../entities/list';
import { ListsPage } from './../lists/lists';
import { ListProvider } from '../../providers/list/list'; 

@Component({
  selector: 'page-supermarket',
  templateUrl: 'supermarket.html',
})
export class SupermarketPage implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
   
  game : SuperMarketGame;
  level: number; 
  products: Array<Product> = [];
  categories: Array<Category> = [];
  productsToBuy: any=[]; 
  productsToPlay: any[];
  imageSound: String;
  carImage: String;
  public selectorName: string;
  public productsList: string[] = [];
  public countOfProducts: number;
  ON_VIEW_LIST_LENGTH:number = 12;
  ON_VIEW_CATEGORIES_LENGTH:number = 2;
  productPageIndex: number=0;
  categoriesPageIndex: number=0;
  onViewProducts: Array<Product> = [];
  onViewCategories: Array<{id: number, name: string}>=[];
  defaultCategoryId:number=0;
  public coins           : number;
  public textClass: boolean = true;
  public imageClass: boolean = true;
  public isDisabled      :boolean;
  showListButton: boolean = false;
  listId: number = -1;

  constructor(
    public navController: NavController,
    public navParams: NavParams,
    public productsProvider:   ProductsProvider,
    public categoryProvider: CategoryProvider,
    public modalController:ModalController,
    private audioProvider: AudioProvider,
    private dragDropProvider: SupermarketDragDropProvider,
    private platform: Platform,
    private supermarketDifficulty: SupermarketDifficultyProvider,
    private login:Login,
    public userProvider: UserProvider,
    public listProvider: ListProvider) {
    this.selectorName = 'PRODUCT-' + Math.random();
    this.countOfProducts = 0;
    this.carImage="assets/imgs/"+this.countOfProducts+".png";
    this.prepareGame();
    this.changeSoundIcon();
  }

  coinsOfUser()
  {
    this.login.userProvider.getAmountOfCoins().then((value)=>this.coins = value)
  }

  async prepareGame(){
    this.level = this.navParams.get('level') || 1; 
    this.listId = this.navParams.get('listId');
    let list:List = await this.listProvider.getFullObjectListById(this.listId);
    this.supermarketDifficulty.updateLastLevel(this.level);
    this.coinsOfUser();
    if((this.level >= 16 && this.level < 31) || this.level >= 46) {
      this.textClass = false;
    }
    if(this.level >= 31) {
      this.imageClass = false;
    }
    let user: User = await this.userProvider.getUserByUsername(LoginStatus.username);
    this.products = await this.productsProvider.getProductsByUserId(user.id);
    this.game = new SuperMarketGame(this.products,this.level,this.navParams.get('maxLevel')); 
    this.game.buildProducts(list);
    this.productsToBuy = this.game.ProductsToBuy;
    for(let index = 0; index < this.productsToBuy.length; ++index) {
      this.productsList.push(`play-${this.productsToBuy[index].title}`);
    }
    this.productsToPlay = this.game.ProductsToPlay;
    await this.loadProducts();
  } 


  async loadProducts(){
    if(this.game.isAdvancedLevel){
      await this.chargeCategoriesGlobal();
      this.showListButton=true;
    }
    else{
      this.onViewProducts=this.productsToPlay;
    }
  }

  async chargeCategoriesGlobal(){
    for(let product of this.productsToPlay){
      let category_id=product.category_id;
      let categoryIndex=this.categories.findIndex((elem)=>{return elem.id===category_id;});
      if(categoryIndex>=0){
        this.categories[categoryIndex].addProduct(product);
      }
      else{
        let category=await this.categoryProvider.getCategoryById(category_id);
        category.addProduct(product);
        this.categories.push(category);
      }
    }
    this.chargeProducts();
    this.chargeCategories();
  }

  onSelectCategory(category){
    let category_id = category.id;
    this.changeToInactiveCategoryColor();
    this.defaultCategoryId = this.categories.findIndex((elem)=>{return elem.id===category_id;});
    this.changeToActiveCategoryColor();
    this.productPageIndex = 0;
    this.chargeProducts();
  }

  changeToActiveCategoryColor(){
    let categoryName = this.categories[this.defaultCategoryId].name;
    let button = <HTMLElement> document.querySelector("#"+categoryName);
    
    if(button){
      //button.classList.remove("button-category-card");
      button.classList.add("activeBgColor");
    }
  }

  changeToInactiveCategoryColor(){
    let categoryName = this.categories[this.defaultCategoryId].name;
    let button = <HTMLElement> document.querySelector("#"+categoryName);
    if(button){
      button.classList.remove("activeBgColor");
      //button.classList.add("button-category-card");
    }
  }

  chargeProducts(){
    let products=this.categories[this.defaultCategoryId].products;
    let bound = this.productPageIndex+this.ON_VIEW_LIST_LENGTH;
    if(bound > products.length){
      bound = products.length;
    }
    this.onViewProducts = products.slice(this.productPageIndex, bound);
  }

  chargeCategories(){
    let bound = this.categoriesPageIndex+this.ON_VIEW_CATEGORIES_LENGTH;
    if(bound > this.categories.length){
      bound = this.categories.length;
    }
    this.onViewCategories = this.categories.slice(this.categoriesPageIndex, bound);
    this.changeToActiveCategoryColor();
  }

  nextProductPage(){
    this.productPageIndex+=this.ON_VIEW_LIST_LENGTH;
    if(this.productPageIndex>=this.products.length){
      this.productPageIndex=0;
    }
    this.chargeProducts();
  }

  nextCategoryPage(){
    this.categoriesPageIndex += this.ON_VIEW_CATEGORIES_LENGTH;
    if(this.categoriesPageIndex >= this.categories.length){
      this.categoriesPageIndex = 0;
    }
    this.chargeCategories();
  }

  public stopSound(){
    this.audioProvider.changeState();
    this.changeSoundIcon();
  }

  public changeLevel(){
      const changeLevel = this.modalController.create(
        SelectLevelPage, 
        {
            level : this.game.Level, 
            lastNav : this.navController, 
            maxLevel  : this.game.MaxLevel,
            minLevel  : this.game.MinLevel,
            gamePage  : this,
            typeOfGame  : "supermarket"             
        }
    );
    changeLevel.onDidDismiss(
        ()=>{
            this.changeSoundIcon();
            this.coins=LoginStatus.userProgress.coins;
        }
    );
    changeLevel.present();
  }

  public async showEndView(element) {

    this.game.addPoint(); 
    this.removeProductByElement(element);
    this.audioProvider.playPronunciationOfTheProductName(this.getProductNameByElement(element));
    this.countOfProducts=this.countOfProducts+1;
    this.carImage="assets/imgs/"+this.countOfProducts+".png";
    if(this.game.isGameOver()) {
      await this.login.saveProgressSuper(this.game.Level);
      this.playLevelCompleteSoundAndPronunciationOfTheProductName(element);
      this.showModalWin();
    }  
  }

  private removeProductByElement(htmlElement){
    let htmlId=this.getHtmlId(htmlElement);
    let productId=this.getProductIdByHtmlId(htmlId);
    this.takeProductOut(productId);
  }

  private getHtmlId(htmlElement): string{
    return htmlElement.getAttribute('id');
  }

  private getProductIdByHtmlId(htmlId: string){
    let id=htmlId.split('-')[1];
    return id;
  }
  private getProductNameByElement(htmlElement){
    let title=htmlElement.querySelector('p').textContent;
    return title;
  }
  
  private takeProductOut(productId){
    for(let index=0; index<this.categories.length; index++){
      let category=this.categories[index];
      let productIndex=category.products.findIndex(product=> product.id==productId);
      if(productIndex>=0){
        category.products.splice(productIndex,1);
        if(category.products.length==0){
          this.categories.splice(index,1);
          this.defaultCategoryId=0;
          this.categoriesPageIndex=0;
          this.chargeCategories();
          this.chargeProducts();
        }
        break;
      }
    }
  }

  public showModalWin(): void {
    if(this.game.Level<60){
      let nextLevel = this.game.Level+1;
      let currentDifficulty = this.game.Difficulty;
      const levelCompleteModal = this.modalController.create(
              SupermarketLevelCompletePage, 
              { level: nextLevel, 
                lastNav:this.navController,
                maxLevel:nextLevel,
                difficulty: currentDifficulty
              });
      levelCompleteModal.present();
    }else{
      this.navController.pop();
    }
  }

  private changeSoundIcon(){
    if(this.audioProvider.isMuted()){
      this.imageSound="assets/imgs/soundoff.png";
    }
    else{
      this.imageSound="assets/imgs/soundon.png";
    }
  }

  public getProductsList(): string[] {
    return this.productsList;
  }

  ionViewDidLoad() {
    this.changeSoundIcon();
  }

  ngOnInit(): void {
    this.dragDropProvider.initialize(this.selectorName, this);
  }

  ngAfterViewInit(): void {
    this.dragDropProvider.startEvents(this.selectorName, this);
  }

  ngAfterViewChecked(): void {
    const HEIGHT_WINDOW = this.platform.height();
    const HEIGHT_BAR = 78;
    const PADDING = 32;
    const HEIGHT_CONTAINER = document.getElementById('high_container').offsetHeight;
    let height = HEIGHT_WINDOW - HEIGHT_BAR - PADDING - HEIGHT_CONTAINER;
    document.getElementById('carrito').setAttribute('style', `height: ${height + 45}px`);
  }
  public playPronunciationOfTheProductName(word:string) {
    this.audioProvider.playPronunciationOfTheProductName(word);
  }
  public playLevelCompleteSoundAndPronunciationOfTheProductName(element) {
    setTimeout(() => {
    this.playPronunciationOfTheProductName(this.getProductNameByElement(element));
    }, 4000);
    this.audioProvider.playLevelCompleteSound();
}
  ngOnDestroy(): void { 
    this.dragDropProvider.finalize(this.selectorName);
  } 

  public async updateCoinsOfUser(){
    await this.login.updateCoins();
  }

  public reduceCoins(){
      if(this.coins >= 10){
          this.isDisabled=true;
          this.updateCoinsOfUser();
          this.coins=this.coins-10;
          this.actionClueProduct();   
      }    
  }

  async actionClueProduct(){
      let wrongProducts = ArrayManager.getWrongElements(this.productsToPlay,this.productsToBuy); 
      let productToRemove = ArrayManager.get_random_element(wrongProducts); 
      this.removeWrongProduct(productToRemove);
  }
  
  removeWrongProduct(productToRemove){
    this.productsToPlay.splice(this.productsToPlay.indexOf(productToRemove),1); 
    if(this.game.isAdvancedLevel){
      let index = this.onViewProducts.indexOf(productToRemove);
      this.takeProductOut(productToRemove.id);    
      if(index!==-1){
        this.onViewProducts.splice(index,1);
      }
    }
  }

  openList(){
    let maxLevel = this.navParams.get('maxLevel'); 
    this.navController.pop();
    this.navController.push(ListsPage, {SuperMarket:true, level:this.level, maxLevel: maxLevel});
  }

}
