import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers } from '@angular/http';
import * as Config from '../config';

@Injectable()
export class AuthenticationService {

  constructor(
    public nativeStorage: NativeStorage,
    public http: Http
  ){}

  getUser(){
    return this.nativeStorage.getItem('User');
  }

  setUser(user){
    return this.nativeStorage.setItem('User', user);
  }

  logOut(){
    return this.nativeStorage.clear();
  }

  doLogin(username, password){
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token',{
      username: username,
      password: password
    })
  }

  validateAuthToken(token){
    let header : Headers = new Headers();
    header.append('Authorization','Basic ' + token);
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token/validate?token=' + token,
      {}, {headers: header})
  }
}
