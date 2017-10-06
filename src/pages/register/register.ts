import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { PostPage } from '../post/post'
import 'rxjs/add/operator/map';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as Config from '../../config';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  register_form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public http: Http) {
  }

  ionViewWillLoad() {
    this.register_form = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }

  onSubmit(values){
    this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token',{
      username: 'aa',
      password: 'aa'
    })
    .subscribe(
      res => {
        this.http.post(Config.WORDPRESS_REST_API_URL + 'users?token=' + res.json().token,{
          username: values.username,
          name: values.displayName,
          email: values.email,
          password: values.password
        })
        .subscribe(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        )
      },
      err => {
        console.log(err);
      }
    )
  }

}
