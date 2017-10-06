import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { PostPage } from '../post/post';
import { LoginPage } from '../login/login';
import 'rxjs/add/operator/map';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Config from '../../config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	posts: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;

  categoryID: number;
  categoryTitle: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public nativeStorage: NativeStorage,
    public http: Http
  ) {}

  ionViewWillEnter() {
    this.nativeStorage.getItem('User')
    .then(
      data => this.loggedUser = true,
      error => this.loggedUser = false
    );
    this.morePagesAvailable = true;

    //if we are browsing a category
    this.categoryID = this.navParams.get('id');
    this.categoryTitle = this.navParams.get('title');

    if(!(this.posts.length > 0)){
      let loading = this.loadingCtrl.create();
      loading.present();
      let url_to_query = this.categoryID? ("posts?categories=" + this.categoryID) : 'posts';
      this.http.get(Config.WORDPRESS_REST_API_URL + url_to_query)
      .map(res => res.json())
      .subscribe(data => {
        for(let post of data){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          this.posts.push(post);
        }
        loading.dismiss();
      });
    }

  }

  postTapped(event, post) {
		this.navCtrl.push(PostPage, {
		  item: post
		});
  }

  doInfinite(infiniteScroll) {
    let page = (Math.ceil(this.posts.length/10)) + 1;
    let loading = true;
    let url_to_query = this.categoryID? ("posts?categories=" + this.categoryID + "&page=") : 'posts?page=';
    this.http.get(Config.WORDPRESS_REST_API_URL + url_to_query + page )
    .map(res => res.json())
    .subscribe(data => {
      for(let post of data){
        if(!loading){
          infiniteScroll.complete();
        }
        this.posts.push(post);
        loading = false;
      }
    }, err => {
      this.morePagesAvailable = false;
    })
  }

  logOut(){
    this.nativeStorage.clear()
    .then(
      res => this.navCtrl.push(LoginPage),
      err => console.log('Error in log out')
    )
  }

  logIn(){
    this.navCtrl.push(LoginPage);
  }
}
