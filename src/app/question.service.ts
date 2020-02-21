import { Injectable }       from '@angular/core';

import { DropdownQuestion } from './dropdownQuestion.model';
import { FormQuestionBase }     from './formQuestionBase.model';
import { TextQuestion }  from './textFormQuestion.model';
import { of } from 'rxjs';

@Injectable()
export class QuestionService{
  //TODO get from a remote source of question metadata
  getQuestions(){
    let questions: FormQuestionBase<string>[] = [];
    let categoryNameQuestion: TextQuestion = new TextQuestion({
      key: 'categoryName',
      label: 'Category Name',
      value: '',
      required: true,
      placeHolder: 'E.g., Behavior or Chapter Section',
      type: 'text',
      order: 1
    });
    let optionQuestion: TextQuestion = new TextQuestion({
      key: 'categoryName',
      label: 'Category Name',
      value: 'E.g., Chapter Section',
      required: true,
      type: 'text',
      order: 1
    });
    questions.push(categoryNameQuestion);

    return of(questions.sort((a, b) => a.order - b.order));
  }
}
