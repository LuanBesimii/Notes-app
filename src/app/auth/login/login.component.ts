import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form!: FormGroup
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.formInit()
    this.loginAttemptsListen()
  }

  loginAttemptsListen() {
    this.authService.loginTryEvent.subscribe(event =>{
      if(event)
     alert("'Sorry, try again', 'Wrong credentials'")
    })
  }

  private formInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login() {
    let user: User = this.getFormValue()
    if (user && user.name && user.password) {
      this.authService.userAuthenticate(user)
      this.router.navigate(['/note'])
    } else
      alert("'Sorry, try again', 'Wrong credentials'");
  }

  private getFormValue(): User {
    let user: User = {
      id: 0,
      name: this.form.controls['userName'].value,
      password: this.form.controls['password'].value
    }
    return user
  }
}
