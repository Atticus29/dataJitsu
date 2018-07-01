import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from './authorization.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';


@Injectable()
export class ProtectionGuard implements CanActivate {
  returnVal: boolean = false;
  constructor(private as: AuthorizationService, public afAuth: AngularFireAuth, private router: Router){}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.afAuth.authState.map((auth) => {
        if (!auth) {
          this.router.navigateByUrl('login');
          return false;
        }
        return true;
    });
  }
}
