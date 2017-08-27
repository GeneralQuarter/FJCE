import { Component } from '@angular/core';
import {App, NavParams} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/do'
import {VersionProvider} from "../../providers/version/version";

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user: firebase.User;
  version: Promise<string>;
  environment: string;

  constructor(public app: App,
              public navParams: NavParams,
              private auth: AngularFireAuth,
              private versionProvider: VersionProvider) {
    this.auth.authState.subscribe( user => this.user = user);
    this.version = this.versionProvider.getVersion();
    this.environment = process.env.IONIC_ENV;
  }

  logOut() {
    this.app.getRootNavs()[0].setRoot(LoginPage, {
      logout: true
    });
  }

}
