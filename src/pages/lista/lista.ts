import { ListProvider } from './../../providers/list/list';
import { ProductListProvider } from './../../providers/product-list/product-list';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavController, AlertController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { DragulaService } from 'ng2-dragula';
import { AudioProvider } from '../../shared/providers/AudioProvider';
import { Category } from '../../entities/category';
import { Product } from '../../entities/product';
import { Categories } from '../../providers/FakeService/Categories';
import { CategoryProvider } from '../../providers/category/category';
import { ProductsProvider } from '../../providers/product/product';
import { ProductList } from '../../entities/productList';
import { List } from '../../entities/list';
import { LoginStatus } from '../../providers/login/LoginStatus';
import { UserProvider } from './../../providers/user/user';
import { ListsPage } from './../lists/lists';
import { ConfirmationPage } from './../confirmation/confirmation';
import { AlertProvider } from '../../providers/alert/alert'

@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html',
  viewProviders: [DragulaService]
})
export class ListaPage implements OnInit, AfterViewInit {

  list: List;
  path_images = '../../assets/imgs/Products/';
  defaultCategoryId:number = 1;
  actualSelectedElement:any;
  actualSelectedContainer:any;
  products: Array<Product> = [];
  categories: Array<Category> = [];
  selectedCategory: {id: number, name: string};
  imageSound: String;
  productPageIndex: number;
  categoriesPageIndex: number;
  toAddProducts: Array<ProductList> = [];
  toDeleteProducts: Array<ProductList> = [];
  onViewProducts: Array<Product> = [];
  onViewCategories: Array<{id: number, name: string}>=[];
  ON_VIEW_LIST_LENGTH = 12;
  ON_VIEW_CATEGORIES_LENGTH = 3;
  DEFAULT_NAME:string = "NUEVA LISTA";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dragulaService: DragulaService,
              public productsProvider: ProductsProvider,
              public categoryProvider: CategoryProvider,
              private audioProvider: AudioProvider,
              private alertCtrl: AlertController,
              public productListProvider: ProductListProvider,
              public listProvider: ListProvider,
              public userProvider: UserProvider,
              private modalController: ModalController,
              private alertProvider: AlertProvider,
              public toastController: ToastController) {
    this.list = new List;
    this.list.name = this.DEFAULT_NAME;
    this.productPageIndex=0;
    this.categoriesPageIndex=0;
    this.selectedCategory=Categories.getCategoryById(1);
    userProvider.getUserByUsername(LoginStatus.username)
    .then(user => {
      categoryProvider.getCategoriesByUserId(user.id)
      .then(categories => {
        this.categories = categories;
        this.selectedCategory = this.categories[0];
        this.defaultCategoryId = this.categories[0].id;
        this.chargeCategories();
      }).catch(error => {
        console.log(error);
      });
      productsProvider.getProductsByCategoryAndUserIdOnlyActive(this.defaultCategoryId, user.id)
      .then(products => {
        this.products = products;
        this.chargeProducts();
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    });
  }

  async ionViewDidEnter() {
    this.changeSoundIcon();
    await this.chargeList();
    this.onSelectCategory(this.selectedCategory);
  }

  async chargeList(){
    let listId=this.navParams.get("listId");
    if(listId>-1){
      this.list = await this.listProvider.getFullObjectListById(listId);
      this.loadProductsOnList();
    }
  }

  chargeProducts(){
    let bound = this.productPageIndex+this.ON_VIEW_LIST_LENGTH;
    if(bound > this.products.length){
      bound = this.products.length;
    }
    this.onViewProducts = this.products.slice(this.productPageIndex, bound);
  }

  chargeCategories(){
    let bound = this.categoriesPageIndex+this.ON_VIEW_CATEGORIES_LENGTH;
    if(bound > this.categories.length){
      bound = this.categories.length;
    }
    this.onViewCategories = this.categories.slice(this.categoriesPageIndex, bound);
  }

  ngOnInit() {
    this.dragulaService.createGroup("PRODUCT", {
      revertOnSpill: false,
      moves: (element, container, handle) => {
        return (container.id !=='ignore-item');
      },
      accepts: (element, target, source, sibling) => {
        if(!target.classList.contains('objetive-container')) {
          return false;
        }
        return true;
      }
    });
  }

  ngAfterViewInit() {
    this.dragulaService.drop("PRODUCT").subscribe(({ el, target, source, sibling }) => {
      let product_id = + (el.id.split("-")[1]);
      let product=this.products.find(el=>el.id===product_id);
      let productListTemp = new ProductList();
      productListTemp.list_id = this.navParams.get("listId");
      productListTemp.product_id = product.id;
      productListTemp.product=product;
      this.list.products.push(productListTemp);
      this.addToQueueList(productListTemp);
      this.products=this.products.filter(prod => prod.id!==product.id);
      this.chargeProducts();
      this.audioProvider.playPronunciationOfTheProductName(product.title);
      el.remove();
    });
  }

  public stopSound(){
    this.audioProvider.changeState();
    this.changeSoundIcon();
  }

  private changeSoundIcon(){
    if(this.audioProvider.isMuted()){
      this.imageSound="assets/imgs/soundOffDark.png";
    }
    else{
      this.imageSound="assets/imgs/soundOnDark.png";
    }
  }

  pushPageList(){
    this.navCtrl.push(ListaPage);
  }

  pushProducts(){
    this.navCtrl.push(ProductsPage);
  }

  goToRoot() {
    this.navCtrl.pop();
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

  onSelectCategory(category){
    this.selectedCategory = category;
    this.userProvider.getUserByUsername(LoginStatus.username)
    .then(user => {
      this.productsProvider.getProductsByCategoryAndUserIdOnlyActive(this.selectedCategory.id, user.id)
      .then(products => {
        this.products=products.filter(product => {
          let isNotOnList =true;
          for(let productList of this.list.products){
            if(product.id===productList.product.id){
              isNotOnList=false;
              break;
            }
          }
          return isNotOnList;
        });
        this.productPageIndex = 0;
        this.chargeProducts();
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    });
  }

  onClickDeleteList() {
    let title: string = 'Borrar toda la lista';
    let message: string = '¿Quieres borrar toda la lista de productos?';
    let agreeButtonText = 'SI';
    let agreeCallback = () => {this.deleteListOfProducts()};
    let disagreeButtonText = 'NO';
    let disagreeCallback = () => {};

    let alert = this.alertCtrl.create(this.alertProvider.generateConfirmationAlert(title, 
                                                                                   message, 
                                                                                   agreeButtonText, 
                                                                                   agreeCallback, 
                                                                                   disagreeButtonText, 
                                                                                   disagreeCallback,
                                                                                   ""));
    alert.present();
  }

  alertSucessSaveList(){
    let title: string = 'Guardado Satisfactoriamente';
    let message: string = 'Se guardo la lista '+this.list.name;
    let textButton: string = 'OK';
    let alert = this.alertCtrl.create(this.alertProvider.generateBasicAlert(title, 
                                                                            message, 
                                                                            textButton, 
                                                                            ()=>{} ,
                                                                            ""));
    alert.present();
  }

  onClickDeleteAProduct(productOfList) {
    let productId=productOfList.product.id;
    this.list.products=this.list.products.filter(onList=>onList.product_id!==productId);
    this.addToDeleteQueue(productOfList);
    this.onSelectCategory(this.selectedCategory);    
  }

  deleteListOfProducts() {
    this.toDeleteProducts=this.list.products;
    this.list.products=[];
    this.onSelectCategory(this.selectedCategory);
  }

  addToDeleteQueue(productList: ProductList){
    if(this.list.id){
      this.toAddProducts=this.toAddProducts.filter(product => product.product_id!==productList.product_id);
      this.toDeleteProducts.push(productList);
    }
  }
  
  addToQueueList(productList: ProductList){
    if(this.list.id){
      this.toDeleteProducts=this.toDeleteProducts.filter(product => product.product_id!==productList.product_id);
      this.toAddProducts.push(productList);
    }
  }

  public playPronunciationOfTheProductName(word:string) {
    this.audioProvider.playPronunciationOfTheProductName(word);
  }

  loadProductsOnList() {
    for(let productOnList of this.list.products){
      this.products = this.products.filter(product => {product.id != productOnList.product_id});
    }
    this.chargeProducts();
  }

  async saveList(){
    if(this.list.id){
      this.listProvider.updateList(this.list)
      .then(
        async (success) => {
        await this.saveProductList(false);
      });
    }else{
      this.userProvider.getUserByUsername(LoginStatus.username)
      .then(async (user) => {
        this.list.user_id = user.id;
        if(this.list.name==this.DEFAULT_NAME){
          let name: string = <string> await this.promptSaveList();
          while(name == ""){
            await this.blankNameAlert();
            name = <string> await this.promptSaveList();
          }
          this.list.name = name;
        }
        this.list.name = this.list.name.toUpperCase();
        this.listProvider.isItANameValid(this.list.name, user.id)
        .then(result => {
          if(!result) {
            this.nameAlreadyExist();
          } else {
            this.listProvider.saveList(this.list).then(success => {
              this.saveProductList(true);
            });
          }
        })
      }).catch(error => {
        console.error(error);
      });
    }
  }

  async blankNameAlert(){
    return new Promise((resolve, reject) => {
      let title: string = 'Nombre no puede estar vacio';
      let message: string = 'El nombre de la lista no puede estar vacio';
      let textButton: string = 'OK';
      let alert = this.alertCtrl.create(this.alertProvider.generateBasicAlert(title, 
                                                                              message, 
                                                                              textButton, 
                                                                              ()=>{resolve('OK');} ,
                                                                              ""));
      alert.present();
    });
  }

  async promptSaveList(){
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create(this.alertProvider.generatePromptAlert(
                                                            'Guardar Lista',
                                                            'Introduzca el nombre de la lista',
                                                            [{
                                                              name: 'listName',
                                                              placeholder: 'Nombre de la lista'
                                                            }],
                                                            [{
                                                              text: 'Cancelar'
                                                            },
                                                            {
                                                              text: 'Guardar',
                                                              handler: (data) => {
                                                                resolve(data.listName.toUpperCase());
                                                              }
                                                            }],
                                                            'uppercaseText'));
      alert.present()
    });
  }

  async saveProductList(newList: boolean){
    if(!newList){
      await this.saveAuxiliarLists();
      }else{
        for(let onList of this.list.products){
          onList.list_id=this.list.id;
          await this.productListProvider.saveProductList(onList);
        }
      }
    this.alertSucessSaveList();
  }

  async saveAuxiliarLists(){
    for(let onList of this.toAddProducts){
      onList.list_id=this.list.id;
      await this.productListProvider.saveProductList(onList);
    }
    for(let onList of this.toDeleteProducts){
      onList.list_id=this.list.id;
      await this.productListProvider.deleteProductListByProductIdAndListId(onList.product_id, onList.list_id);
    }
    this.toAddProducts=[];
    this.toDeleteProducts=[];
  }

  confirm(){
    let callback=()=>{this.deleteList()};
    let message="¿Realmente quieres eliminar la lista "+this.list.name+"?";
    const confirmationModal = this.modalController.create(ConfirmationPage,{callback:callback, message:message});
    confirmationModal.present();
  }

  deleteList(){
    this.productListProvider.deleteProductListByListId(this.list.id)
    .then(response => {
      if(!response) console.error("Inconsistent list information");
    })
    this.listProvider.deleteList(this.list.id)
    .then(response => {
      if(!response) console.error("Inconsistent list information");
    });
    this.list=new List;
    this.list.name="NUEVA LISTA";
    this.list.products=[];
  }

  openList(){
    this.navCtrl.pop();
    this.navCtrl.push(ListsPage);
  }

  editName(){
    let title=<HTMLBodyElement>document.querySelector("#list-name");
    let form=<HTMLBodyElement>document.querySelector("#name-form");
    title.classList.add("hide");
    form.classList.remove("hide");
  }

  saveListsName(){
    let title=<HTMLBodyElement>document.querySelector("#list-name");
    let form=<HTMLBodyElement>document.querySelector("#name-form");
    this.list.name=this.list.name.toUpperCase();
    title.classList.remove("hide");
    form.classList.add("hide");
  }

  nameAlreadyExist() {
    let alertMessage = this.toastController.create({
      message: 'YA EXISTE UNA LISTA CON EL NOMBRE: ' + this.list.name,
      duration: 2000,
      position: 'bottom'
    });
    alertMessage.present();
  }
}
