import {EventEmitter, Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false
   authUserEvent = new EventEmitter<boolean>()
   loginTryEvent = new EventEmitter<boolean>()
  constructor(
    private userService: UserService
  ) { }

  verifyAuthentication(): boolean{
    let userAuth = sessionStorage.getItem('auth')
    if(userAuth)
      this.userAuthenticate(JSON.parse(userAuth))
    this.authUserEvent.emit(this.isAuthenticated)
    return this.isAuthenticated
  }

  userAuthenticate(user: User): void{
    let storageUser = this.userService.getUserByEmail(user.email) || undefined
    if(storageUser){
      if(user.password == storageUser.password)
        this.setUserCredentials(storageUser)
      else
        this.loginTryEvent.emit(true)
    }else
      this.loginTryEvent.emit(true)
  }
  private setUserCredentials(user: User): void{
    this.isAuthenticated = true
    sessionStorage.setItem('auth', JSON.stringify(user))
  }

  logout(): void{
    this.isAuthenticated = false
    this.authUserEvent.emit(false)
    sessionStorage.removeItem('auth')
  }
}
