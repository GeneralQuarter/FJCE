import { Component } from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';

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
  language: string;

  constructor(private auth: AngularFireAuth,
              private translateService: TranslateService,
              private storage: Storage) {
    this.storage.get('lang').then(lang => {
      if (lang) {
        this.language = lang;
      } else {
        this.language = 'fr';
      }
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
      this.translateService.get("LOGIN.EMAIL_PASSWORD_EMPTY_ERROR").subscribe(text => {
        this.errorMessage = text;
      });
    }
  }

  changeLanguage() {
    this.storage.set('lang', this.language).then(() => {
      this.translateService.use(this.language);
    });
  }

}
