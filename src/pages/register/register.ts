import { Component } from '@angular/core';
import { PostPage } from '../post/post';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as Config from '../../config';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  register_form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) {}

  ionViewWillLoad() {
    this.register_form = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }

  onSubmit(values){
    var username: 'aa'; // this should be an administrator Username
    var password: 'aa'; // this should be an administrator Password
    //only authenticated administrators can create users
    this.authenticationService.doLogin(username, password)
    .subscribe(
      res => {
        let user_data = {
          username: values.username,
          name: values.displayName,
          email: values.email,
          password: values.password
        };
        this.authenticationService.doRegister(user_data, res.json().token)
        .subscribe(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
      },
      err => {
        console.log(err);
      }
    )
  }

}
