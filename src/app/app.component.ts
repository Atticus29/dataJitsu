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
  authenticationStatus: boolean =false;

  shouldAnnotate: boolean = false;

  constructor(private authService: AuthorizationService, private db: DatabaseService, private router: Router, private cdr: ChangeDetectorRef, public afAuth: AngularFireAuth){}

  ngOnInit() {
    this.authService.getCurrentUser().pipe(takeUntil(this.ngUnsubscribe)).subscribe(user=>{
      this.user = user;
    });
    this.afAuth.authState.subscribe(user =>{
      console.log("user from authState in app.component:");
      console.log(user);
      console.log("user id");
      console.log(user.uid);
      if(user){
        // console.log("user exists");
        this.authenticationStatus = true;
        this.db.getUserByUid(user.uid).subscribe(dbUser =>{
          console.log("db user from getUserByUid in app.component is:");
          console.log(dbUser);
          this.db.getUserReputationPoints(dbUser.id).subscribe(reputation =>{
            this.db.updatePrivileges(dbUser, Number(reputation));
            //TODO update reputation points privileges
          })
        });
      } else {
        this.authenticationStatus = false;
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
        this.authenticationStatus = false;
        this.authService.authenticated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          if(!status){
            this.router.navigate(['login']); //move back up one line?
            window.location.reload(false);
          }
        });
        // this.cdr.detectChanges();
      }
    });
  }


}
