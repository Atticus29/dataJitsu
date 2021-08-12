import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent extends BaseComponent implements OnInit {

  constructor(private databaseService: DatabaseService) {
    super();
  }

  async ngOnInit() {
    const userEmail: String = 'tmp11@gmail.com';
    try {
      this.databaseService.getUsers().pipe(takeUntil(this.ngUnsubscribe)).subscribe(userResults =>{
        const nameAndEmails = userResults.map(result => {
          return {name: result.name, email: result.email};
        });
        console.log('nameAndEmails is: ');
        console.log(nameAndEmails);
      });

      const deletionStatus: Observable<boolean> = this.databaseService.deleteUserByEmail(userEmail);
      deletionStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        console.log('deleteMe result of deletion call is: ');
        console.log(result);
      })
    } catch (error) {
      console.log('deleteMe got here error is: ');
      console.log(error);
      // this.openSnackBar(error.message);
      // this.cardErrors = error.message;
      // this.subscriptionStatus = '';
    }
  }

}
