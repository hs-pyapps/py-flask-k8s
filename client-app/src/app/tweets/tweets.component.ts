import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TweetDialogComponent } from '../tweet-dialog/tweet-dialog.component';
import { RowActionEvent } from '../tweets-table/tweets-table.component';
import { Subscription } from 'rxjs';
import { TweetsService, Tweet } from '../tweets.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss'],
})
export class TweetsComponent implements OnInit {
  tweets?: Tweet[];
  createSubscription : Subscription = new Subscription
  refreshSubscription : Subscription = new Subscription
  editSubscription : Subscription = new Subscription

  constructor(public dialog: MatDialog, public tweetsService: TweetsService) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  refreshTable() {
    this.refreshSubscription = this.tweetsService.getTweets().subscribe(s => (this.tweets = s));
  }

  createTweet() {
    const dialogRef = this.dialog.open(TweetDialogComponent, { data: {
      editing: false,
      tweet: {user_id : null, tag_id : null, text: null, private: false}
    }
    });

    this.createSubscription = dialogRef.afterClosed().subscribe(() => this.refreshTable());
  }

  editTweet(tweet: Tweet){
    const dialogRef = this.dialog.open(TweetDialogComponent,{ data: {
      editing: true,
      tweet: tweet
    }
    })

    this.editSubscription = dialogRef.afterClosed().subscribe(() => this.refreshTable());
  }

  ngOnDestroy(){
    this.editSubscription.unsubscribe()
    this.createSubscription.unsubscribe()
    this.refreshSubscription.unsubscribe()
  }

  tweetAction(e: RowActionEvent) {
    switch (e.action) {
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Delete?',
            message: 'Are you sure you want to delete tweet [' + e.row.tweetName + ']?',
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.tweetsService.deleteTweet(e.row.RowKey).subscribe(v => {
              this.refreshTable();
            });
          }
        });
        break;
      }
    }
  }
}
