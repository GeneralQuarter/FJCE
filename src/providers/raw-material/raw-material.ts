import { Injectable } from '@angular/core'
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import 'rxjs/add/operator/map'
import {Observable} from "rxjs/Observable";

/*
  Generated class for the RawMaterialProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

export interface RawMaterial {
  $key?: string,
  name: string,
  ingredients?: {[key: string]: number}[]
}

@Injectable()
export class RawMaterialProvider {
  rawMaterials: FirebaseListObservable<RawMaterial[]>;

  constructor(db: AngularFireDatabase) {
    this.rawMaterials = db.list("/stock");
  }

  getRawMaterials(search?: string, onlyComposed?: boolean): Observable<RawMaterial[]> {
    if (search || onlyComposed) {
      return this.rawMaterials
        .map(_rawMaterials => _rawMaterials.filter(rawMaterial => {
          let composed: boolean = onlyComposed ? rawMaterial.ingredients : true;
          let equalSearch: boolean = search ? rawMaterial.name.toLowerCase().indexOf(search.toLowerCase()) > -1 : true;
          return composed && equalSearch;
        }));
    } else {
      return this.rawMaterials;
    }
  }

  addRawMaterial(rawMaterial: RawMaterial) {
    this.rawMaterials.push(rawMaterial);
  }

  deleteRawMaterial(rawMaterial: RawMaterial) {
    if (rawMaterial.$key) {
      this.rawMaterials.remove(rawMaterial.$key);
    }
  }

  updateRawMaterial(rawMaterial: RawMaterial) {
    if (rawMaterial.ingredients) {
      this.rawMaterials.update(rawMaterial.$key, {name: rawMaterial.name, ingredients: rawMaterial.ingredients});
    } else {
      this.rawMaterials.update(rawMaterial.$key, {name: rawMaterial.name});
    }
  }

}
