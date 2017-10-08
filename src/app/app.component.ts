import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authenticationService: AuthenticationService
  ) {
    platform.ready().then(() => {
      authenticationService.getUser()
      .then(
        data => {
          authenticationService.validateAuthToken(data.token)
          .subscribe(
            res => this.rootPage = HomePage,
            err =>   this.rootPage = LoginPage
          )
        },
        err => this.rootPage = LoginPage
      );
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
