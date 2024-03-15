import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/cognito.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    CognitoRefreshToken,
    CognitoUserSession
  } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  newPasswordForm: FormGroup;
  showNewPasswordForm = false;
  showSignInForm = true;
  cognitoUser: CognitoUser | null = null;
  email: string = '';
  password: string = '';
  newPassword: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private cognitoService: CognitoService,
    private router: Router
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.newPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  signIn(): void {
    if (this.signInForm.invalid) {
      return;
    }

    this.email = this.signInForm.get('email')?.value;
    this.password = this.signInForm.get('password')?.value;

    this.cognitoService.signIn(this.email, this.password)
      .then((result) => {
        this.router.navigate(['']);
      })
      .catch((error) => {
        if (error['newPasswordRequired']) {
          this.showSignInForm = false;
          this.showNewPasswordForm = true;
          this.cognitoUser = this.cognitoService.getCurrentUser();
        } else {
          console.error('Error during sign in:', error);
        }
      });
  }

  submitNewPassword(): void {
    if (this.newPasswordForm.invalid || !this.cognitoUser) {
      return;
    }

    const email = this.newPasswordForm.get('email')?.value;
    const newPassword = this.newPasswordForm.get('newPassword')?.value;

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: newPassword
    });
  
    this.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // Handle successful password change and login
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();

        // Save the tokens to use for subsequent requests
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('idToken', idToken);

        this.router.navigate(['sign-in']);
      },
      onFailure: (error) => {
        console.error('Error during new password submission:', error);
      }
    });
  }
}
