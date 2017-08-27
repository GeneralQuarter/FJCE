import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {RawMaterial} from "../../providers/raw-material/raw-material";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";

/**
 * Generated class for the EditStockModificationDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
interface StockModification {
  $key?: string,
  quantity: number,
  comment: string
}

@Component({
  selector: 'page-edit-stock-modification-detail',
  templateUrl: 'edit-stock-modification-detail.html',
})
export class EditStockModificationDetailPage {
  stockModifications: FirebaseListObservable<StockModification[]>;
  dateKey: string;
  rawMaterial: RawMaterial;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private db: AngularFireDatabase) {
    this.rawMaterial = this.navParams.get("rawMaterial");
    this.dateKey = this.navParams.get("dateKey");
    this.stockModifications = this.db.list("/journal/" + this.dateKey + "/stock_modification/" + this.rawMaterial.$key);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addStockModification() {
    this.stockModifications.push({
      quantity: 0,
      comment: ""
    });
  }

  deleteStockModification(stockModification: StockModification) {
    if (stockModification.$key) {
      this.stockModifications.remove(stockModification.$key);
    }
  }

  updateStockModification(stockModification: StockModification) {
    if (stockModification.$key) {
      this.stockModifications.update(stockModification.$key, {
        quantity: stockModification.quantity,
        comment: stockModification.comment
      });
    }
  }

}
