import { Component, OnInit } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { takeUntil, takeLast, takeWhile, take } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

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
export class CollectionCreationFormComponent extends BaseComponent implements OnInit {
  private localCollectionQuestions: FormQuestionBase<any>[];
  private localConfigOptions: DynamicFormConfiguration;
  private localUser: any;
  private localStop: boolean = false; //TODO faster than the observable, which seems to not be catching up with its own stop? Making it not useful??
  // private localCategoryWithItemsQuestions: Observable<FormQuestionBase<any>[]>;

  constructor(private questionService: QuestionService, private databaseService: DatabaseService, private formProcessingService:FormProcessingService, private trackerService: TrackerService, public snackBar: MatSnackBar) {
    super();
  }

  ngOnInit() {
    // console.log("ngOnInit in CollectionCreationFormComponent called");
    this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionQuestions =>{
      // console.log("collectionQuestions from questionService in ngOnInit of CollectionCreationFormComponent is:");
      // console.log(collectionQuestions);
      this.localCollectionQuestions = collectionQuestions;
    });
    // this.localConfigOptions = this.questionService.getCollectionQuestionGroupQuestions();
    this.questionService.getCollectionQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      this.localConfigOptions = new DynamicFormConfiguration(questionResults);
    });
    // this.localCategoryWithItemsQuestions = this.questionService.getNewCategoryWithItemsQuestions();
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      // console.log("user is:");
      // console.log(user);
      if(user){
        this.localUser = user;
      }
    });
    this.formProcessingService.formResults.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formResults =>{
      // console.log("formResults is:");
      // console.log(formResults);
      if(formResults){
        if(formResults !== "Stop"){
          // console.log("formResults isn't stop!")
          if(formResults.collectionName){
            this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currentFormQuestions =>{
              // console.log("currentFormQuestions is: ");
              // console.log(currentFormQuestions);
              if(currentFormQuestions){ //&& !this.localStop
                if(currentFormQuestions !== "Stop"){
                  // console.log("currentFormQuestions reached in collection-creation form");
                  // console.log("(currentFormQuestions isn't stop)");
                  // console.log(currentFormQuestions);
                  let newCollection = Collection.fromForm(formResults, currentFormQuestions);
                  console.log("newCollection after scrubbing?");
                  console.log(newCollection);
                  if(this.localUser && this.localUser.id){
                    // console.log("localUser and localUser.id exist");
                    let dbCallCount = 0;
                    this.databaseService.doesCollectionAlreadyExistInDb(newCollection).subscribe(alreadyExists =>{ //.pipe(takeUntil(this.ngUnsubscribe))
                      console.log("dbCallCount is: " + dbCallCount);
                      console.log("does collection already exist?: " + alreadyExists);
                      if(alreadyExists && dbCallCount<1){
                        console.log("already exists hit");
                        // alert("TODO snackbar for already exists");
                        // this.openSnackBar(constants.collectionAlreadyExistsNotification);
                      }
                      if(!alreadyExists){
                        this.databaseService.addCollectionToDatabase(newCollection, this.localUser.id);
                        this.openSnackBar(constants.collectionAddedNotification);
                        dbCallCount += 1;
                        this.formProcessingService.formResults.next("Stop");
                        this.formProcessingService.captureQuestionArrayOfCurrentForm("Stop");
                      }
                    })
                    // this.localStop = true;
                    // console.log("stops supposedly issued");
                  }
                }
              }
            });
          }
        }
      }
    });
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }
}
