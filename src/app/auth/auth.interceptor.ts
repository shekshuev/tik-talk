import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { TokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken;

  if (isRefreshing$.value) {
    return refreshAndProceed(authService, req, next);
  }

  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 403) {
        return refreshAndProceed(authService, req, next);
      }

      return throwError(error);
    })
  );
};

const refreshAndProceed = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);
    return authService.refreshAuthToken().pipe(
      switchMap((token: TokenResponse) => {
        return next(addToken(req, token.access_token)).pipe(
          tap(() => isRefreshing$.next(false))
        );
      })
    );
  } else {
    if (req.url.includes('refresh')) {
      return next(addToken(req, authService.accessToken!));
    }

    return isRefreshing$.pipe(
      filter((isRefreshing) => !isRefreshing),
      switchMap(() => {
        return next(addToken(req, authService.accessToken!));
      })
    );
  }
};

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
