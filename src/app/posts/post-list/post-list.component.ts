import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.modal';
import { PostsService } from '../posts.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  userIsAuth = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  constructor(
    public postsService: PostsService,
    public authSerice: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
    this.userIsAuth = this.authSerice.getIsAuth();
    this.authStatusSub = this.authSerice
      .getAuthStatusListener()
      .subscribe(isAuth => {
        this.userIsAuth = isAuth;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
