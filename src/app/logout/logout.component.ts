import { Component, OnInit } from '@angular/core';

import { AuthorizationService } from '../authorization.service';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthorizationService, private trackerService: TrackerService) { }

  ngOnInit() {
      let confirmation = confirm("Are you sure you want to log out?");
      if (confirmation == true) {
        this.authService.signOut();
        this.trackerService.currentUserBehaviorSubject.next(null); //TODO why necessary?
      } else {
      }
  }

}
