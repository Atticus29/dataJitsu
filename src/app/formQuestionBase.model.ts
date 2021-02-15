import { Observable, of } from 'rxjs';

export class FormQuestionBase<T> {
  value: T;
  key: string;
  label: string;
  secondLabel: string;
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
  submitAfterThisQuestion: boolean;
  type: string;
  dropdownOptions: {key: string, value: string}[];
  autocompleteOptions: Observable<any[]>;
  pathToCandidateValues: string;
  pathToConfirmedValues: string;
  minLength: number;
  isEmailAddress: boolean;
  keyOfOtherQuestionWhereMatchIsDesired: string;


  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      secondLabel?: string,
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
      submitAfterThisQuestion?: boolean,
      type?: string,
      dropdownOptions?: any[],
      autocompleteOptions?: Observable<any[]>,
      pathToCandidateValues?: string,
      pathToConfirmedValues?: string,
      minLength?: number,
      isEmailAddress?: boolean,
      keyOfOtherQuestionWhereMatchIsDesired?: string
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.secondLabel = options.secondLabel || '';
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
    this.submitAfterThisQuestion = options.submitAfterThisQuestion === undefined? false: options.submitAfterThisQuestion;
    this.type = options.type || '';
    this.dropdownOptions = options.dropdownOptions || [];
    this.autocompleteOptions = options.autocompleteOptions || of([]);
    this.pathToCandidateValues = options.pathToCandidateValues || '';
    this.pathToConfirmedValues = options.pathToConfirmedValues || '';
    this.minLength = options.minLength || 0;
    this.isEmailAddress = options.isEmailAddress || false;
    this.keyOfOtherQuestionWhereMatchIsDesired = options.keyOfOtherQuestionWhereMatchIsDesired|| '';
  }

  static makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(oldQuestion: FormQuestionBase<string>, newStatus:boolean, disableAddButtonWhenBlank:boolean, submitAfterThisQuestion: boolean): FormQuestionBase<string>{
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs");
    // console.log("oldQuestion is: ");
    // console.log(oldQuestion);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key, //.split(/\d+/)[0] + index,
      label: oldQuestion.label,
      secondLabel: oldQuestion.secondLabel,
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
      submitAfterThisQuestion: submitAfterThisQuestion,
      type: oldQuestion.type,
      dropdownOptions: oldQuestion.dropdownOptions,
      autocompleteOptions: oldQuestion.autocompleteOptions,
      pathToCandidateValues: oldQuestion.pathToCandidateValues,
      pathToConfirmedValues: oldQuestion.pathToConfirmedValues,
      minLength: oldQuestion.minLength,
      isEmailAddress: oldQuestion.isEmailAddress,
      keyOfOtherQuestionWhereMatchIsDesired: oldQuestion.keyOfOtherQuestionWhereMatchIsDesired
    });
  }
  static createNewQuestionByModifyingExistingQuestion(oldQuestion: FormQuestionBase<string>, isThisQuestionTheLastOfAQuestionGroup:boolean, submitAfterThisQuestion:boolean): FormQuestionBase<string>{
    // console.log("entered createNewQuestionByModifyingExistingQuestion");
    // console.log("old question is");
    // console.log(oldQuestion);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key,
      label: oldQuestion.label,
      secondLabel: oldQuestion.secondLabel,
      groupLabel: oldQuestion.groupLabel,
      required: oldQuestion.required,
      giveOptionToAnswerThisQuestionMultipleTimes: oldQuestion.giveOptionToAnswerThisQuestionMultipleTimes,
      disableAddButtonIfCurrentValueIsBlank: oldQuestion.disableAddButtonIfCurrentValueIsBlank,
      disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: oldQuestion.disableAddNewQuestionGroupButtonIfCurrentValueIsBlank,
      smallSize: oldQuestion.smallSize,
      mediumSize: oldQuestion.mediumSize,
      largeSize: oldQuestion.largeSize,
      pairThisQuestionWithPreviousQuestion: oldQuestion.pairThisQuestionWithPreviousQuestion,
      isThisQuestionTheLastOfAQuestionGroup: isThisQuestionTheLastOfAQuestionGroup,
      indentThisQuestion: oldQuestion.indentThisQuestion,
      placeHolder: oldQuestion.placeHolder,
      order: oldQuestion.order,
      controlType: oldQuestion.controlType,
      submitAfterThisQuestion: submitAfterThisQuestion,
      type: oldQuestion.type,
      dropdownOptions: oldQuestion.dropdownOptions,
      autocompleteOptions: oldQuestion.autocompleteOptions,
      pathToCandidateValues: oldQuestion.pathToCandidateValues,
      pathToConfirmedValues: oldQuestion.pathToConfirmedValues,
      minLength: oldQuestion.minLength,
      isEmailAddress: oldQuestion.isEmailAddress,
      keyOfOtherQuestionWhereMatchIsDesired: oldQuestion.keyOfOtherQuestionWhereMatchIsDesired
    });
  }

  static createNewQuestionModifyingKeyOfExistingQuestion(oldQuestion: FormQuestionBase<string>, newKey:string){
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: newKey,
      label: oldQuestion.label,
      secondLabel: oldQuestion.secondLabel,
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
      order: oldQuestion.order + 1,
      controlType: oldQuestion.controlType,
      type: oldQuestion.type,
      submitAfterThisQuestion: oldQuestion.submitAfterThisQuestion,
      dropdownOptions: oldQuestion.dropdownOptions,
      autocompleteOptions: oldQuestion.autocompleteOptions,
      pathToCandidateValues: oldQuestion.pathToCandidateValues,
      pathToConfirmedValues: oldQuestion.pathToConfirmedValues,
      minLength: oldQuestion.minLength,
      isEmailAddress: oldQuestion.isEmailAddress,
      keyOfOtherQuestionWhereMatchIsDesired: oldQuestion.keyOfOtherQuestionWhereMatchIsDesired
    });
  }

  modifyQuestionGiveOptionToAnswerThisQuestionMultipleTimesStatus(oldQuestion: FormQuestionBase<T>, newStatus:boolean, disableAddButtonWhenBlank: boolean, index: any){
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key.split(/\d+/)[0] + index,
      label: oldQuestion.label,
      secondLabel: oldQuestion.secondLabel,
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
      submitAfterThisQuestion: oldQuestion.submitAfterThisQuestion,
      dropdownOptions: oldQuestion.dropdownOptions,
      autocompleteOptions: oldQuestion.autocompleteOptions,
      pathToCandidateValues: oldQuestion.pathToCandidateValues,
      pathToConfirmedValues: oldQuestion.pathToConfirmedValues,
      minLength: oldQuestion.minLength,
      isEmailAddress: oldQuestion.isEmailAddress,
      keyOfOtherQuestionWhereMatchIsDesired: oldQuestion.keyOfOtherQuestionWhereMatchIsDesired
    });
  }

  makeNewQuestionAsTheLastOfAQuestionGroup(oldQuestion: FormQuestionBase<T>, newStatus:boolean, disableAddButtonWhenBlank: boolean, index: any){
    // console.log("entered makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs. Index is " + index);
    // this.giveOptionToAnswerThisQuestionMultipleTimes = newStatus;
    return new FormQuestionBase({
      value: oldQuestion.value,
      key: oldQuestion.key.split(/\d+/)[0] + index,
      label: oldQuestion.label,
      secondLabel: oldQuestion.secondLabel,
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
      submitAfterThisQuestion: oldQuestion.submitAfterThisQuestion,
      dropdownOptions: oldQuestion.dropdownOptions,
      autocompleteOptions: oldQuestion.autocompleteOptions,
      pathToCandidateValues: oldQuestion.pathToCandidateValues,
      pathToConfirmedValues: oldQuestion.pathToConfirmedValues,
      minLength: oldQuestion.minLength,
      isEmailAddress: oldQuestion.isEmailAddress,
      keyOfOtherQuestionWhereMatchIsDesired: oldQuestion.keyOfOtherQuestionWhereMatchIsDesired
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
    let returnQuestionArray = new Array<FormQuestionBase<string>>(); //TODO if the copy method ends up not being the problem
    newQuestionArray.forEach(entry =>{
      returnQuestionArray.push(entry);
    });
    for(let i=0; i<oldQuestionArray.length; i++){
      for(let j=0; j<returnQuestionArray.length; j++){
        if(returnQuestionArray[j].key === oldQuestionArray[i].key || returnQuestionArray[j].key === newQuestionArray[j].key){
          let keySeparatedIntoStringAndDigits = returnQuestionArray[j].key.split(/\d+/);
          let baseKey = keySeparatedIntoStringAndDigits[0];
          let currentHighestIndexWithThisBaseKey = FormQuestionBase.calculateCurrentHighestIndexWithThisBaseKey(baseKey, oldQuestionArray);
          let updatedQuestion = FormQuestionBase.createNewQuestionModifyingKeyOfExistingQuestion(returnQuestionArray[j], baseKey+(currentHighestIndexWithThisBaseKey+1));
          returnQuestionArray[j] = updatedQuestion;
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
    // console.log("oldQuestionArray:");
    // console.log(oldQuestionArray);
    // console.log("newAdditionalQuestionArray");
    // console.log(newAdditionalQuestionArray);
    // console.log("indexAfterWhichToInsert");
    // console.log(indexAfterWhichToInsert);
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
