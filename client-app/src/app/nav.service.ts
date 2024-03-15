import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private mediaSubscription?: Subscription;

  public lt_lg: boolean = false;
  public lt_md: boolean = false;
  public lt_sm: boolean = false;

  constructor(private mediaObserver: MediaObserver, private snackBar: MatSnackBar) {
    this.mediaSubscription = this.mediaObserver.asObservable().subscribe(change => {
      this.lt_lg = false;
      this.lt_md = false;
      this.lt_sm = false;

      change.forEach(item => {
        if (item.mqAlias === 'lt-lg') this.lt_lg = true;
        else if (item.mqAlias === 'lt-md') this.lt_md = true;
        else if (item.mqAlias === 'lt-sm') this.lt_sm = true;

        console.log('activeMediaQuery', item.mqAlias);
      });
    });
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
    });
  }
}
