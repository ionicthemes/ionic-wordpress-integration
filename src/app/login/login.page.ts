import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    private router: Router,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('iamdemo', Validators.required),
      password: new FormControl('iamdemo', Validators.required)
    });
  }

  async doLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.authenticationService.doLogin(this.loginForm.value.username, this.loginForm.value.password)
    .subscribe(res => {
      this.authenticationService.setUser({
        token: res['token'],
        username: this.loginForm.value.username,
        displayname: res['user_display_name'],
        email: res['user_email']
      });

      loading.dismiss();
      this.router.navigate(['/posts']);
    },
    err => {
      loading.dismiss();
      this.errorMessage = "Invalid credentials";
    })
  }
}
