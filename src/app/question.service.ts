import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { DropdownQuestion } from './dropdownQuestion.model';
import { FormQuestionBase }     from './formQuestionBase.model';
import { TextQuestion }  from './textFormQuestion.model';
import { AutocompleteQuestion } from './autocompleteQuestion.model';
import { SlideToggleQuestion } from './slideToggleFormQuestion.model';
import { DatePickerQuestion } from './datePickerFormQuestion.model';
import { Collection } from './collection.model';
import { OwnerQuestion } from './ownerQuestion.model';
import { DatabaseService } from './database.service';

@Injectable()
export class QuestionService{
  constructor(private databaseService: DatabaseService){}

  private individualOneEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'individualOneUpdate',
    label: 'Individual 1 Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getIndividualNames(),
    enableAddNew: true
  });

  private individualTwoEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'individualTwoUpdate',
    label: 'Individual 2 Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getIndividualNames(),
    enableAddNew: true
  });

  private testIndividualOneEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'individualOneUpdate',
    label: 'Individual 1 Name',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'Individual 1',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false,
    autocompleteOptions: this.databaseService.getIndividualNames(),
    enableAddNew: false
  });

  private testIndividualTwoEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'individualTwoUpdate',
    label: 'Individual 2 Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'Individual 2',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false,
    autocompleteOptions: this.databaseService.getGiRanks(),
    enableAddNew: true

  });

  // private userNameQuestion: TextQuestion = new TextQuestion({ //TODO create user questions here
  //   key: 'usernameQuestion' + i,
  //   label: 'User Name',
  //   value: '',
  //   required: currentOwnerQuestion.question==="Video URL"? true:false,
  //   giveOptionToAnswerThisQuestionMultipleTimes: false,
  //   disableAddButtonIfCurrentValueIsBlank: false,
  //   groupLabel: 'Questions about the video',
  //   disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
  //   pairThisQuestionWithPreviousQuestion: currentOwnerQuestion.type === "Dropdown"? true:false,
  //   isThisQuestionTheLastOfAQuestionGroup: false, //i<ownerQuestions.length-1 ? false:true,
  //   indentThisQuestion: false,
  //   placeHolder: '',
  //   smallSize: 12,
  //   mediumSize: 6,
  //   largeSize: 6,
  //   // order: 1,
  //   controlType: currentOwnerQuestion.questionType,
  //   type: currentOwnerQuestion.questionType,
  //   submitAfterThisQuestion: i<ownerQuestions.length-1 ? false:true,
  //   dropdownOptions: []
  // });
  private secondTestSlideToggle: SlideToggleQuestion = new SlideToggleQuestion({
    key: 'secondTestSlideToggle',
    label: 'Fun',
    secondLabel: 'No Fun',
    value: 'No Fun', //must always match second label
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'N/A, right?',
    type: 'toggle',
    order: 1,
    submitAfterThisQuestion: true
  });
  private testSlideToggleQuestion: SlideToggleQuestion = new SlideToggleQuestion({
    key: 'testSlideToggle',
    label: 'Gay',
    secondLabel: 'Straight',
    value: 'Straight', //must always match second label
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'N/A, right?',
    type: 'toggle',
    order: 1,
    submitAfterThisQuestion: false
  });

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
    dropdownOptions: [{key:'text', value:'Text'}, {key:'dropdown', value:'Dropdown'}, {key:'datepicker', value:'Date Picker'}, {key:'toggle', value:'Slide Toggle'}, {key:'autocomplete', value:'Autocomplete'}],
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
    dropdownOptions: [{key:'text', value:'Text'}, {key:'dropdown', value:'Dropdown'}, {key:'datepicker', value:'Date Picker'}, {key:'toggle', value:'Slide Toggle'}, {key:'autocomplete', value:'Autocomplete'}],
    submitAfterThisQuestion: true
  });

  getTestQuestions(){
    let testQuestions: FormQuestionBase<string>[] = [];
    // testQuestions.push(this.collectionNameQuestion);
    testQuestions.push(this.testIndividualOneEditQuestion);
    testQuestions.push(this.testIndividualTwoEditQuestion);
    testQuestions.push(this.testSlideToggleQuestion);
    testQuestions.push(this.secondTestSlideToggle);
    return of(testQuestions);
  }

  getNewCollectionQuestions(){
    let newCollectionQuestions: FormQuestionBase<string>[] = [];
    newCollectionQuestions.push(this.collectionNameQuestion);
    newCollectionQuestions.push(this.categoryNameQuestion);
    newCollectionQuestions.push(this.collectionItemQuestion);
    return of(newCollectionQuestions);
  }

  getNewCollectionQuestionsAsObj(){
    let newCollectionQuestions: FormQuestionBase<string>[] = [];
    newCollectionQuestions.push(this.collectionNameQuestion);
    newCollectionQuestions.push(this.categoryNameQuestion);
    newCollectionQuestions.push(this.collectionItemQuestion);
    return newCollectionQuestions;
  }

  getShamCollectionQuestionsInstantly(){
    let newCollectionQuestions: FormQuestionBase<string>[] = [];
    newCollectionQuestions.push(this.collectionNameQuestion);
    newCollectionQuestions.push(this.categoryNameQuestion);
    newCollectionQuestions.push(this.collectionItemQuestion);
    return newCollectionQuestions;
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

  getIndividualOneEditQuestion(){
    // console.log("getIndividualOneEditQuestion entered");
    let individualOneQuestionArray: FormQuestionBase<string>[] = [];
    individualOneQuestionArray.push(this.individualOneEditQuestion);
    // console.log("getIndividualOneEditQuestion exiting...");
    return of(individualOneQuestionArray);
  }

  getIndividualOneEditQuestionAsObj(){
    let individualOneQuestionArray: FormQuestionBase<string>[] = [];
    individualOneQuestionArray.push(this.individualOneEditQuestion);
    return individualOneQuestionArray;
  }

  getIndividualTwoEditQuestion(){
    // console.log("getIndividualTwoEditQuestion entered");
    let individualTwoQuestionArray: FormQuestionBase<string>[] = [];
    individualTwoQuestionArray.push(this.individualTwoEditQuestion);
    // console.log("getIndividualTwoEditQuestion exiting...");
    return of(individualTwoQuestionArray);
  }

  getIndividualTwoEditQuestionAsObj(){
    let individualTwoQuestionArray: FormQuestionBase<string>[] = [];
    individualTwoQuestionArray.push(this.individualTwoEditQuestion);
    return individualTwoQuestionArray;
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
      // console.log("ownerQuestions.length is " + ownerQuestions.length);
      for(let i=0; i<ownerQuestions.length; i++){
        let currentOwnerQuestion: any = ownerQuestions[i]; //still json somehow
        // console.log("currentOwnerQuestion is: ");
        // console.log(currentOwnerQuestion.question);
        let questionContent: any = {
          key: 'ownerQuestion' + i,
          label: currentOwnerQuestion.question,
          value: '',
          required: currentOwnerQuestion.question==="Video URL"? true:false,
          giveOptionToAnswerThisQuestionMultipleTimes: false,
          disableAddButtonIfCurrentValueIsBlank: false,
          groupLabel: 'Questions about the video',
          disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
          pairThisQuestionWithPreviousQuestion: currentOwnerQuestion.type === "Dropdown"? true:false,
          isThisQuestionTheLastOfAQuestionGroup: false, //i<ownerQuestions.length-1 ? false:true,
          indentThisQuestion: false,
          placeHolder: '',
          smallSize: 12,
          mediumSize: 6,
          largeSize: 6,
          // order: 1,
          controlType: currentOwnerQuestion.questionType,
          type: currentOwnerQuestion.questionType,
          submitAfterThisQuestion: i<ownerQuestions.length-1 ? false:true,
          dropdownOptions: []
        };
        let currentQuestion: FormQuestionBase<string> = null; //TODO could this and the below branching benefit from abstract factory pattern? Once I grok that, revisit this
        if(questionContent.type && questionContent.type === "Text"){
          currentQuestion = new TextQuestion(questionContent);
        }
        if(questionContent.type && questionContent.type === "Dropdown"){
          currentQuestion = new DropdownQuestion(questionContent); //TODO dropdown question needs a "enableOptionToAddNewOptions" and then a name for the node on firebase to add candidates to
        }
        if(questionContent.type && questionContent.type === "Date Picker"){
          currentQuestion = new DatePickerQuestion(questionContent);
        }
        if(questionContent.type && questionContent.type === "Date Picker"){
          currentQuestion = new AutocompleteQuestion(questionContent);
        }
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
