import { Injectable }       from '@angular/core';

import { DropdownQuestion } from './dropdownQuestion.model';
import { FormQuestionBase }     from './formQuestionBase.model';
import { TextQuestion }  from './textFormQuestion.model';
import { of } from 'rxjs';

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
    order: 1
  });
  private categoryNameQuestion: TextQuestion = new TextQuestion({
    key: 'categoryName',
    label: 'Category Name',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Mating Behavior or Chapter Section',
    type: 'text',
    order: 2
  });
  private collectionItemQuestion: TextQuestion = new TextQuestion({
    key: 'itemName',
    label: 'Item Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: true,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: true,
    indentThisQuestion: true,
    placeHolder: 'E.g., Mating display or Emergent Properties of Water',
    type: 'text',
    order: 3
  });
  private labelQuestion: TextQuestion = new TextQuestion({
    key: 'labelQuestionName',
    label: 'What label do you want to give your first question to your user?',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Video URL',
    type: 'text',
    order: 1
  });
  private inputTypeQuestion: DropdownQuestion = new DropdownQuestion({
    key: 'inputTypeQuestionName',
    label: 'What type of question do you want this question to be?',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    type: 'dropdown',
    order: 2,
    options: [{key:'text', value:'text'}, {key:'dropdown', value:'dropdown'}]
  });

  getNewCollectionQuestions(){
    let newCollectionQuestions: FormQuestionBase<string>[] = [];
    newCollectionQuestions.push(this.collectionNameQuestion);
    newCollectionQuestions.push(this.categoryNameQuestion);
    newCollectionQuestions.push(this.collectionItemQuestion);
    // return of(newCollectionQuestions.sort((a, b) => a.order - b.order));
    return of(newCollectionQuestions);
  }

  getCollectionQuestionGroupQuestions(){
    let collectionQuestionGroupQuestions: FormQuestionBase<string>[] = [];
    collectionQuestionGroupQuestions.push(this.categoryNameQuestion);
    collectionQuestionGroupQuestions.push(this.collectionItemQuestion);
    // return of(collectionQuestionGroupQuestions.sort((a, b) => a.order - b.order));
    return of(collectionQuestionGroupQuestions);
  }

  getNewEntryDetailQuestions(){
    let entryDetailQuestions: FormQuestionBase<string>[] = [];
    entryDetailQuestions.push(this.labelQuestion);
    entryDetailQuestions.push(this.inputTypeQuestion);
    // entryDetailQuestions.push(this.inputTypeQuestion);
    // entryDetailQuestions.push(this.inputTypeQuestion);
    // entryDetailQuestions.push(this.inputTypeQuestion);
    // return of(entryDetailQuestions.sort((a, b) => a.order - b.order));
    return of(entryDetailQuestions);
  }

}
