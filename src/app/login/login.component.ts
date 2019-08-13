import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProtectionGuard } from '../protection.guard';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { auth } from 'firebase/app';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthorizationService } from '../authorization.service';
import { ValidationService } from '../validation.service';
import { EmailLoginDialog } from '../emailLoginDialog.model';
import { EmailLoginDialogComponent } from '../email-login-dialog/email-login-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ValidationService, AuthorizationService, ProtectionGuard]
})
export class LoginComponent implements OnInit {
  private user: any = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private animal: string;

  constructor(public authService: AuthorizationService, private router: Router, private as: AuthorizationService, public dialog: MatDialog) {
  }
  signInWithGoogle() {
    this.authService.googleLogin(); //.signInWithPopup(new auth.GoogleAuthProvider());
    // location.reload();
  }

  // openDialog(email: string, password: string){
  //   this.signInWithEmail();
  // }

  logout() {
    this.authService.signOut();
  }
  // loginForm: FormGroup;
  // private showLoader: boolean = true;
  //
  // constructor(private fb: FormBuilder,private router: Router, private vs: ValidationService, private as: AuthorizationService) { }
  //
  ngOnInit() {
  //   this.loginForm = this.fb.group({
  //     emailBound: ['', Validators.required],
  //     passwordBound: ['', Validators.required]
  //   });
    if(this.as.authenticated){
      console.log("authenticated in login component");
      this.as.currentUserObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
          this.user = result;
      });
      // location.reload();
      // this.showLoader = !status;
      // this.router.navigate(['']);
    } else{
      // this.showLoader = false;
    }
  }

  openSignInWithEmailDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(EmailLoginDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(val => {
      console.log("Dialog output:", val);
      this.authService.emailLogin(val.email, val.passwd);
    });
  }

  newAccount(){
    this.router.navigate(['createaccount']);
  }

  //
  // submitLoginForm(){
  //   let values = this.getValues();
  //   this.as.login(values.emailBound, values.passwordBound);
  //   //@TODO flesh me out
  // }
  //
  // getValues(){
  //   let result = this.loginForm.value;
  //   return result;
  // }
  //
  // allValid(){
  //   let values = this.loginForm.value;
  //   if(this.vs.validateEmail(values.emailBound) && this.vs.validatePassword(values.passwordBound)){
  //     return true;
  //   } else{
  //     return false;
  //   }
  // }
  //

  //
  // loginWithGoogle(){
  //   this.as.loginGoogle();
  // }

}
