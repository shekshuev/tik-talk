import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';
import {
  CommentCreateDto,
  Post,
  PostCreateDto,
} from '../interfaces/post.interface';

@Injectable({ providedIn: 'root' })
export class PostService {
  #http = inject(HttpClient);
  #baseApiUrl = 'https://icherniakov.ru/yt-course';

  posts = signal<Post[]>([]);

  createPost(dto: PostCreateDto) {
    return this.#http.post<Post>(`${this.#baseApiUrl}/post/`, dto).pipe(
      switchMap(() => {
        return this.fetchPosts();
      })
    );
  }

  createComment(dto: CommentCreateDto) {
    return this.#http.post<Comment>(`${this.#baseApiUrl}/comment/`, dto);
  }

  getCommentByPostId(postId: number) {
    return this.#http
      .get<Post>(`${this.#baseApiUrl}/post/${postId}`)
      .pipe(map((response) => response.comments));
  }

  fetchPosts() {
    return this.#http
      .get<Post[]>(`${this.#baseApiUrl}/post/`)
      .pipe(tap((result) => this.posts.set(result)));
  }
}
