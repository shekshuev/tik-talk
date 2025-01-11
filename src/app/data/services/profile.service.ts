import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Pageable } from '../interfaces/pageable.interface';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);

  me = signal<Profile | null>(null);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  constructor() {}

  getTestAccount() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.http
      .get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(tap((res) => this.me.set(res)));
  }

  getAccount(id: string) {
    return this.http
      .get<Profile>(`${this.baseApiUrl}account/${id}`)
      .pipe(tap((res) => this.me.set(res)));
  }

  getSubscribersShortList(count: number = 3) {
    return this.http
      .get<Pageable<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(map((res) => res.items.slice(0, count)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch(`${this.baseApiUrl}account/me`, profile);
  }
}
