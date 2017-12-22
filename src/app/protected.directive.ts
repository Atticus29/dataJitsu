import { Directive, OnDestroy } from '@angular/core';
import {AuthorizationService} from './authorization.service';
import { Router } from '@angular/router';
import {Location} from "@angular/common";

@Directive({
  selector: '[appProtected]'
})
export class ProtectedDirective implements OnDestroy{
  private sub: any;

  constructor(private as: AuthorizationService, private router: Router, private location: Location) {
    // if(!as.user){
    //   this.location.replaceState('/');
    //   this.router.navigate(['']);
    // }
    if(!as.isAuthenticated()){
      this.location.replaceState('/');
      this.router.navigate(['']);
    }

    this.sub = this.as.subscribe(val => {
      if(!val.athenticated){
        this.location.replaceState('/');
        this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy(){
    if(this.sub != null){
      this.sub.unsubscribe();
    }
  }
}
