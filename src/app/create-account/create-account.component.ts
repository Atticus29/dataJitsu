import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  providers: [DatabaseService]
})
export class CreateAccountComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  title: string = "Create an Account";
  genders: Array<string> = ["Female", "Male"];
  weightClasses: any[];
  noGiRanks: any[];
  giRanks: any[];
  ageClasses: any[];


  constructor(private db: DatabaseService) { }

  ngOnInit() {
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

  allValid(){
    return true; //TODO fix
  }

  createUser(){

  }

}
