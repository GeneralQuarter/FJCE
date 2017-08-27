import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the RecipeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
export interface Recipe {
  $key?: string,
  name: string,
  ingredients: {[key: string]: number}[]
}

@Injectable()
export class RecipeProvider {
  recipes: FirebaseListObservable<Recipe[]>;

  constructor(db: AngularFireDatabase) {
    this.recipes = db.list("/recipes");
  }

  getRecipes(search?: string): Observable<Recipe[]> {
    if (search) {
      return this.recipes
        .map(_recipes => _recipes.filter(recipe => recipe.name.toLowerCase().indexOf(search.toLowerCase()) > -1));
    } else {
      return this.recipes;
    }
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }

  deleteRecipe(recipe: Recipe) {
    if (recipe.$key) {
      this.recipes.remove(recipe.$key);
    }
  }

  updateRecipe(recipe: Recipe) {
    this.recipes.update(recipe.$key, {name: recipe.name, ingredients: recipe.ingredients});
  }

}
