import { Injectable } from '@angular/core';
import {User} from "../models/user.model";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userList!: User[]

  constructor() { }


  saveUser(user: User): void{
    this.setUserToLocalStorage(user)
  }
  private setUserToLocalStorage(user: User): void{
    let users = this.getUsers()
    if(users == null) {
      localStorage.setItem('users', JSON.stringify([user]))
      Swal.fire({
        title: 'User Created',
        icon: 'success',
        confirmButtonColor: '#0BDA51',
        allowOutsideClick: true
      });
    }
    else{
      users = this.addUserOnList(user, users)
      localStorage.setItem('users', JSON.stringify(users));
      Swal.fire({
        title: 'User Created',
        icon: 'success',
        confirmButtonColor: '#0BDA51',
        allowOutsideClick: true
      });
    }
  }


  getUsers(): User[] | null{
    let userFromStorage = localStorage.getItem('users')
    if(userFromStorage)
      return JSON.parse(userFromStorage)
    return null
  }


  getUserByEmail(email: string): User | undefined{
    let list = this.getUsers()
    if(list !== null){
      let userFound = list.find(user => user.email == email)
      return userFound
    }
    return undefined
  }

  addUserOnList(user: User, userList: User[]): User[]{
    user.id = userList.length
    userList.push(user)
    return userList
  }
}
