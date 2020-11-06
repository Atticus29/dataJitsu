import { Component, OnInit } from '@angular/core';

import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { FormQuestionBase } from '../formQuestionBase.model';
import { QuestionService } from '../question.service';
import { FormProcessingService } from '../form-processing.service';

@Component({
  selector: 'app-collection-creation-stepper-two',
  templateUrl: './collection-creation-stepper-two.component.html',
  styleUrls: ['./collection-creation-stepper-two.component.scss']
})
export class CollectionCreationStepperTwoComponent  extends BaseComponent implements OnInit, OnDestroy {
  private localEntryDetailConfigOptions: DynamicFormConfiguration;
  private localEntryDetailQuestions: FormQuestionBase<any>[];

  constructor(private questionService: QuestionService, private formProcessingService:FormProcessingService) { }

  ngOnInit() {
    this.questionService.getCollectionQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      console.log("questionResults are: ");
      console.log(questionResults);
      this.localEntryDetailConfigOptions = new DynamicFormConfiguration(questionResults, "Next");
    });

    //when form is submitted --------------------
        let self = this;
        this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
          // console.log("isFormSubmitted is: " + isFormSubmitted);
          if(isFormSubmitted){
                // let formResultObservableWithLatestQuestions = formThread[stepNum].pipe(withLatestFrom(this.formProcessingService.questionThread[stepNum]));
                let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
                // let formResultsWithLatestSubmissionConfirmation = this.formProcessingService.formSubmitted.pipe(withLatestFrom(formResultObservableWithLatestQuestions));
                formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
                  console.log("combinedResults are: ");
                  console.log(combinedResults);
                  // console.log("combinedResultsAndChecker is:");
                  // console.log(combinedResultsAndChecker);
                  // let formSubmitted = combinedResultsAndChecker[1];
                  // console.log("has form been submitted?: " + formSubmitted);
                  // let combinedResults = combinedResultsAndChecker[0];
                  let formResults = combinedResults[0];
                  console.log("formResults are:");
                  console.log(formResults);
                  let currentFormQuestions = combinedResults[1];
                  console.log("currentFormQuestions are:");
                  console.log(currentFormQuestions);
                  if(formResults){ //formSubmitted &&
                    console.log("form has been submitted and there are form results");
                    if(formResults !== "Stop"){
                      if(formResults.collectionName){
                        if(currentFormQuestions){
                          if(currentFormQuestions !== "Stop"){
                            let newCollection = Collection.fromForm(formResults, currentFormQuestions);
                            if(this.localUser && this.localUser.id){
                              this.databaseService.addCollectionToDatabase(newCollection, this.localUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(additionStatus =>{
                                if(additionStatus){
                                  self.openSnackBar(constants.collectionAddedNotification);
                                }else{
                                  self.openSnackBar(constants.collectionAlreadyExistsNotification);
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
        });
        //----end form submission doing things
  }

}
