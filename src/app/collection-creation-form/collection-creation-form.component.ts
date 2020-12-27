import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, combineLatest, of } from 'rxjs';
import { takeUntil, takeLast, takeWhile, take, withLatestFrom } from 'rxjs/operators';
// import {MatSnackBar} from '@angular/material';
import {MatStepper} from '@angular/material/stepper';

// import { constants } from '../constants';

import { TrackerService } from '../tracker.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';
import { Collection } from '../collection.model';
// import { DatabaseService } from '../database.service';
import { AuthorizationService } from '../authorization.service';



@Component({
  selector: 'app-collection-creation-form',
  templateUrl: './collection-creation-form.component.html',
  styleUrls: ['./collection-creation-form.component.scss']
})
export class CollectionCreationFormComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', {static:false}) stepper: MatStepper;
  private localCurrentStep: number;


  private localUser: any;
  private currentStepInStepper: Observable<number>;
  private localValid: boolean = false;

  constructor(private formProcessingService:FormProcessingService, private trackerService: TrackerService) {
    super();
  }

  ngOnDestroy(){
    this.formProcessingService.captureFormResults(["Stop"]);
    this.formProcessingService.captureQuestionArrayOfCurrentForm(["Stop"]);
  }
  ngAfterViewInit(){
    let stepNum = this.stepper?this.stepper.selectedIndex:0;
  }

  ngOnInit() {
    this.formProcessingService.nextButtonClicked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(nextButtonClicked=>{
      if(nextButtonClicked){
        this.stepper.next();
      } else{
        // this.stepper.reset();
      }
    });
  }

}
