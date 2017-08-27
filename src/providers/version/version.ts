import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the VersionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class VersionProvider {
  version: string;

  constructor(public http: Http) {
  }

  getVersion(): Promise<string> {
    if (this.version) {
      return Promise.resolve(this.version);
    } else {
      return new Promise(resolve => {
        this.http.get('assets/version.txt').subscribe(res => {
          this.version = res.text();
          resolve(this.version);
        });
      });
    }
  }

}
