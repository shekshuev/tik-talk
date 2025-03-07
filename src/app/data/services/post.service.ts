import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { Post, PostCreateDto } from '../interfaces/post.interface';

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

  fetchPosts() {
    return this.#http
      .get<Post[]>(`${this.#baseApiUrl}/post/`)
      .pipe(tap((result) => this.posts.set(result)));
  }
}
