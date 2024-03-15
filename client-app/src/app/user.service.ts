import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  //This service is mostly a placeholder, just returning a user
  getUserId(){
    return 1
  }
}
