import { Injectable } from '@angular/core';
import { getRepository, Repository } from 'typeorm';
import { Category } from '../../entities/category';

@Injectable()
export class CategoryProvider {

  categoryRepository: any;

  constructor() {
    this.categoryRepository = getRepository('category') as Repository<Category>;
  }

  async saveCategory(category: Category) {
    await this.categoryRepository.save(category);
  }

  async getCategories() {
    let categories = await this.categoryRepository.createQueryBuilder('category')
                                            .orderBy('category.id', 'ASC')
                                            .getMany();
    return categories;
  }

  async getCategoryById(category_id: number) {
    let category = await this.categoryRepository.createQueryBuilder('category')
                                          .where("category.id = :id", {id: category_id})
                                          .getOne();
    return category;                                          
  }
  
  async countCategories() {
    let count = await this.categoryRepository.createQueryBuilder('category')
                                                .orderBy('category.id', 'ASC')
                                                .getCount();
    return count;
  }

  async deleteCategory(category_id: number) {
    await this.categoryRepository.createQueryBuilder()
                                  .delete()
                                  .from(Category)
                                  .where("category.id = :id", { id: category_id })
                                  .execute();
  }
  
  async updateCategory(category: Category) {
    await this.categoryRepository.createQueryBuilder()
                                  .update('category')
                                  .set({ name: category.name })
                                  .where("category.id = :id", {id: category.id})
                                  .execute();
  }
}
