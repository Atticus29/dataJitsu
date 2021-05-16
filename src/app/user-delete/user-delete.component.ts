import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {

  constructor(private functions: AngularFireFunctions) { }

  async ngOnInit() {
    const userEmail: String = 'test@example1.com';
    const deleteUserFn = this.functions.httpsCallable('deleteUserByEmail');
    try {
      const res = await deleteUserFn({ userEmail: userEmail }).toPromise();
      console.log("deleteMe got here with response in UserDeleteComponent");
      console.log(res);
      if (res) {
        // this.subscriptionStatus = "Subscription is " + this.textTransformationService.capitalizeFirstLetter(res.status);
        // this.openSnackBar(this.subscriptionStatus);
        // this.loading = false;
        // this.localPaymentStatus = false;
      }
    } catch (error) {
      // this.openSnackBar(error.message);
      // this.cardErrors = error.message;
      // this.subscriptionStatus = '';
    }
  }

}
