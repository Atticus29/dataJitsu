import { Component, OnInit } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../validation.service';
import { AuthorizationService } from '../authorization.service';
import { ProtectionGuard } from '../protection.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ValidationService, AuthorizationService, ProtectionGuard]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router, private vs: ValidationService, private as: AuthorizationService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailBound: ['', Validators.required],
      passwordBound: ['', Validators.required]
    })
  }

  submitLoginForm(){
    let values = this.getValues();
    this.as.login(values.emailBound, values.passwordBound);
    //@TODO flesh me out
  }

  getValues(){
    let result = this.loginForm.value;
    return result;
  }

  allValid(){
    let values = this.loginForm.value;
    if(this.vs.validateEmail(values.emailBound) && this.vs.validatePassword(values.passwordBound)){
      return true;
    } else{
      return false;
    }
  }

  newAccount(){
    this.router.navigate(['createaccount']);
  }

  loginWithGoogle(){
    this.as.loginGoogle();
  }

}
