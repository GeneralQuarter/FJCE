import { Component } from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {RawMaterial, RawMaterialProvider} from "../../providers/raw-material/raw-material";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do'
import {EditStockModificationDetailPage} from "../edit-stock-modification-detail/edit-stock-modification-detail";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the EditStockModificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-stock-modification',
  templateUrl: 'edit-stock-modification.html',
})
export class EditStockModificationPage {
  rawMaterials: Observable<RawMaterial[]>;
  stockModifications: {[key: string]: number};
  dateKey: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              private rawMaterialProvider: RawMaterialProvider,
              private db: AngularFireDatabase) {
    this.rawMaterials = this.rawMaterialProvider.getRawMaterials();
    this.dateKey = this.navParams.get("dateKey");
  }

  searchRawMaterials(event: any) {
    this.rawMaterials = this.rawMaterialProvider.getRawMaterials();
    let searchName: string = event.target.value;
    if (searchName && searchName.trim() !== '') {
      this.rawMaterials = this.rawMaterialProvider.getRawMaterials(searchName);
    }
  }

  ngOnInit() {
    this.stockModifications = {};
    this.db.list("/journal/" + this.dateKey + "/stock_modification").subscribe(stockModifications => {
      for (const stockModification of stockModifications) {
        this.stockModifications[stockModification.$key] = Object.keys(stockModification).length;
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openEditStockModificationDetail(material: RawMaterial) {
    let modal = this.modalCtrl.create(EditStockModificationDetailPage, {
      rawMaterial: material,
      dateKey: this.dateKey
    });
    modal.present();
  }

}
