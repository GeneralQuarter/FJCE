import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Recipe, RecipeProvider} from "../../providers/recipe/recipe";
import {RawMaterial, RawMaterialProvider} from "../../providers/raw-material/raw-material";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do'
import {AngularFireDatabase} from "angularfire2/database";
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the EditProductionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-production',
  templateUrl: 'edit-production.html',
})
export class EditProductionPage {
  dateKey: string;
  recipes: Observable<Recipe[]>;
  loadingRecipes: boolean;
  recipesProduced: {[key: string]: number}[];

  composedMaterials: Observable<RawMaterial[]>;
  loadingComposedMaterials: boolean;
  composedMaterialsProduced: {[key: string]: number}[];

  private sub: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private recipeProvider: RecipeProvider,
              private rawMaterialProvider: RawMaterialProvider,
              private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.dateKey = this.navParams.get("dateKey");

    this.recipesProduced = [];
    this.composedMaterialsProduced = [];

    this.loadingRecipes = true;
    this.loadingComposedMaterials = true;

    this.recipes = this.recipeProvider.getRecipes().do(
      () => this.loadingRecipes = false,
      () => this.loadingRecipes = false
    );
    this.composedMaterials = this.rawMaterialProvider.getRawMaterials(null, true).do(
      () => this.loadingComposedMaterials = false,
      () => this.loadingComposedMaterials = false
    );

    this.sub = this.db.object("/journal/" + this.dateKey + "/production").subscribe(data => {
      if (data.recipes) {
        this.recipesProduced = data.recipes;
      }
      if (data.stock) {
        this.composedMaterialsProduced = data.stock;
      }
    });
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  searchProduction(event) {
    this.recipes = this.recipeProvider.getRecipes();
    this.composedMaterials = this.rawMaterialProvider.getRawMaterials(null, true);

    let searchName: string = event.target.value;
    if (searchName && searchName.trim() !== '') {
      this.recipes = this.recipeProvider.getRecipes(searchName);
      this.composedMaterials = this.rawMaterialProvider.getRawMaterials(searchName, true);
    }
  }

  saveProduction() {
    for (const key in this.recipesProduced) {
      if (this.recipesProduced[key].valueOf() === "") {
        delete this.recipesProduced[key];
      }
    }
    for (const key in this.composedMaterialsProduced) {
      if (this.composedMaterialsProduced[key].valueOf() === "") {
        delete this.composedMaterialsProduced[key];
      }
    }
    this.db.database.ref("/journal/" + this.dateKey + "/production/recipes").set(this.recipesProduced);
    this.db.database.ref("/journal/" + this.dateKey + "/production/stock").set(this.composedMaterialsProduced);
    //this.productionDb.set("recipes", this.recipesProduced); // TODO - replace when rc2 of angularfire2
    //this.productionDb.set("composed_materials", this.composedMaterialsProduced);
    this.dismiss();
  }

}
