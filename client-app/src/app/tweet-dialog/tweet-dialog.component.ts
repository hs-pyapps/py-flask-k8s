import { Component, Inject } from '@angular/core'
import {FormControl,FormGroup,Validators,} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TweetsService, Tweet, Tag, TagDictionary, RequestTweet } from '../tweets.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tweet-dialog',
  templateUrl: './tweet-dialog.component.html',
  styleUrls: ['./tweet-dialog.component.scss']
})
export class TweetDialogComponent {
  purpose: string = 'Create';
  formGroup: FormGroup;
  tagOptions: Tag[] = [];
  tagDict : TagDictionary = {};
  selectedTag: any;
  tweetRequest: RequestTweet = {user_id : null, tag_id : null, text: null, privacy: null};
  subscription : Subscription = new Subscription;

  constructor(public dialogRef: MatDialogRef<TweetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    public tweetsService: TweetsService,
    public userService: UserService
    ) { 
      this.formGroup = new FormGroup({
        tweetText: new FormControl(this.data.tweet.text, [Validators.required]),
        tweetTag: new FormControl('', [Validators.required]),
        tweetPrivacy: new FormControl(this.data.tweet.private, [Validators.required]),
      });

      if (this.data.editing){
        this.purpose = 'Edit'
      }
  
      this.subscription = this.tweetsService.getTweetCategories().subscribe((s) => {this.tagOptions = s;
        this.prepareTags()
      });
    }

  ngOnInit(): void {
    this.tweetRequest.user_id = this.userService.getUserId()
  }

  onSubmit() {
    this.subscription.unsubscribe()

    this.tweetRequest.text = this.formGroup.value.tweetText
    this.tweetRequest.tag_id = this.formGroup.value.tweetTag
    this.tweetRequest.privacy = this.formGroup.value.tweetPrivacy

    if (this.data.editing){
      this.subscription = this.tweetsService.editTweet(this.tweetRequest, this.data.tweet.id).subscribe(() => this.dialogRef.close())
    } else {
      this.subscription = this.tweetsService.newTweet(this.tweetRequest).subscribe(() => this.dialogRef.close())
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  prepareTags(): void {
    if (this.data.editing){
      this.tagOptions.forEach(t => {
        if (t.name === this.data.tweet.tag){
          this.selectedTag = t.id
        }
        this.tagDict[t.name] = t.id
      })
      this.formGroup.value.tweetTag = this.tagDict[this.data.tweet.tag]
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}

export interface dialogData {
  editing: boolean,
  tweet: Tweet
}
