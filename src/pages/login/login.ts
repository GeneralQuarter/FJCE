import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {TabsPage} from "../tabs/tabs";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;
  errorMessage: string;
  loading: boolean;
  logout: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AngularFireAuth) {
    this.logout = !!this.navParams.get("logout");
    this.auth.authState.subscribe((user: firebase.User) => {
      if (!user) {
        return;
      }
      this.goToApp();
    });
  }

  private goToApp() {
    if (!this.logout) {
      this.navCtrl.setRoot(TabsPage);
    } else {
      this.logout = false;
      this.auth.auth.signOut();
    }
  }

  signIn() {
    if (this.email && this.password) {
      this.loading = true;
      this.auth.auth.signInWithEmailAndPassword(this.email, this.password)
        .catch(err => {
          this.errorMessage = err.message;
          this.loading = false;
        })
    } else {
      this.errorMessage = "Veuillez entrer un email et un mot de passe";
    }
  }

}
