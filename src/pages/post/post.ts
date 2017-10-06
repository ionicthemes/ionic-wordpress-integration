import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Config from '../../config';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  post: any;
  user: string;
  comments: Array<any> = new Array<any>();
  categories: Array<any>;
  morePagesAvailable: boolean = true;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: Http,
    public nativeStorage: NativeStorage
  ) {

  }

  ionViewWillEnter(){
    this.morePagesAvailable = true;
    let loading = this.loadingCtrl.create();

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 2300);

    this.post = this.navParams.get('item');
    this.getUser(this.post.author);
    this.getCategories(this.post.categories);
    this.getComments(this.post.id);
  }

  getUser(author){
    this.http.get(Config.WORDPRESS_REST_API_URL + "users/" + author)
    .map(res => res.json())
    .subscribe(data => {
      this.user = data.name;
    });
  }

  getCategories(categories){
    this.categories = new Array<any>();
    for(let category of categories){
      this.http.get(Config.WORDPRESS_REST_API_URL + "categories/" + category)
      .map(res => res.json())
      .subscribe(data => {
        this.categories.push(data);
      });
    }
  }

  getComments(postID){
    this.http.get(Config.WORDPRESS_REST_API_URL + "comments?post=" + postID)
    .map(res => res.json())
    .subscribe(data => {
      this.comments = data;
    });
  }

  loadMoreComments(infiniteScroll) {
    let page = (this.comments.length/10) + 1;
    this.http.get(Config.WORDPRESS_REST_API_URL + "comments?page=" + page)
    .map(res => res.json())
    .subscribe(data => {
      for(let item of data){
        this.comments.push(item);
      }
      infiniteScroll.complete();
    }, err => {
      console.log(err);
      this.morePagesAvailable = false;
    })
  }

  getCategoryPosts(categoryID, categoryTitle){
    this.navCtrl.push(HomePage, {
      id: categoryID,
      title: categoryTitle
    })
  }

  createComment(){
    let user: any;
    let header : Headers = new Headers();
    this.nativeStorage.getItem('User')
    .then(res => {
      user = res;
      header.append('Authorization', 'Bearer ' + user.token);
      let alert = this.alertCtrl.create({
      title: 'Add a comment',
      inputs: [
        {
          name: 'comment',
          placeholder: 'Comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept',
          handler: data => {
            let loading = this.loadingCtrl.create();
            loading.present();
            this.http.post(Config.WORDPRESS_REST_API_URL + "comments?token=" + user.token, {
              author_name: user.displayname,
              author_email: user.email,
              post: this.post.id,
              content: data.comment
            },{ headers: header })
            .map(res => res.json())
            .subscribe(
              (data) => {
                console.log("ok", data);
                this.getComments(this.post.id);
                loading.dismiss();
              },
              (err) => {
                console.log("err", err);
                loading.dismiss();
              }
            );
          }
        }
      ]
    });
    alert.present();
    },
    err => {
      let alert = this.alertCtrl.create({
        title: 'Please login',
        message: 'You need to login in order to comment',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Login',
            handler: () => {
              this.navCtrl.push(LoginPage);
            }
          }
        ]
      });
    alert.present();
    });
  }
}
