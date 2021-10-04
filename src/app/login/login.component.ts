import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProtectionGuard } from "../protection.guard";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { auth } from "firebase/app";
import { get } from "lodash";

import { Subject, combineLatest } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { TrackerService } from "../tracker.service";
import { BaseComponent } from "../base/base.component";
import { AuthorizationService } from "../authorization.service";
import { ValidationService } from "../validation.service";
// import { EmailLoginDialog } from '../emailLoginDialog.model';
import { EmailLoginDialogComponent } from "../email-login-dialog/email-login-dialog.component";
import { User } from "../user.model";
import { DatabaseService } from "../database.service";
import * as bcrypt from "bcryptjs";
import { constants } from "../constants";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends BaseComponent implements OnInit {
  private localUser: User = null;
  private loggedIn: boolean = false;

  constructor(
    public authService: AuthorizationService,
    private router: Router,
    private as: AuthorizationService,
    public dialog: MatDialog,
    public trackerService: TrackerService,
    private databaseService: DatabaseService
  ) {
    super();
  }

  ngOnInit() {
    this.trackerService.currentUserBehaviorSubject
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.localUser = result;
        if (result) {
          this.loggedIn = true;
        } else {
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
    const self = this;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(EmailLoginDialogComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        if (val && val.email && val.passwd) {
          self.databaseService
            .getUserByEmailAddress(val.email)
            .pipe(takeUntil(self.ngUnsubscribe))
            .subscribe((dbUser) => {
              if (get(dbUser, "salt", "")) {
                const hash = bcrypt.hashSync(
                  val.passwd,
                  get(dbUser, "salt", "")
                );
                self.authService.emailLogin(val.email, hash);
              } else {
                alert(constants.noSaltAlert);
                self.authService.emailLogin(val.email, val.passwd);
              }
            });
        }
      });
  }

  newAccount() {
    this.router.navigate(["createaccount"]);
  }
}
