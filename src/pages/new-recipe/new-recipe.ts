import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from 'ionic-angular';
import {Recipe, RecipeProvider} from "../../providers/recipe/recipe";
import {RawMaterial, RawMaterialProvider} from "../../providers/raw-material/raw-material";
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the NewRecipePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-recipe',
  templateUrl: 'new-recipe.html',
})
export class NewRecipePage {

  recipe: Recipe;
  ingredients: RawMaterial[];
  rawMaterials: Observable<RawMaterial[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private rawMaterialProvider: RawMaterialProvider,
              private alertCtrl: AlertController,
              private recipeProvider: RecipeProvider) {
    this.recipe = this.navParams.get("recipe");
    if(!this.recipe) {
      this.recipe = {
        name: '',
        ingredients: []
      }
    }
    this.ingredients = [];
    if (!this.recipe.ingredients) {
      this.recipe.ingredients = [];
    }
    this.rawMaterials = this.rawMaterialProvider.getRawMaterials();
    this.rawMaterials
      .subscribe(_rawMaterials => {
        for (const rawMaterial of _rawMaterials) {
          for (const ingredientKey in this.recipe.ingredients) {
            if (rawMaterial.$key === ingredientKey) {
              this.ingredients.push(rawMaterial);
            }
          }
        }
      });

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addOrUpdateRecipe() {
    if (this.isFormValid()) {
      if (!this.recipe.$key) {
        this.recipeProvider.addRecipe(this.recipe);
      } else {
        this.recipeProvider.updateRecipe(this.recipe);
      }

      this.dismiss();
    }
  }

  isFormValid(): boolean {
    return this.recipe.name.trim() !== "" && Object.keys(this.recipe.ingredients).length > 0;
  }

  deleteRecipe() {
    let alert = this.alertCtrl.create({
      title: 'Supprimer ' + this.recipe.name,
      message: 'Cette action est irréversible',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.recipeProvider.deleteRecipe(this.recipe);
            this.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  compareFn2(e1: RawMaterial, e2: RawMaterial): boolean {
    return e1 && e2 ? e1.$key === e2.$key : e1 === e2;
  }

  deleteOrphanRawMaterial() {
    for (const ingredientKey in this.recipe.ingredients) {
      let found: boolean = false;
      for (const rawMaterial of this.ingredients) {
        if (rawMaterial.$key === ingredientKey) {
          found = true;
        }
      }
      if (!found) {
        delete this.recipe.ingredients[ingredientKey];
      }
    }
  }
}
