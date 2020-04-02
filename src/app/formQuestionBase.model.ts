export class FormQuestionBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  giveOptionToAnswerThisQuestionMultipleTimes: boolean;
  pairThisQuestionWithPreviousQuestion: boolean;
  isThisQuestionTheLastOfAQuestionGroup: boolean;
  indentThisQuestion: boolean;
  placeHolder: string;
  order: number;
  controlType: string;
  type: string;
  options: {key: string, value: string}[];

  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      required?: boolean,
      giveOptionToAnswerThisQuestionMultipleTimes?: boolean,
      pairThisQuestionWithPreviousQuestion?: boolean,
      isThisQuestionTheLastOfAQuestionGroup?: boolean,
      indentThisQuestion?: boolean,
      placeHolder?: string,
      order?: number,
      controlType?: string,
      type?: string
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.giveOptionToAnswerThisQuestionMultipleTimes = !!options.giveOptionToAnswerThisQuestionMultipleTimes;
    this.pairThisQuestionWithPreviousQuestion = !!options.pairThisQuestionWithPreviousQuestion;
    this.isThisQuestionTheLastOfAQuestionGroup = !!options.isThisQuestionTheLastOfAQuestionGroup;
    this.indentThisQuestion = !!options.indentThisQuestion;
    this.placeHolder = options.placeHolder || '';
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
  }

  makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(oldQuestion: FormQuestionBase<T>, newStatus:boolean, index: any){
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key.split(/\d+/)[0] + index,
      label: oldQuestion.label,
      required: oldQuestion.required,
      giveOptionToAnswerThisQuestionMultipleTimes: newStatus,
      pairThisQuestionWithPreviousQuestion: oldQuestion.pairThisQuestionWithPreviousQuestion,
      isThisQuestionTheLastOfAQuestionGroup: newStatus,
      indentThisQuestion: oldQuestion.indentThisQuestion,
      placeHolder: oldQuestion.placeHolder,
      order: oldQuestion.order,
      controlType: oldQuestion.controlType,
      type: oldQuestion.type,
    });
  }

  makeNewQuestionAsTheLastOfAQuestionGroup(oldQuestion: FormQuestionBase<T>, newStatus:boolean, index: any){
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key.split(/\d+/)[0] + index,
      label: oldQuestion.label,
      required: oldQuestion.required,
      giveOptionToAnswerThisQuestionMultipleTimes: newStatus,
      pairThisQuestionWithPreviousQuestion: oldQuestion.pairThisQuestionWithPreviousQuestion,
      isThisQuestionTheLastOfAQuestionGroup: newStatus,
      indentThisQuestion: oldQuestion.indentThisQuestion,
      placeHolder: oldQuestion.placeHolder,
      order: oldQuestion.order,
      controlType: oldQuestion.controlType,
      type: oldQuestion.type,
    });
  }

  findParentQuestion(question: FormQuestionBase<T>, questionArray: FormQuestionBase<T>[], index: number){
    let parentQuestion = null;
    for(let i=index; i>=0; i--){
      let currentQuestion = questionArray[i];
      if(currentQuestion.pairThisQuestionWithPreviousQuestion == false){
        parentQuestion = currentQuestion;
        return parentQuestion;
      }
    }
    return parentQuestion;
  }
}
