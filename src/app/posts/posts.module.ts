import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PostsPage } from './posts.page';
import { PostsResolver } from './posts.resolver';

const routes: Routes = [
  {
    path: '',
    component: PostsPage,
    resolve: {
      data: PostsResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange' // because we use the same route for all posts and for category posts, we need to add this to refetch data 
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PostsPage],
  providers: [PostsResolver]
})
export class PostsPageModule {}
