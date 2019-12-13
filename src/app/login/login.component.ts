import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProtectionGuard } from '../protection.guard';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { auth } from 'firebase/app';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TrackerService } from '../tracker.service';
import { BaseComponent } from '../base/base.component';
import { AuthorizationService } from '../authorization.service';
import { ValidationService } from '../validation.service';
import { EmailLoginDialog } from '../emailLoginDialog.model';
import { EmailLoginDialogComponent } from '../email-login-dialog/email-login-dialog.component';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ValidationService, AuthorizationService, ProtectionGuard, TrackerService]
})
export class LoginComponent extends BaseComponent implements OnInit {
  private user: User = null;
  private loggedIn: boolean = false;

  constructor(public authService: AuthorizationService, private router: Router, private as: AuthorizationService, public dialog: MatDialog, public trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    console.log("got into login component");
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
      this.user = result;
      if(result){
        this.loggedIn = true;
      }else{
        this.loggedIn = false;
      }
    });
  }

  signInWithGoogle() {
    this.authService.googleLogin();
  }

  logout() {
    this.authService.signOut();
  }

  openSignInWithEmailDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(EmailLoginDialogComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
      this.authService.emailLogin(val.email, val.passwd);
    });
  }

  newAccount(){
    this.router.navigate(['createaccount']);
  }
}
