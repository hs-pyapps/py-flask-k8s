import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


import { TweetsComponent } from './tweets/tweets.component';
import { AboutComponent } from './about/about.component';
import { TweetsTableComponent } from './tweets-table/tweets-table.component';
import { DateFormatPipe } from './date-format.pipe';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularResizeEventModule } from 'angular-resize-event';
import { TweetDialogComponent } from './tweet-dialog/tweet-dialog.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { SignOutComponent } from './sign-out/sign-out.component';

@NgModule({
  declarations: [
    AppComponent,
    TweetsComponent,
    AboutComponent,
    TweetsTableComponent,
    ConfirmationDialogComponent,
    DateFormatPipe,
    TweetDialogComponent,
    SignInComponent,
    SignOutComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSliderModule,
    IvyCarouselModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    AngularResizeEventModule,
    MatSlideToggleModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
