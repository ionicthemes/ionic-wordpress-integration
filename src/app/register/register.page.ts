import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { WordpressService } from '../services/wordpress.service';
import { AuthenticationService } from '../services/authentication.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required)
    });
  }

  goToLogIn() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    const username = 'YOUR_USER_NAME'; // this should be an administrator Username
    const password = 'YOUR_PASSWORD'; // this should be an administrator Password

    // only authenticated administrators can create users
    this.authenticationService.doLogin(username, password)
    .pipe(
      catchError(error => of(error))
    )
    .subscribe(
      res => {
        if (res.error) {
          this.errorMessage = "Only authenticated administrators can create users";
        }
        else {
          const userData = {
            username: this.registerForm.value.username,
            name: this.registerForm.value.displayName,
            email: this.registerForm.value.email,
            password: this.registerForm.value.password
          };
          this.authenticationService.doRegister(userData, res['token'])
          .pipe(
            catchError(error => of(error))
          )
          .subscribe(
            (result) => {
              if (res.error) {
                this.errorMessage = "Only authenticated administrators can create users";
              } else {
                this.successMessage = 'Account created successfully. Please log in.';
              }
            }
          );
        }
      },
      err => {
        console.log(err);
      }
    )
  }
}
