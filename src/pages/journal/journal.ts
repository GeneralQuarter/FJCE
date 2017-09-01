import { Component } from '@angular/core';
import {ModalController, NavParams} from 'ionic-angular';
import {EditProductionPage} from "../edit-production/edit-production";
import {AngularFireDatabase} from "angularfire2/database";
import {RecipeProvider} from "../../providers/recipe/recipe";
import {RawMaterialProvider} from "../../providers/raw-material/raw-material";
import 'rxjs/add/operator/do'
import {Observable} from "rxjs/Observable";
import {EditStockModificationPage} from "../edit-stock-modification/edit-stock-modification";
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the JournalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
*/

@Component({
  selector: 'page-journal',
  templateUrl: 'journal.html',
})

export class JournalPage {
  currentDate: string;
  recipeNames: {[key: string]: string}[];
  materialNames: {[key: string]: string}[];
  recipesProduced: Observable<any[]>;
  stockProduced: Observable<any[]>;
  stockModifications: Observable<any[]>;
  loadingRecipesProduced: boolean;
  loadingStockProduced: boolean;
  loadingStockModifications: boolean;

  private sub1: Subscription;
  private sub2: Subscription;

  constructor(public navParams: NavParams,
              public modalCtrl: ModalController,
              private db: AngularFireDatabase,
              private recipeProvider: RecipeProvider,
              private rawMaterialProvider: RawMaterialProvider) {
  }

  ionViewWillEnter() {
    this.recipeNames = [];
    this.sub1 = this.recipeProvider.getRecipes().subscribe(data => {
      for (const recipe of data) {
        this.recipeNames[recipe.$key] = recipe.name;
      }
    });
    this.materialNames = [];
    this.sub2 = this.rawMaterialProvider.getRawMaterials().subscribe(data => {
      for (const rawMaterial of data) {
        this.materialNames[rawMaterial.$key] = rawMaterial.name;
      }
    });
    this.currentDate = new Date().toISOString();
    this.updateLists();
  }

  ionViewDidLeave() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  updateDate() {
    this.updateLists();
  }

  addDayToDate(day: number) {
    let date: Date = new Date(this.currentDate);
    date.setDate(date.getDate() + day);
    this.currentDate = date.toISOString();
  }

  private getDateKey(): string {
    let date: Date = new Date(this.currentDate);
    return date.toLocaleDateString("fr").replace(/\//g, "-");
  }

  openEditProductionModal() {
    let modal = this.modalCtrl.create(EditProductionPage, {
      dateKey: this.getDateKey()
    });
    modal.present();
  }

  openEditStockModificationModal() {
    let modal = this.modalCtrl.create(EditStockModificationPage, {
      dateKey: this.getDateKey()
    });
    modal.present();
  }

  private updateLists() {
    this.loadingRecipesProduced = true;
    this.loadingStockProduced = true;
    this.loadingStockModifications = true;
    this.recipesProduced = this.db.list("/journal/" + this.getDateKey() + "/production/recipes").do(
      () => this.loadingRecipesProduced = false,
      () => this.loadingRecipesProduced = false
    );
    this.stockProduced = this.db.list("/journal/" + this.getDateKey() + "/production/stock").do(
      () => this.loadingStockProduced = false,
      () => this.loadingStockProduced = false
    );
    this.stockModifications = this.db.list("/journal/" + this.getDateKey() + "/stock_modification").do(
      () => this.loadingStockModifications = false,
      () => this.loadingStockModifications = false,
    )
  }

  getValues(object: any) {
    return Object.keys(object).map(key => object[key]);
  }
}
