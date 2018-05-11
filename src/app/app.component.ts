import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { AuthorizationService } from './authorization.service';
import { ProtectionGuard } from './protection.guard';
import { constants } from './constants';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[AuthorizationService, ProtectionGuard]
})
export class AppComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  user: any = null;
  userObjFromDb;

  shouldAnnotate: boolean = false;

  constructor(private authService: AuthorizationService, private db: DatabaseService){}

  ngOnInit() {

  }

  loginGoogleComponent(){
    this.authService.loginGoogle();
  }

  logout(){
    this.authService.logout();
    this.authService.user = null;
    this.authService.setAuthenticated(false);
    // console.log(this.authService.user);
  }


}
