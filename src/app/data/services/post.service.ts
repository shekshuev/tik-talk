import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Post, PostCreateDto } from '../interfaces/post.interface';

@Injectable({ providedIn: 'root' })
export class PostService {
  #http = inject(HttpClient);
  #baseApiUrl = 'https://icherniakov.ru/yt-course';

  createPost(dto: PostCreateDto) {
    return this.#http.post<Post>(`${this.#baseApiUrl}/post/`, dto);
  }
}
