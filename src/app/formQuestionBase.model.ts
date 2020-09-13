export class FormQuestionBase<T> {
  value: T;
  key: string;
  label: string;
  groupLabel: string;
  required: boolean;
  giveOptionToAnswerThisQuestionMultipleTimes: boolean;
  disableAddButtonIfCurrentValueIsBlank: boolean;
  disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: boolean;
  smallSize: number;
  mediumSize: number;
  largeSize: number;
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
      groupLabel?: string,
      required?: boolean,
      giveOptionToAnswerThisQuestionMultipleTimes?: boolean,
      disableAddButtonIfCurrentValueIsBlank?: boolean,
      disableAddNewQuestionGroupButtonIfCurrentValueIsBlank?: boolean,
      smallSize?: number,
      mediumSize?: number,
      largeSize?: number,
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
    this.groupLabel = options.groupLabel || '';
    this.required = !!options.required;
    this.giveOptionToAnswerThisQuestionMultipleTimes = !!options.giveOptionToAnswerThisQuestionMultipleTimes;
    this.disableAddButtonIfCurrentValueIsBlank = !!options.disableAddButtonIfCurrentValueIsBlank;
    this.disableAddNewQuestionGroupButtonIfCurrentValueIsBlank = !!options.disableAddNewQuestionGroupButtonIfCurrentValueIsBlank;
    this.smallSize = options.smallSize === undefined? 12: options.smallSize;
    this.mediumSize = options.mediumSize === undefined? 12: options.mediumSize;
    this.largeSize = options.largeSize === undefined? 12: options.largeSize;
    this.pairThisQuestionWithPreviousQuestion = !!options.pairThisQuestionWithPreviousQuestion;
    this.isThisQuestionTheLastOfAQuestionGroup = !!options.isThisQuestionTheLastOfAQuestionGroup;
    this.indentThisQuestion = !!options.indentThisQuestion;
    this.placeHolder = options.placeHolder || '';
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
  }

  static makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(oldQuestion: FormQuestionBase<string>, newStatus:boolean, disableAddButtonWhenBlank:boolean): FormQuestionBase<string>{
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key, //.split(/\d+/)[0] + index,
      label: oldQuestion.label,
      groupLabel: oldQuestion.groupLabel,
      required: oldQuestion.required,
      giveOptionToAnswerThisQuestionMultipleTimes: newStatus,
      disableAddButtonIfCurrentValueIsBlank: disableAddButtonWhenBlank,
      disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: oldQuestion.disableAddNewQuestionGroupButtonIfCurrentValueIsBlank,
      smallSize: oldQuestion.smallSize,
      mediumSize: oldQuestion.mediumSize,
      largeSize: oldQuestion.largeSize,
      pairThisQuestionWithPreviousQuestion: oldQuestion.pairThisQuestionWithPreviousQuestion,
      isThisQuestionTheLastOfAQuestionGroup: oldQuestion.isThisQuestionTheLastOfAQuestionGroup,
      indentThisQuestion: oldQuestion.indentThisQuestion,
      placeHolder: oldQuestion.placeHolder,
      order: oldQuestion.order,
      controlType: oldQuestion.controlType,
      type: oldQuestion.type,
    });
  }
  static createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(oldQuestion: FormQuestionBase<string>, newStatus:boolean): FormQuestionBase<string>{
    // console.log("entered createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion");
    // console.log("old question is");
    // console.log(oldQuestion);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key,
      label: oldQuestion.label,
      groupLabel: oldQuestion.groupLabel,
      required: oldQuestion.required,
      giveOptionToAnswerThisQuestionMultipleTimes: oldQuestion.giveOptionToAnswerThisQuestionMultipleTimes,
      disableAddButtonIfCurrentValueIsBlank: oldQuestion.disableAddButtonIfCurrentValueIsBlank,
      disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: oldQuestion.disableAddNewQuestionGroupButtonIfCurrentValueIsBlank,
      smallSize: oldQuestion.smallSize,
      mediumSize: oldQuestion.mediumSize,
      largeSize: oldQuestion.largeSize,
      pairThisQuestionWithPreviousQuestion: oldQuestion.pairThisQuestionWithPreviousQuestion,
      isThisQuestionTheLastOfAQuestionGroup: newStatus,
      indentThisQuestion: oldQuestion.indentThisQuestion,
      placeHolder: oldQuestion.placeHolder,
      order: oldQuestion.order,
      controlType: oldQuestion.controlType,
      type: oldQuestion.type,
    });
  }

  static createNewQuestionModifyingKeyOfExistingQuestion(oldQuestion: FormQuestionBase<string>, newKey:string){
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: newKey,
      label: oldQuestion.label,
      groupLabel: oldQuestion.groupLabel,
      required: oldQuestion.required,
      giveOptionToAnswerThisQuestionMultipleTimes: oldQuestion.giveOptionToAnswerThisQuestionMultipleTimes,
      disableAddButtonIfCurrentValueIsBlank: oldQuestion.disableAddButtonIfCurrentValueIsBlank,
      disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: oldQuestion.disableAddNewQuestionGroupButtonIfCurrentValueIsBlank,
      smallSize: oldQuestion.smallSize,
      mediumSize: oldQuestion.mediumSize,
      largeSize: oldQuestion.largeSize,
      pairThisQuestionWithPreviousQuestion: oldQuestion.pairThisQuestionWithPreviousQuestion,
      isThisQuestionTheLastOfAQuestionGroup: oldQuestion.isThisQuestionTheLastOfAQuestionGroup,
      indentThisQuestion: oldQuestion.indentThisQuestion,
      placeHolder: oldQuestion.placeHolder,
      order: oldQuestion.order,
      controlType: oldQuestion.controlType,
      type: oldQuestion.type,
    });
  }

  modifyQuestionGiveOptionToAnswerThisQuestionMultipleTimesStatus(oldQuestion: FormQuestionBase<T>, newStatus:boolean, disableAddButtonWhenBlank: boolean, index: any){
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key.split(/\d+/)[0] + index,
      label: oldQuestion.label,
      groupLabel: oldQuestion.groupLabel,
      required: oldQuestion.required,
      giveOptionToAnswerThisQuestionMultipleTimes: newStatus,
      disableAddButtonIfCurrentValueIsBlank: disableAddButtonWhenBlank,
      disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: oldQuestion.disableAddNewQuestionGroupButtonIfCurrentValueIsBlank,
      smallSize: oldQuestion.smallSize,
      mediumSize: oldQuestion.mediumSize,
      largeSize: oldQuestion.largeSize,
      pairThisQuestionWithPreviousQuestion: oldQuestion.pairThisQuestionWithPreviousQuestion,
      isThisQuestionTheLastOfAQuestionGroup: oldQuestion.isThisQuestionTheLastOfAQuestionGroup,
      indentThisQuestion: oldQuestion.indentThisQuestion,
      placeHolder: oldQuestion.placeHolder,
      order: oldQuestion.order,
      controlType: oldQuestion.controlType,
      type: oldQuestion.type,
    });
  }

  makeNewQuestionAsTheLastOfAQuestionGroup(oldQuestion: FormQuestionBase<T>, newStatus:boolean, disableAddButtonWhenBlank: boolean, index: any){
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key.split(/\d+/)[0] + index,
      label: oldQuestion.label,
      groupLabel: oldQuestion.groupLabel,
      required: oldQuestion.required,
      giveOptionToAnswerThisQuestionMultipleTimes: newStatus,
      disableAddButtonIfCurrentValueIsBlank: disableAddButtonWhenBlank,
      disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: oldQuestion.disableAddNewQuestionGroupButtonIfCurrentValueIsBlank,
      smallSize: oldQuestion.smallSize,
      mediumSize: oldQuestion.mediumSize,
      largeSize: oldQuestion.largeSize,
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

  findParentQuestionIndex(question: FormQuestionBase<T>, questionArray: FormQuestionBase<T>[], index: number){
    let returnVal = null;
    for(let i=index; i>=0; i--){
      let currentQuestion = questionArray[i];
      if(currentQuestion.pairThisQuestionWithPreviousQuestion == false){
        returnVal = i;
        return returnVal;
      }
    }
    return returnVal;
  }

  findLastSiblingQuestionIndex(question: FormQuestionBase<T>, questionArray: FormQuestionBase<T>[], index: number){
    let returnVal = index;
    for(let i=index; i<questionArray.length; i++){
      let currentQuestion = questionArray[i];
      returnVal = i;
      if(currentQuestion.pairThisQuestionWithPreviousQuestion == false){
        returnVal = i-1;
        return returnVal;
      }
    }
    return returnVal;
  }

  static renameNewQuestionGroup(oldQuestionArray: FormQuestionBase<string>[], newQuestionArray: FormQuestionBase<string>[]): FormQuestionBase<string>[]{
    // console.log("renameNewQuestionGroup entered");
    // console.log(oldQuestionArray);
    // console.log(newQuestionArray);
    let returnQuestionArray = new Array<FormQuestionBase<string>>(); //TODO if the copy method ends up not being the problem
    newQuestionArray.forEach(entry =>{
      returnQuestionArray.push(entry);
    });
    for(let i=0; i<oldQuestionArray.length; i++){
      // console.log("i is " + i)
      for(let j=0; j<returnQuestionArray.length; j++){
        // console.log("j is " + j);
        if(returnQuestionArray[j].key === oldQuestionArray[i].key || returnQuestionArray[j].key === newQuestionArray[j].key){
          // console.log("statement evaluates to true");
          let keySeparatedIntoStringAndDigits = returnQuestionArray[j].key.split(/\d+/);
          let baseKey = keySeparatedIntoStringAndDigits[0];
          // console.log("baseKey: " + baseKey);
          // let remainder = +keySeparatedIntoStringAndDigits.slice(1).join('');
          //TODO get the highest number from that baseKey in oldQuestionArray
          let currentHighestIndexWithThisBaseKey = FormQuestionBase.calculateCurrentHighestIndexWithThisBaseKey(baseKey, oldQuestionArray);
          // console.log("remainder: " + remainder + " and remainder+1: " + (remainder+1));
          // console.log("returnQuestion before modification");
          // console.log(returnQuestionArray[j])
          let updatedQuestion = FormQuestionBase.createNewQuestionModifyingKeyOfExistingQuestion(returnQuestionArray[j], baseKey+(currentHighestIndexWithThisBaseKey+1));
          // console.log("updatedQuestion in renameNewQuestionGroup:");
          // console.log(updatedQuestion);
          returnQuestionArray[j] = updatedQuestion;
          // console.log("returnQuestion after modification");
          // console.log(returnQuestionArray[j])
        } else{
          // console.log(returnQuestionArray[j].key + " is not equal to " + oldQuestionArray[i].key + " nor to " + newQuestionArray[j].key);
        }
      }
    }
    return returnQuestionArray;
  }

  static calculateCurrentHighestIndexWithThisBaseKey(baseKey: string, questionArray: FormQuestionBase<string>[]):number{
    // console.log("calculateCurrentHighestIndexWithThisBaseKey entered");
    let returnVal = 0;
    let keys = questionArray.map(question => question.key);
    for(let i=0; i<keys.length; i++){
      if(keys[i].split(/\d+/)[0] === baseKey){
        // console.log(keys[i]);
        // console.log("match with " + baseKey + " found");
        // console.log(keys[i].split(/\D/));
        let currentNum = +keys[i].split(/\D/).slice(1).join('');
        // console.log(currentNum);
        returnVal = Math.max(returnVal, currentNum);
      }
    }
    // console.log("returning: " + returnVal);
    return returnVal;
  }



  static spliceWithoutManipulatingOriginal(oldQuestionArray: FormQuestionBase<string>[], newAdditionalQuestionArray: FormQuestionBase<string>[], indexAfterWhichToInsert: number){
    // console.log("spliceWithoutManipulatingOriginal entered");
    let returnQuestionArray = new Array<FormQuestionBase<string>>();
    for(let i=0; i<oldQuestionArray.length; i++){
      returnQuestionArray.push(oldQuestionArray[i]);
      if(i == indexAfterWhichToInsert){
        for(let j=0; j<newAdditionalQuestionArray.length; j++){
          returnQuestionArray.push(newAdditionalQuestionArray[j]);
        }
      }
    }
    return returnQuestionArray;
  }
}
