import { Injectable } from '@angular/core';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoRefreshToken
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_XzMV761hP',
  ClientId: 'cnermjlsgjs4mkuuoc2dcfb75',
};

const userPool = new CognitoUserPool(poolData);

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private userPool: CognitoUserPool;
  constructor() {
    const poolData = {
        UserPoolId: 'us-east-1_XzMV761hP',
        ClientId: 'cnermjlsgjs4mkuuoc2dcfb75',
    };

    this.userPool = new CognitoUserPool(poolData);
  }

  getCurrentUser(): CognitoUser | null {
    return this.userPool.getCurrentUser();
  }

  signUp(email: string, password: string) {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];

    return new Promise((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        attributeList,
        [],
        (err, result) => {
        if (err) {
            reject(err);
            } else if (result) { // Check if result is defined before accessing the user property
            resolve(result.user);
            } else {
            reject(new Error('Unexpected error: result is undefined'));
            }
        }
      );
    });
  }

  signIn(email: string, password: string): Promise<CognitoUserSession> {
    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(
      authenticationData
    );
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: () => {
            reject({ newPasswordRequired: true });
        }
      });
    });
  }

  signOut() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
  }

  refreshToken(): Promise<string> {
    const refreshTokenString = localStorage.getItem('refresh_token');
    if (!refreshTokenString) {
      return Promise.reject('No refresh token found');
    }

    const refreshToken = new CognitoRefreshToken({ RefreshToken: refreshTokenString });
    const userData = {
      Username: '',
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(refreshToken, (err, session) => {
        if (err) {
          reject(err);
        } else {
          resolve(session.getIdToken().getJwtToken());
        }
      });
    });
  }
}
