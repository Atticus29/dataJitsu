import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthorizationService } from './authorization.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class ProtectionGuard implements CanActivate {
  returnVal: boolean = false;
  constructor(private as: AuthorizationService, public afAuth: AngularFireAuth, private router: Router){}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.afAuth.authState.map((auth) => {
        if (!auth) {
          // this.AuthService.loggedIn = false;
          this.router.navigateByUrl('');
          console.log("got into false");
          return false;
        }
        // this.AuthService.loggedIn = true;
        console.log("got into true");
        return true;
    });
  }
}
