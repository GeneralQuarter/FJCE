import { Component } from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {AuthProvider} from "../../providers/auth/auth";

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

  constructor(private auth: AngularFireAuth,
              private authProvider: AuthProvider) {
    this.auth.authState.subscribe((user: firebase.User) => {
      this.authProvider.authNotifier.next(!!user);
    });
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
