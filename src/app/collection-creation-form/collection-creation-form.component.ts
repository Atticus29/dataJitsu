import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, combineLatest, of } from 'rxjs';
import { takeUntil, takeLast, takeWhile, take, withLatestFrom } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {MatStepper} from '@angular/material/stepper';

import { constants } from '../constants';
import { QuestionService } from '../question.service';
import { TrackerService } from '../tracker.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';
import { Collection } from '../collection.model';
import { FormQuestionBase } from '../formQuestionBase.model';
import { DatabaseService } from '../database.service';
import { AuthorizationService } from '../authorization.service';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';


@Component({
  selector: 'app-collection-creation-form',
  templateUrl: './collection-creation-form.component.html',
  styleUrls: ['./collection-creation-form.component.scss']
})
export class CollectionCreationFormComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', {static:false}) stepper: MatStepper;
  private currentStep: number;
  private localCollectionQuestions: FormQuestionBase<any>[];
  private localEntryDetailQuestions: FormQuestionBase<any>[];
  private localCollectionConfigOptions: DynamicFormConfiguration;
  private localEntryDetailConfigOptions: DynamicFormConfiguration;
  private localUser: any;
  private localStop: boolean = false; //TODO faster than the observable, which seems to not be catching up with its own stop? Making it not useful??
  // private localCategoryWithItemsQuestions: Observable<FormQuestionBase<any>[]>;
  private currentStepInStepper: Observable<number>;

  constructor(private questionService: QuestionService, private databaseService: DatabaseService, private formProcessingService:FormProcessingService, private trackerService: TrackerService, public snackBar: MatSnackBar) {
    super();
  }

  ngOnDestroy(){
    this.formProcessingService.setAllFormThreadsTo("Stop");
    this.formProcessingService.setAllQuestionThreadsTo("Stop");
  }
  ngAfterViewInit(){
    let stepNum = this.stepper?this.stepper.selectedIndex:0;
    this.formProcessingService.questionThreadCounter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currentQuestionThreadNum =>{
      if(currentQuestionThreadNum >0){
        this.formProcessingService.questionThread[currentQuestionThreadNum-1].pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
          this.localCollectionQuestions = newQuestions;
        });
        let formThread = this.formProcessingService.formThread;
        if(formThread.length>0){
          let formResultObservableWithLatestQuestions = formThread[stepNum].pipe(withLatestFrom(this.formProcessingService.questionThread[stepNum]));
          formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
            let formResults = combinedResults[0];
            let currentFormQuestions = combinedResults[1];
            if(formResults){
              if(formResults !== "Stop"){
                if(formResults.collectionName){
                    if(currentFormQuestions){ //&& !this.localStop
                      if(currentFormQuestions !== "Stop"){
                        let newCollection = Collection.fromForm(formResults, currentFormQuestions);
                        if(this.localUser && this.localUser.id){
                          this.databaseService.addCollectionToDatabase(newCollection, this.localUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(additionStatus =>{
                            if(additionStatus){
                              this.openSnackBar(constants.collectionAddedNotification);
                            }else{
                              this.openSnackBar(constants.collectionAlreadyExistsNotification);
                            }
                          });
                        }
                      }
                    }
                  }
                }
              }
            });
          }
      }
    });
  }

  ngOnInit() {
    this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionQuestions =>{
      this.localCollectionQuestions = collectionQuestions;
    });
    this.questionService.getNewEntryDetailQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(entryQuestions =>{
      this.localEntryDetailQuestions = entryQuestions;
    });
    this.questionService.getCollectionQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      this.localCollectionConfigOptions = new DynamicFormConfiguration(questionResults,1);
    });

    this.questionService.getOriginalCollectionOwnerQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      this.localEntryDetailConfigOptions = new DynamicFormConfiguration(questionResults,2);
    });
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      if(user){
        this.localUser = user;
      }
    });

  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 1000, //TODO change to 3000 once testing is complete a feature is good to go
    });
  }
}
