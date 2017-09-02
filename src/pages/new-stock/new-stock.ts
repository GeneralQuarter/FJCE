import {Component, OnInit} from '@angular/core';
import {AlertController, NavParams, ViewController} from 'ionic-angular';
import {RawMaterial, RawMaterialProvider} from "../../providers/raw-material/raw-material";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {TranslateService} from "@ngx-translate/core";

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
export class NewStockPage implements OnInit{

  rawMaterial: RawMaterial;
  rawMaterials: Observable<RawMaterial[]>;
  ingredients: RawMaterial[];
  private sub: Subscription;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private rawMaterialProvider: RawMaterialProvider,
              private translateService: TranslateService) {
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
    this.translateService.get(['NEW_STOCK.TITLE.DELETE', 'IRREVERSIBLE_ACTION', 'CANCEL', 'DELETE'], this.rawMaterial).subscribe( translation => {
      let alert = this.alertCtrl.create({
        title: translation['NEW_STOCK.TITLE.DELETE'],
        message: translation['IRREVERSIBLE_ACTION'],
        buttons: [
          {
            text: translation['CANCEL'],
            role: 'cancel'
          },
          {
            text: translation['DELETE'],
            handler: () => {
              this.rawMaterialProvider.deleteRawMaterial(this.rawMaterial);
              this.dismiss();
            }
          }
        ]
      });
      alert.present();
    });
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
