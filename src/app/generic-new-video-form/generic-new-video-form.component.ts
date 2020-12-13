import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { Collection } from '../collection.model';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { FormQuestionBase } from '../formQuestionBase.model';
import { QuestionService } from '../question.service';
import { QuestionControlService } from '../question-control.service';
import { FormProcessingService } from '../form-processing.service';

@Component({
  selector: 'app-generic-new-video-form',
  templateUrl: './generic-new-video-form.component.html',
  styleUrls: ['./generic-new-video-form.component.scss']
})
export class GenericNewVideoFormComponent extends BaseComponent implements OnInit {
  private localCollection: Collection = null;
  private localCollectionQuestions: FormQuestionBase<any>[] = this.questionService.getShamCollectionQuestionsInstantly();
  private localCollectionConfigOptions: DynamicFormConfiguration = new DynamicFormConfiguration(this.localCollectionQuestions, [], "Submit");

  constructor(private databaseService: DatabaseService, private route: ActivatedRoute, private questionService: QuestionService, private qcs: QuestionControlService, private formProcessingService: FormProcessingService) {
    super();
  }

  ngOnInit() {
    let self = this;
    this.formProcessingService.restartFormAndQuestions();
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      // console.log(params.collectionId);
      this.databaseService.getCollection(params.collectionId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionResult =>{
        this.localCollection = Collection.fromDataBase(collectionResult);
        // console.log("this.localCollection in generic-video-creation component is: ");
        // console.log(this.localCollection);
        this.questionService.questionsFromDbCollection(this.localCollection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
          // console.log("questionResults are: ");
          // this.localCollectionConfigOptions = new DynamicFormConfiguration(questionResults, [], "Submit");
          self.formProcessingService.buttonDisplayName.next("Submit");
          // console.log("localCollectionConfigOptions are: ");
          // console.log(this.localCollectionConfigOptions);
          // this.localCollectionQuestions = questionResults;
          // console.log("this.localCollectionQuestions are: ");
          // console.log(this.localCollectionQuestions);
          let form = this.qcs.toFormGroup(questionResults);
          // console.log("form in dynamic form component is: ");
          // console.log(form);
          this.formProcessingService.actualForm.next(form);
          this.formProcessingService.captureQuestionArrayOfCurrentForm(questionResults);
          // console.log("this.configOptions.getSubmitButtonDisplay() is: " + this.configOptions.getSubmitButtonDisplay());
          // this.localButtonDisplayName = this.configOptions.getSubmitButtonDisplay();
        });
      })
    });

    this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
      // console.log("newQuestions in generic new video form:");
      // console.log(newQuestions);
      if(newQuestions){
        // console.log("newQuestions are: ");
        // console.log(newQuestions);
        this.localCollectionQuestions = newQuestions;
        //TODO do something here that captures new formControls?
      }
    });

  }

}
