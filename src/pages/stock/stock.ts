import { Component } from '@angular/core';
import {ModalController} from 'ionic-angular';
import {RawMaterial, RawMaterialProvider} from "../../providers/raw-material/raw-material";
import {Observable} from "rxjs/Observable";
import {NewStockPage} from "../new-stock/new-stock";
import 'rxjs/add/operator/do'

/**
 * Generated class for the StockPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {
  rawMaterials: Observable<RawMaterial[]>;
  loading: boolean;

  constructor(private rawMaterialProvider: RawMaterialProvider,
              public modalCtrl: ModalController) {
    this.loading = true;
    this.rawMaterials = this.rawMaterialProvider.getRawMaterials().do(
      () => { this.loading = false;},
      () => { this.loading = false;}
    );
  }

  searchRawMaterials(event: any) {
    this.rawMaterials = this.rawMaterialProvider.getRawMaterials();
    let searchName: string = event.target.value;
    if (searchName && searchName.trim() !== '') {
      this.rawMaterials = this.rawMaterialProvider.getRawMaterials(searchName);
    }
  }

  openAddNewStockModal(rawMaterial?: any) {
    let modal = this.modalCtrl.create(NewStockPage, {
      rawMaterial: rawMaterial
    });
    modal.present();
  }

}
