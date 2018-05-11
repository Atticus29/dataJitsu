import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-user-status-report',
  templateUrl: './user-status-report.component.html',
  styleUrls: ['./user-status-report.component.scss']
})
export class UserStatusReportComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  user: any = null;
  userObjFromDb;

  constructor(private authService: AuthorizationService, private db: DatabaseService) { }

  ngOnInit() {
    // this.authService.getCurrentUser()
    // .takeUntil(this.ngUnsubscribe).subscribe(user=>{
    //   this.user = user;
    //   if (this.user) {
    //     this.db.getUserById(this.user.uid)
    //     .takeUntil(this.ngUnsubscribe).subscribe(dbuser=>{
    //       // console.log(dbuser);
    //       this.userObjFromDb = dbuser;
    //       // console.log(this.userObjFromDb);
    //     });
    //   }
    // });
  }

}
