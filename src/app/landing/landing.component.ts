import { Component, OnInit } from "@angular/core";

import { AuthorizationService } from "../authorization.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent extends BaseComponent implements OnInit {
  public sub: any;

  constructor(public as: AuthorizationService) {
    super();

    // this.sub = this.as.authState.(val => {
    //   console.log("got here");
    //   console.log(val);
    //   if(val){
    //     console.log("authenticated in landing component");
    //   }
    // });
  }

  ngOnInit() {}
}
