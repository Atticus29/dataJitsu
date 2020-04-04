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
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: true,
    indentThisQuestion: true,
    placeHolder: 'E.g., Mating display or Emergent Properties of Water',
    type: 'text',
    order: 3
  });
  // addQuestionAtIndex(question: FormQuestionBase<string>,questionArray: FormQuestionBase<string>[], index: number){
  //   return questionArray.splice(index, 0, question);
  // }

  //TODO get from a remote source of question metadata
  // getNewCategoryItemQuestion(){
  //   let newCollectionItemQuestions: FormQuestionBase<string>[] = [];
  //   let collectionItemQuestion: TextQuestion = new TextQuestion({
  //     key: 'itemName',
  //     label: 'Item Name',
  //     value: '',
  //     required: true,
  //     giveOptionToAnswerThisQuestionMultipleTimes: true,
  //     placeHolder: 'E.g., Mating display or Emergent Properties of Water',
  //     type: 'text',
  //     order: 1
  //   });
  //   newCollectionItemQuestions.push(collectionItemQuestion);
  //   return of(newCollectionItemQuestions.sort((a, b) => a.order - b.order));
  // }

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

}
