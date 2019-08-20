import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../authorization.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  private sub: any;

  constructor(private as: AuthorizationService) {

    // this.sub = this.as.authState.(val => {
    //   console.log("got here");
    //   console.log(val);
    //   if(val){
    //     console.log("authenticated in landing component");
    //   }
    // });
  }


  ngOnInit() {
  }

}
