import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  constructor(public http: HttpClient){}

  getPost(postId: any){
    return this.http.get(
      environment.wordpress.api_url
      + "posts/" + postId)
  }

  getRecentPosts(categoryId: any, page: number = 1) {
    // if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";

    return this.http.get(
      environment.wordpress.api_url
      + 'posts?page=' + page
      + '&orderby=modified' // order by last modified date
      + category_url)
    .pipe(
      map((posts: []) => {
        posts.forEach((post:any) => {
          // we remove the "read more" link that the excerpt contains.
          // this is optional, you can remove this line if you want.
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
        })
        return posts;
      })
    )
  }

  getComments(postId:number, page:number = 1) {
    return this.http.get(
      environment.wordpress.api_url
      + "comments?post=" + postId
      + '&page=' + page)
  }

  getAuthor(author) {
    return this.http.get(environment.wordpress.api_url + "users/" + author)
  }

  getPostCategories(post) {
    let observableBatch = [];
    post.categories.forEach((category: number) => {
      observableBatch.push(this.getCategory(category));
    });

    return forkJoin(observableBatch);
  }

  getCategory(category: number) {
    return this.http.get(environment.wordpress.api_url + "categories/" + category)
  }

  createComment(postId: number, user: any, comment: string) {
    let header: HttpHeaders = new HttpHeaders().append('Authorization', 'Bearer ' + user.token);
    return this.http.post(environment.wordpress.api_url + "comments?token=" + user.token, {
      author_name: user.displayname,
      author_email: user.email,
      post: postId,
      content: comment
    },{ headers: header })
  }
}
