import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { AuthorizationService } from "../authorization.service";
import { TrackerService } from "../tracker.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"],
})
export class LogoutComponent extends BaseComponent implements OnInit {
  constructor(
    public authService: AuthorizationService,
    public trackerService: TrackerService,
    public router: Router
  ) {
    super();
  }

  ngOnInit() {
    let confirmation = confirm("Are you sure you want to log out?");
    if (confirmation == true) {
      this.authService.signOut();
      this.trackerService.currentUserBehaviorSubject.next(null); //TODO why necessary?
    } else {
    }

    this.trackerService.currentUserBehaviorSubject
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((usr) => {
        console.log("user in logout component");
        console.log(usr);
        if (!usr) {
          console.log("user doesn't exist now. Should move along...");
          this.router.navigate(["login"]);
        }
      });
  }
}
