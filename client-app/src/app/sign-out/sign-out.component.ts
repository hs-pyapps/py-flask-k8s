import { Component } from '@angular/core';
import { CognitoService } from 'src/app/cognito.service';

@Component({
  selector: 'app-sign-out',
  template: '<button (click)="onSignOut()">Sign Out</button>',
})
export class SignOutComponent {
  constructor(private cognitoService: CognitoService) {}

  onSignOut() {
    this.cognitoService.signOut();

    // Remove the token from storage
    localStorage.removeItem('auth_token');

    // Navigate to the desired page after successful sign-out
    // You can use Angular Router for navigation
  }
}
