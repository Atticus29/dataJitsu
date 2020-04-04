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
  private localCollectionQuestions: FormQuestionBase<any>[];
  private localConfigOptions: DynamicFormConfiguration;
  // private localCategoryWithItemsQuestions: Observable<FormQuestionBase<any>[]>;


  constructor(private questionService: QuestionService, private databaseService: DatabaseService, private formProcessingService:FormProcessingService, private trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    // console.log("ngOnInit in CollectionCreationFormComponent called");
    this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionQuestions =>{
      console.log("collectionQuestions from questionService in ngOnInit of CollectionCreationFormComponent is:");
      console.log(collectionQuestions);
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
        if(user.id){
          this.formProcessingService.formResults.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formResults =>{
            // console.log("formResults is:");
            // console.log(formResults);
            if(formResults){
              if(formResults !== "Stop"){
                if(formResults.collectionName){
                  this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currentFormQuestions =>{
                    if(currentFormQuestions){
                      if(currentFormQuestions !== "Stop"){
                        console.log("currentFormQuestions reached in collection-creation form");
                        console.log(currentFormQuestions);
                        let newCollection = Collection.fromForm(formResults, currentFormQuestions);
                        // console.log(newCollection);
                        this.databaseService.addCollectionToDatabase(newCollection, user.id);
                        this.formProcessingService.formResults.next("Stop");
                        this.formProcessingService.questionArrayOfForm.next("Stop");
                      }
                    }
                  });
                }
              }
            }
          });
        }
      }
    });
  }
}
