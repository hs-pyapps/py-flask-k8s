import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NavService } from './nav.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TweetsService {
  constructor(
    private http: HttpClient,
    public navService: NavService
  ) {}

  getTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(environment.tweetsBaseUrl + "api/v1/tweets");

  }

  getTweetCategories(): Observable<Tag[]> {
    return this.http.get<Tag[]>(environment.tweetsBaseUrl +'api/v1/tweets/tags')
  }

  newTweet(request: RequestTweet): any {
    return this.http.post(environment.tweetsBaseUrl + 'api/v1/tweets/', request)
  }

  editTweet(request: RequestTweet, id: number): any {
    return this.http.put(environment.tweetsBaseUrl + 'api/v1/tweets/' + id, request)
  }

  deleteTweet(rowKey: string): Observable<boolean> {
    return this.messageError(this.http.delete<boolean>(environment.tweetsBaseUrl + 'api/v1/tweets/' + rowKey));
  }

  messageError<T>(obs: Observable<T>): Observable<T> {
    return obs.pipe(
      catchError((err: any, caught: any) => {
        this.navService.openSnackBar('Error: ' + err?.message || err?.toString());
        return throwError(caught);
      })
    ) as Observable<T>;
  }
}

export interface RequestTweet {
  user_id: number | null;
  text: string | null;
  tag_id: number | null;
  privacy: boolean | null;
}

export interface Tweet {
  id: number,
  username: string,
  text: string,
  private: boolean
  tag: string
}

export interface TagDictionary {
  [name: string]: number
}

export interface Tag {
  id: number,
  name: string
}