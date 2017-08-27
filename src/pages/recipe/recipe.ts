import { Component } from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Recipe, RecipeProvider} from "../../providers/recipe/recipe";
import 'rxjs/add/operator/do'
import {NewRecipePage} from "../new-recipe/new-recipe";

/**
 * Generated class for the RecipePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage {
  loading: boolean;
  empty: boolean;
  recipes: Observable<Recipe[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private recipeProvider: RecipeProvider,
              public modalCtrl: ModalController) {
    this.loading = true;
    this.recipes = this.recipeProvider.getRecipes().do(
      () => { this.loading = false; },
      () => { this.loading = false; }
    );
  }

  searchRecipes(event) {
    this.recipes = this.recipeProvider.getRecipes();
    let searchName: string = event.target.value;
    if (searchName && searchName.trim() !== '') {
      this.recipes = this.recipeProvider.getRecipes(searchName);
    }
  }

  openAddNewRecipeModal(recipe?: Recipe) {
    let modal = this.modalCtrl.create(NewRecipePage, {
      recipe: recipe
    });
    modal.present();
  }

}
