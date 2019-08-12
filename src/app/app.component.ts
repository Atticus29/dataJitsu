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
  private paidStatus: boolean = false;
  user: any = null;
  userObjFromDb;
  title: string = constants.title;
  authenticationStatus: boolean =false;
  shouldAnnotate: boolean = false;

  constructor(private authService: AuthorizationService, private db: DatabaseService, private router: Router, private cdr: ChangeDetectorRef, public afAuth: AngularFireAuth){}

  ngOnInit() {
    this.authService.currentUserObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user=>{
      this.user = user;
      if(user){
        // console.log("user exists");
        this.authenticationStatus = true;
        this.db.getUserByUid(user.uid).subscribe(dbUser =>{
          // console.log("db user from getUserByUid in app.component is:");
          // console.log(dbUser);
          this.shouldAnnotate = dbUser.paymentSatus;
          this.db.hasUserPaid(dbUser.id).valueChanges().subscribe(paymentStatus =>{
            if(paymentStatus){
              this.paidStatus = Boolean(paymentStatus);
            }else{
              this.paidStatus = false;
            }
          });
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
    this.authService.googleLogin();
  }

  logout(){
    let confirmation = confirm("Are you sure you want to log out?");
    if (confirmation == true) {
      this.authService.signOut();
      this.afAuth.authState.subscribe(user =>{
        if(!user){
          console.log("got here");
          //TODO maybe fix below?
          //Commented out 8.11.2019
          // this.authService.user = null;
          // this.authService.setAuthenticated(false);
          // this.authenticationStatus = false;

          //Commented out before 8.11.2019
          // this.authService.authenticated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
            //   if(!status){
              //     this.router.navigate(['login']); //move back up one line?
              //     window.location.reload(false);
              //   }
              // });
              // this.cdr.detectChanges();
            }
      });
    } else {
    }
  }

  navigateToVideoInNeedOfAnnotation(){
    console.log("got into navigateToVideoInNeedOfAnnotation");
    this.db.getMatchInNeedOfAnnotation().pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
      this.router.navigate(['matches/' + match.id]);
    });
  }
}
