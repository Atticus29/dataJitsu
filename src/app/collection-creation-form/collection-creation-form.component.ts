import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { QuestionService } from '../question.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';
import { Collection } from '../collection.model';
import { FormQuestionBase } from '../formQuestionBase.model';
import { DatabaseService } from '../database.service';


@Component({
  selector: 'app-collection-creation-form',
  templateUrl: './collection-creation-form.component.html',
  styleUrls: ['./collection-creation-form.component.scss']
})
export class CollectionCreationFormComponent extends BaseComponent implements OnInit {
  private localQuestions: Observable<FormQuestionBase<any>[]>;


  constructor(private questionService: QuestionService, private databaseService: DatabaseService, private formProcessingService:FormProcessingService) {
    super();
    this.localQuestions = questionService.getNewCollectionQuestions();
    this.formProcessingService.formResults.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formResults =>{
      if(formResults){
        console.log(formResults);
        if(formResults.collectionName){
          let newCollection = Collection.fromJson(formResults);
          //TODO get user
          this.databaseService.addCollectionToDatabase(newCollection);
        }
      }
    });
  }

  ngOnInit() {
  }

}
