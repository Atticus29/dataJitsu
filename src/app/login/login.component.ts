import { Component, OnInit } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailBound: ['', Validators.required],
      passwordBound: ['', Validators.required]
    })
  }

  submitLoginForm(){
    //TODO flesh me out
  }

  getValues(){
    let result = this.loginForm.value;
    return result;
  }

  allValid(){
    let values = this.loginForm.value;
    if(values.emailBound !== "" && this.validateEmail(values.emailBound) && values.passwordBound !== ""){
      return true;
    } else{
      return false;
    }
  }

  validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

}
