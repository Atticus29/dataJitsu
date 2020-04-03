import { Component, OnInit } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { takeUntil, takeLast, takeWhile, take } from 'rxjs/operators';

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
  private localCollectionQuestions: Observable<FormQuestionBase<any>[]>;
  private localConfigOptions: DynamicFormConfiguration;
  // private localCategoryWithItemsQuestions: Observable<FormQuestionBase<any>[]>;


  constructor(private questionService: QuestionService, private databaseService: DatabaseService, private formProcessingService:FormProcessingService, private trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    console.log("ngOnInit in CollectionCreationFormComponent called");
    this.localCollectionQuestions = this.questionService.getNewCollectionQuestions();
    // this.localConfigOptions = this.questionService.getCollectionQuestionGroupQuestions();
    this.questionService.getCollectionQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      this.localConfigOptions = new DynamicFormConfiguration(questionResults);
    });
    // this.localCategoryWithItemsQuestions = this.questionService.getNewCategoryWithItemsQuestions();
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      console.log("user is:");
      console.log(user);
      if(user){
        if(user.id){
          this.formProcessingService.formResults.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formResults =>{
            console.log("formResults is:");
            console.log(formResults);
            if(formResults){
              if(formResults !== "Stop"){
                if(formResults.collectionName){
                  let newCollection = Collection.fromForm(formResults);
                  console.log(newCollection);
                  this.databaseService.addCollectionToDatabase(newCollection, user.id);
                  this.formProcessingService.formResults.next("Stop");
                }
              }
            }
          });
        }
      }
    });
  }
}
