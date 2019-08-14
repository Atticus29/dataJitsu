import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { ValidationService } from '../validation.service';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  providers: [DatabaseService, ValidationService, AuthorizationService]
})
export class CreateAccountComponent implements OnInit {

  //@TODO add the opposite of protection guard in the routing for this component (swap true and false), because otherwise a user currently logged in will be able to "create a new account" that will override their existing user specs
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
  disabledAge: boolean = true;
  disabledNoGiRank: boolean = false;
  disabledGiRank: boolean = false;
  disabledAgeClass: boolean = false;
  // disabledWeightClass: boolean = false;


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

    this.db.getGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(giRanks=>{
      this.giRanks = giRanks;
      this.disabledGiRank = true;
    })

    this.db.getNoGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(noGiRanks=>{
      this.noGiRanks = noGiRanks;
      this.disabledNoGiRank = true;
    })

    this.db.getAgeClasses().pipe(takeUntil(this.ngUnsubscribe)).subscribe(ageClasses=>{
      this.ageClasses = ageClasses;
      this.disabledAgeClass = true;
    });

    // this.db.getWeightClasses().takeUntil(this.ngUnsubscribe).subscribe(weightClasses=>{
    //   this.weightClasses = weightClasses;
    //   this.disabledWeightClass = true;
    // });
  }

  getValues(){
    let result = this.newUserForm.value;
    return result;
  }

  createUserObj(result: any){
    let {userNameBound, userEmailBound, passwordBound, userAffiliationBound, genderBound, ageClassBound, giRankBound, noGiRankBound, weightBound, ageBound} = result;
    let newUser = new User(userNameBound, userEmailBound, passwordBound, giRankBound, noGiRankBound, userAffiliationBound, Number(ageBound), weightBound, 100, "", false, genderBound, new Date().toJSON());
    return newUser;
  }

  //@TODO see whether you can get it to re-direct from here if you're logged in

  processFormInputsToDB(){
    // console.log("loginImprovements entered");
    let result = this.getValues();
    let newUser: User = this.createUserObj(result);

    //The signup and db add HAVE to happen before the subscription. You've made this mistake before
    this.as.emailSignUp(newUser.getEmail(), newUser.getPassword());
    this.db.addUserToDb(newUser);
    this.as.emailLogin(newUser.getEmail(), newUser.getPassword());

    let user:any = this.as.currentUserObservable.subscribe(user=>{
      if(user){
        // console.log("user in currentUserObservable in create-account component");
        // console.log(user);
        // console.log("user.uid in create-account component: " + user.uid);
        newUser.setUid(user.uid);
        // console.log(newUser);
        this.db.getNodeIdFromEmail(user.email).on("child_added", snapshot=>{
          // console.log("got to snapshot in getNodeIdFromEmail");
          // console.log(snapshot.val().id);
          newUser.setId(snapshot.val().id);
          this.db.updateUserInDb(newUser);
        });
      }
      //@TODO test whether trying to create a second account under the same email messes up
    });

    this.router.navigate(['landing']);

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
