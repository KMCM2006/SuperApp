import { Injectable } from '@angular/core';
import { getRepository, Repository } from 'typeorm';
import { Category } from '../../entities/category';

@Injectable()
export class CategoryProvider {

  categoryRepository: any;

  constructor() {
    this.categoryRepository = getRepository('category') as Repository<Category>;
  }

  async saveCategory(category: Category): Promise<Boolean> {
    let result: Boolean;
    try {
      await this.categoryRepository.save(category);
      result = true;
    } catch (error) {
      console.error(error);
      result = false;
    }
    return result;
  }

  async getCategories(): Promise<Array<Category>> {
    let result: Array<Category>;
    try {
      result = await this.categoryRepository.createQueryBuilder('category')
                                            .orderBy('id', 'ASC')
                                            .getMany();
    } catch (error) {
      console.error(error);
      result = null;
    }
    return result;
  }

  async getCategoryById(category_id: number): Promise<Category> {
    let result: Category;
    try {
      result = await this.categoryRepository.createQueryBuilder('category')
                                            .where("id = :id", {id: category_id})
                                            .getOne();
    } catch (error) {
      console.error(error);
      result = null;
    }
    return result;
  }

  async countCategories(): Promise<number>{
    let result: number;
    try {
      result = await this.categoryRepository.createQueryBuilder('category')
                                            .orderBy('id', 'ASC')
                                            .getCount();
    } catch (error) {
      console.error(error);
      result = null;
    }
    return result;
  }

  async deleteCategory(category_id: number): Promise<Boolean> {
    let result: Boolean;
    try {
      await this.categoryRepository.createQueryBuilder()
                                    .delete()
                                    .from(Category)
                                    .where("id = :id", { id: category_id })
                                    .execute();
      result = true;
    } catch (error) {
      console.error(error);
      result = false;
    }
    return result;
  }

  async updateCategory(category: Category): Promise<Boolean> {
    let result: Boolean;
    try {
      await this.categoryRepository.createQueryBuilder()
                                    .update('category')
                                    .set({ name: category.name })
                                    .where("id = :id", {id: category.id})
                                    .execute();
      result = true;
    } catch (error) {
      console.error(error);
      result = false;
    }
    return result;
  }
}
