import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { WordpressService } from '../services/wordpress.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PostsResolver implements Resolve<any> {

  constructor(private wordpressService: WordpressService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const categoryId = route.queryParams['categoryId'];
    const categoryTitle = route.queryParams['title'];

    return this.wordpressService.getRecentPosts(categoryId)
    .pipe(
      map((posts) => {
        return { posts, categoryTitle, categoryId };
      })
    )
  }
}
