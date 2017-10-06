import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { HomePage } from '../pages/home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  url:string = 'https://wordpress.startapplabs.com/blog/';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    nativeStorage: NativeStorage,
    http: Http
  ) {
    platform.ready().then(() => {
      nativeStorage.getItem('User')
      .then(
        data => {
          let header : Headers = new Headers();
          header.append('Authorization','Basic ' + data.token);
          http.post(this.url + 'wp-json/jwt-auth/v1/token/validate?token=' + data.token,{},{
            headers: header
          })
          .subscribe(
          res => {
            console.log(res);
            this.rootPage = HomePage;
          },
          err => {
            console.log(err);
            this.rootPage = LoginPage;
          })
        },
        err => {
          console.log(err);
          this.rootPage = LoginPage;
        }
      );
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
