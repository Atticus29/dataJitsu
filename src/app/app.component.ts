import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from './authorization.service';
import { ProtectionGuard } from './protection.guard';
import { constants } from './constants';
import { ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

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
  title: string = constants.title;
  authenticationStatus: boolean;

  shouldAnnotate: boolean = false;

  constructor(private authService: AuthorizationService, private db: DatabaseService, private router: Router, private cdr: ChangeDetectorRef, public afAuth: AngularFireAuth){}

  ngOnInit() {
    this.authService.getCurrentUser().pipe(takeUntil(this.ngUnsubscribe)).subscribe(user=>{
      this.user = user;
    });
    this.afAuth.authState.subscribe(user =>{
      // console.log(user);
      if(user){
        // console.log("user exists");
        this.authenticationStatus = true;
      }
    });
  }

  loginGoogleComponent(){
    this.authService.loginGoogle();
  }

  logout(){
    this.authService.logout();
    this.afAuth.authState.subscribe(user =>{
      if(!user){
        console.log("got here");
        this.authService.user = null;
        this.authService.setAuthenticated(false);
        this.router.navigate(['login']);
        this.authenticationStatus = false;
        // this.cdr.detectChanges();
      }
    });
  }


}
