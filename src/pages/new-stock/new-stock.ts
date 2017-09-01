import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from 'ionic-angular';
import {RawMaterial, RawMaterialProvider} from "../../providers/raw-material/raw-material";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the NewStockPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-stock',
  templateUrl: 'new-stock.html',
})
export class NewStockPage {

  rawMaterial: RawMaterial;
  rawMaterials: Observable<RawMaterial[]>;
  ingredients: RawMaterial[];
  private sub: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private rawMaterialProvider: RawMaterialProvider) {
  }

  ngOnInit() {
    this.rawMaterial = this.navParams.get("rawMaterial");
    this.ingredients = [];
    if (!this.rawMaterial) {
      this.rawMaterial = {
        name: ""
      };
    }
    this.rawMaterials = this.rawMaterialProvider.getRawMaterials();
    if (!this.rawMaterial.ingredients && !this.rawMaterial.$key) {
      this.rawMaterial.ingredients = [];
    } else {
      this.sub = this.rawMaterials
        .subscribe(_rawMaterials => {
          for (const rawMaterial of _rawMaterials) {
            for (const ingredientKey in this.rawMaterial.ingredients) {
              if (rawMaterial.$key === ingredientKey) {
                this.ingredients.push(rawMaterial);
              }
            }
          }
        });
    }
  }

  ionViewDidLeave() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addOrUpdateRawMaterial() {
    if (!this.rawMaterial.$key) {
      this.rawMaterialProvider.addRawMaterial(this.rawMaterial);
    } else {
      this.rawMaterialProvider.updateRawMaterial(this.rawMaterial);
    }

    this.dismiss();
  }

  deleteRawMaterial() {
    let alert = this.alertCtrl.create({
      title: 'Supprimer ' + this.rawMaterial.name,
      message: 'Cette action est irréversible',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.rawMaterialProvider.deleteRawMaterial(this.rawMaterial);
            this.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  compareFn(e1: RawMaterial, e2: RawMaterial): boolean {
    return e1 && e2 ? e1.$key === e2.$key : e1 === e2;
  }

  deleteOrphanRawMaterial() {
    for (const ingredientKey in this.rawMaterial.ingredients) {
      let found: boolean = false;
      for (const rawMaterial of this.ingredients) {
        if (rawMaterial.$key === ingredientKey) {
          found = true;
        }
      }
      if (!found) {
        delete this.rawMaterial.ingredients[ingredientKey];
      }
    }
  }

}
