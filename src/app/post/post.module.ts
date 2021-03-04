import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PostPage } from './post.page';
import { PostResolver } from './post.resolver';

const routes: Routes = [
  {
    path: '',
    component: PostPage,
    resolve: {
      data: PostResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PostPage],
  providers: [PostResolver]
})
export class PostPageModule {}
