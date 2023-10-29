import { Injectable } from '@angular/core';
import {User} from "../models/user.model";

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
    if(users == null)
      localStorage.setItem('users', JSON.stringify([user]))
    else{
      users = this.addUserOnList(user, users)
      localStorage.setItem('users', JSON.stringify(users))
    }
  }


  getUsers(): User[] | null{
    let userFromStorage = localStorage.getItem('users')
    if(userFromStorage)
      return JSON.parse(userFromStorage)
    return null
  }


  getUserByName(name: string): User | undefined{
    let list = this.getUsers()
    if(list !== null){
      let userFound = list.find(user => user.name == name)
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
