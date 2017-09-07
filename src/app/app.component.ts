import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from "../pages/login/login";
import {TabsPage} from "../pages/tabs/tabs";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {AngularFireAuth} from "angularfire2/auth";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              auth: AngularFireAuth,
              translateService: TranslateService,
              storage: Storage) {
    auth.authState.subscribe((authed) => {
      if (!!authed) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
    });
    translateService.setDefaultLang('fr');
    storage.get('lang').then(lang => {
      if (lang) {
        translateService.use(lang);
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
