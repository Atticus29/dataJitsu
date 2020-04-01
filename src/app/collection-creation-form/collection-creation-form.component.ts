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


@Component({
  selector: 'app-collection-creation-form',
  templateUrl: './collection-creation-form.component.html',
  styleUrls: ['./collection-creation-form.component.scss']
})
export class CollectionCreationFormComponent extends BaseComponent implements OnInit {
  private localQuestions: Observable<FormQuestionBase<any>[]>;


  constructor(private questionService: QuestionService, private databaseService: DatabaseService, private formProcessingService:FormProcessingService, private trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    console.log("ngOnInit in CollectionCreationFormComponent called");
    this.localQuestions = this.questionService.getNewCollectionQuestions();
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
