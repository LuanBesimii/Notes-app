import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, FormsModule, MatInputModule,MatButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements OnInit{
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.formInit()
  }
  private passwordInputListen(){
    this.form.controls['passwordConfirmation'].valueChanges.subscribe(
      {
        next: value => {
          this.passwordMatch(value)
        },
        error: errorMessage => {
          alert(errorMessage);
        }}

   )
  }

  private passwordMatch(pass: string){
    let password = this.form.controls['password'].value
    if(pass !== password){
      this.form.controls['passwordConfirmation'].setErrors({'incorrect': true})
    }else{
      this.form.controls['passwordConfirmation'].setErrors(null)
    }
  }

  private formInit(){
    this.form = this.fb.group({
      userEmail: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    })
    this.passwordInputListen()
  }

  private getFormValue(): User{
    let user: User = {
      id: 0,
      email: this.form.controls['userEmail'].value,
      password: this.form.controls['password'].value
    }
    return user
  }
   formClear(){
    this.form.controls['userEmail'].patchValue('')
    this.form.controls['password'].patchValue('')
    this.form.controls['passwordConfirmation'].patchValue('')
  }

 save(){
    let user = this.getFormValue()
    this.userService.saveUser(user)
    this.formClear()
    this.router.navigate(['/login'])
  }

  goBack(){
    this.formClear();
    this.router.navigate(['/login']);
  }
}
