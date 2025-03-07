import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PostService } from '../../../data/services/post.service';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  feed = this.postService.posts;

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }
}
