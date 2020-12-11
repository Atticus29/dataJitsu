import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { DropdownQuestion } from './dropdownQuestion.model';
import { FormQuestionBase }     from './formQuestionBase.model';
import { TextQuestion }  from './textFormQuestion.model';
import { Collection } from './collection.model';
import { OwnerQuestion } from './ownerQuestion.model';

@Injectable()
export class QuestionService{
  private collectionNameQuestion: TextQuestion = new TextQuestion({
    key: 'collectionName',
    label: 'Collection Name',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Pyrenean Ibex Behavior Videos or Biology 101 Course Videos',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false
  });
  private categoryNameQuestion: TextQuestion = new TextQuestion({
    key: 'categoryName',
    label: 'Category Name',
    groupLabel: 'Category',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Mating Behavior or Chapter Section',
    type: 'text',
    order: 2,
    submitAfterThisQuestion: false
  });
  private collectionItemQuestion: TextQuestion = new TextQuestion({
    key: 'itemName',
    label: 'Item Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: true,
    disableAddButtonIfCurrentValueIsBlank: true,
    disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: true,
    indentThisQuestion: true,
    placeHolder: 'E.g., Mating display or Emergent Properties of Water',
    type: 'text',
    order: 3,
    submitAfterThisQuestion: true
  });
  private labelQuestion: TextQuestion = new TextQuestion({
    key: 'labelQuestionName',
    label: 'What label do you want to give your first question to your user?',
    groupLabel: "Question For Your Users",
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Video URL (note that this question is required and will be automatically generated)',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false
  });
  private genericLabelQuestion: TextQuestion = new TextQuestion({
    key: 'genericLabelQuestionName',
    label: 'What label do you want to give your next question to your user?',
    groupLabel: "Question For Your Users",
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Video URL (note that this question is required and will be automatically generated)',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false
  });
  private inputTypeQuestion: DropdownQuestion = new DropdownQuestion({
    key: 'inputTypeQuestionName',
    label: 'What type of question do you want this question to be?',
    groupLabel: "Question For Your Users",
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: true,
    disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
    indentThisQuestion: false,
    type: 'dropdown',
    order: 2,
    dropdownOptions: [{key:'text', value:'Text'}, {key:'dropdown', value:'Dropdown'}, {key:'datepicker', value:'Date Picker'}],
    submitAfterThisQuestion: true
  });
  private genericInputTypeQuestion: DropdownQuestion = new DropdownQuestion({
    key: 'inputTypeQuestionName',
    label: 'What type of question do you want this question to be?',
    groupLabel: "Question For Your Users",
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: true,
    indentThisQuestion: true,
    type: 'dropdown',
    order: 2,
    dropdownOptions: [{key:'text', value:'Text'}, {key:'dropdown', value:'Dropdown'}, {key:'datepicker', value:'Date Picker'}],
    submitAfterThisQuestion: true
  });

  getNewCollectionQuestions(){
    let newCollectionQuestions: FormQuestionBase<string>[] = [];
    newCollectionQuestions.push(this.collectionNameQuestion);
    newCollectionQuestions.push(this.categoryNameQuestion);
    newCollectionQuestions.push(this.collectionItemQuestion);
    return of(newCollectionQuestions);
  }

  getCollectionQuestionGroupQuestions(){
    let collectionQuestionGroupQuestions: FormQuestionBase<string>[] = [];
    collectionQuestionGroupQuestions.push(this.categoryNameQuestion);
    collectionQuestionGroupQuestions.push(this.collectionItemQuestion);
    return of(collectionQuestionGroupQuestions);
  }

  getOriginalCollectionOwnerQuestionGroupQuestions(){
    let entryDetailQuestions: FormQuestionBase<string>[] = [];
    entryDetailQuestions.push(this.labelQuestion);
    entryDetailQuestions.push(this.inputTypeQuestion);
    return of(entryDetailQuestions);
  }

  getNewEntryDetailQuestions(){
    let entryDetailQuestions: FormQuestionBase<string>[] = [];
    entryDetailQuestions.push(this.genericLabelQuestion);
    entryDetailQuestions.push(this.genericInputTypeQuestion);
    return of(entryDetailQuestions);
  }

  questionsFromDbCollection(collection: Collection): Observable<any>{
    let collectionDbQuestions: FormQuestionBase<string>[] = [];
    // console.log("collection from questionsFromDbCollection is:");
    // console.log(collection);
    let ownerQuestions: OwnerQuestion[] = collection.getOwnerQuestions();
    if(ownerQuestions){
      for(let i=0; i<ownerQuestions.length; i++){
        let currentOwnerQuestion: any = ownerQuestions[i]; //still json somehow
        // console.log("currentOwnerQuestion is: ");
        // console.log(currentOwnerQuestion.question);
        let currentQuestion: FormQuestionBase = new FormQuestionBase({
          value: '',
          key: 'ownerQuestion' + i,
          label: currentOwnerQuestion.question,
          groupLabel: 'Questions about the video',
          required: currentOwnerQuestion.question==="Video URL"? true:false,
          giveOptionToAnswerThisQuestionMultipleTimes: false,
          disableAddButtonIfCurrentValueIsBlank: false,
          disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
          smallSize: 12,
          mediumSize: 6,
          largeSize: 6,
          pairThisQuestionWithPreviousQuestion: i>0? true:false,
          isThisQuestionTheLastOfAQuestionGroup: i<ownerQuestions.length-1 ? false:true,
          indentThisQuestion: false,
          placeHolder: '',
          order: i,
          // controlType: oldQuestion.controlType, //TODO what is this again?
          type: currentOwnerQuestion.questionType,
          submitAfterThisQuestion: i<ownerQuestions.length-1 ? false:true,
          dropdownOptions: []
        });
        if(currentQuestion){
          collectionDbQuestions.push(currentQuestion);
        }
      }
      return of(collectionDbQuestions);
    } else{
      return of(null);
    }
  }

}
