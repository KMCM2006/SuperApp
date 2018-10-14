import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../entities/category';
import { CategoryProvider } from '../../providers/category/category';


@IonicPage()
@Component({
  selector: 'page-create-category',
  templateUrl: 'create-category.html',
})
export class CreateCategoryPage {

  category = new Category;
  categoryForm: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewController: ViewController,
              public formBuilder: FormBuilder,
              public categoryProvider: CategoryProvider) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  async saveCategoryForm() {
    this.category.name = this.category.name.toUpperCase();
    await this.categoryProvider.saveCategory(this.category);
    this.afterSaveCategory();
  }

  afterSaveCategory() {
    this.navCtrl.pop();
  }
}