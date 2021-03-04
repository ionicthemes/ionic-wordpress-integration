import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  post: any;
  author: string;
  comments = [];
  categories = [];

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.route.data.subscribe(routeData => {
      const data = routeData['data'];
      this.post = data.post;
      this.author = data.author.name;
      this.categories = data.categories;
      this.comments = data.comments;
    })
  }

  getComments(){
    return this.wordpressService.getComments(this.post.id);
  }

  loadMoreComments(event) {
    const page = (this.comments.length/10) + 1;

    this.wordpressService.getComments(this.post.id, page)
    .subscribe((comments: []) => {
      this.comments.push(...comments);
      event.target.complete();
    }, err => {
      // there are no more comments available
      event.target.disabled = true;
    })
  }

  async createComment() {
    const loggedUser = await this.authenticationService.getUser();

    if (loggedUser) {
      let user = JSON.parse(loggedUser);

      // check if token is valid
      this.authenticationService.validateAuthToken(user.token)
      .pipe(
        catchError(error => of(error)),
        map(result => {
          if (result.error) {
            // token is expired
            this.openLogInAlert();
          }
          else {
            // user is logged in and token is valid
            this.openEnterCommentAlert(user);
          }
        })
      ).subscribe()
    } else {
      this.openLogInAlert();
    }
  }

  async openLogInAlert() {
    const alert = await this.alertController.create({
      header: 'Please login',
      message: 'You need to login in order to comment',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Login',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  async openEnterCommentAlert(user: any) {
    const alert = await this.alertController.create({
      header: 'Add a comment',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: 'Comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Accept',
          handler: async data => {
            const loading = await this.loadingController.create();
            await loading.present();

            this.wordpressService.createComment(this.post.id, user, data.comment)
            .subscribe(
              async (data) => {
                this.getComments().subscribe( async comments => {
                  const recentComments = Object.keys(comments).map(i => comments[i]);
                  this.comments = recentComments;
                  await loading.dismiss();
                });
              },
              async (err) => {
                await loading.dismiss();
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }
}
