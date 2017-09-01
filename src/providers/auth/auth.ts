import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {
  _authNotifier: ReplaySubject<Boolean>;

  constructor() {
    this._authNotifier = new ReplaySubject(1);
  }

  get authNotifier() {
    return this._authNotifier;
  }

}
