import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HomePage } from '../home/home'
import { RegisterPage } from '../register/register'
import 'rxjs/add/operator/map';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Config from '../../config';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login_form: FormGroup;
  error_message: string;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public formBuilder: FormBuilder,
    public nativeStorage: NativeStorage) {
  }

  ionViewWillLoad() {
    this.login_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.required)
    });
  }

  login(value){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token',{
      username: value.username,
      password: value.password
    })
    .subscribe( res => {
       console.log(res.json())
       this.nativeStorage.setItem('User',{
         token: res.json().token,
         username: value.username,
         displayname: res.json().user_display_name,
         email: res.json().user_email
       })
       loading.dismiss();
       this.navCtrl.setRoot(HomePage);
     },
     err => {
       loading.dismiss();
       this.error_message = "Invalid credentials. Try with username 'aa' password 'aa'.";
       console.log(err);
     })
  }

  skipLogin(){
    this.navCtrl.setRoot(HomePage);
  }

}
