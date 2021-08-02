import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent extends BaseComponent implements OnInit {

  constructor(private databaseServie: DatabaseService) {
    super();
  }

  async ngOnInit() {
    const userEmail: String = 'tmp11@gmail.com';
    // const deleteUserFn = this.functions.httpsCallable('deleteUserByEmail');
    try {
      const deletionStatus: Observable<boolean> = this.databaseServie.deleteUserByEmail(userEmail);
      deletionStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        console.log('deleteMe result of deletion call is: ');
        console.log(result);
      })
      // const res = await deleteUserFn({ userEmail: userEmail }).toPromise();
      // console.log('deleteMe got here with response in UserDeleteComponent');
      // console.log(res);
      // if (res) {
      //   // this.subscriptionStatus = "Subscription is " + this.textTransformationService.capitalizeFirstLetter(res.status);
      //   // this.openSnackBar(this.subscriptionStatus);
      //   // this.loading = false;
      //   // this.localPaymentStatus = false;
      // }
    } catch (error) {
      console.log('deleteMe got here error is: ');
      console.log(error);
      // this.openSnackBar(error.message);
      // this.cardErrors = error.message;
      // this.subscriptionStatus = '';
    }
  }

}
