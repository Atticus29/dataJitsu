import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { ValidationService } from '../validation.service';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  providers: [DatabaseService, ValidationService, AuthorizationService]
})
export class CreateAccountComponent implements OnInit {

  //@TODO add option to add new weight class, age class, etc. in the html here rather than on the db to keep in the bottom and isolate for special behavior
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  newUserForm: FormGroup;
  title: string = "Create an Account";
  genders: Array<string> = ["Female", "Male"];
  weightClasses: any[];
  noGiRanks: any[];
  giRanks: any[];
  ageClasses: any[];
  ages: Array<number> = new Array<number>();


  constructor(private fb: FormBuilder, private db: DatabaseService, private router: Router, private vs: ValidationService, private as: AuthorizationService) { }

  ngOnInit() {
    for (var i = 3; i <= 110; i++) {
      this.ages.push(i);
    }
    this.newUserForm = this.fb.group({
      userNameBound: ['', Validators.required],
      userEmailBound: ['', Validators.required],
      passwordBound: ['', Validators.required],
      userAffiliationBound: ['', Validators.required],
      genderBound: ['', Validators.required],
      ageClassBound: ['', Validators.required],
      giRankBound: ['', Validators.required],
      noGiRankBound: ['', Validators.required],
      weightBound: ['', Validators.required],
      ageBound: ['', Validators.required]
    });

    this.db.getGiRanks().takeUntil(this.ngUnsubscribe).subscribe(giRanks=>{
      this.giRanks = giRanks;
    })

    this.db.getNoGiRanks().takeUntil(this.ngUnsubscribe).subscribe(noGiRanks=>{
      this.noGiRanks = noGiRanks;
    })

    this.db.getAgeClasses().takeUntil(this.ngUnsubscribe).subscribe(ageClasses=>{
      this.ageClasses = ageClasses;
    });

    this.db.getWeightClasses().takeUntil(this.ngUnsubscribe).subscribe(weightClasses=>{
      this.weightClasses = weightClasses;
    });
  }

  getValues(){
    let result = this.newUserForm.value;
    return result;
  }

  createUserObj(result: any){
    let {userNameBound, userEmailBound, passwordBound, userAffiliationBound, genderBound, ageClassBound, giRankBound, noGiRankBound, weightBound, ageBound} = result;
    let newUser = new User(userNameBound, userEmailBound, passwordBound, giRankBound, noGiRankBound, userAffiliationBound, Number(ageBound), weightBound, 100, null, false, genderBound, new Date().toJSON());
    return newUser;
  }

  //@TODO see whether you can get it to re-direct from here if you're logged in

  processFormInputsToDB(){
    let result = this.getValues();
    let newUser: User = this.createUserObj(result);

    //The signup and db add HAVE to happen before the subscription. You've made this mistake before
    this.as.signup(newUser.getEmail(), newUser.getPassword()).subscribe(value =>{
      console.log(value);
      this.db.addUserToDb(newUser);
    });
    ;


    let user:any = this.as.getCurrentUser().subscribe(user=>{
      console.log(user);
      newUser.setUid(user.uid);
      this.db.getNodeIdFromEmail(user.email).on("child_added", snapshot=>{
        // console.log("got to snapshot in getNodeIdFromEmail");
        // console.log(snapshot.val().id);
        newUser.setId(snapshot.val().id);
        this.db.updateUserInDb(newUser);
      });

      //@TODO test whether trying to create a second account under the same email messes up
    });

    // this.router.navigate(['landing']);

    //@TODO return to main or login results/welcome page
  }

  allValid(){
    let values = this.newUserForm.value;
    if(values.userNameBound && this.vs.validateEmail(values.userEmailBound) && this.vs.validatePassword(values.passwordBound) && values.genderBound && values.ageClassBound && this.vs.validateWeight(values.weightBound) && values.giRankBound && values.noGiRankBound && values.ageBound && values.userAffiliationBound){
      return true;
    } else{
      return false;
    }
  }


}
