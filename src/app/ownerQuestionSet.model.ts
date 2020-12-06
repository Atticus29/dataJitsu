import { OwnerQuestion } from './ownerQuestion.model';
import { FormQuestionBase } from './formQuestionBase.model';

export class OwnerQuestionSet {
  constructor(private collectionId: string, private ownerQuestions:OwnerQuestion[]){}

  static fromForm(collectionId: string, jsonObj: any, questions: FormQuestionBase<string>[]): OwnerQuestionSet{
    // console.log("fromForm entered in OwnerQuestionSet");
    // console.log("questions are:");
    console.log(questions);
    let jsonObjKeys = Object.keys(jsonObj);
    // console.log("jsonObjKeys are");
    console.log(jsonObjKeys);
    let jsonObjVals = Object.values(jsonObj);
    // console.log("jsonObjVals are");
    console.log(jsonObjVals);
    let defaulOwnerQuestion = new OwnerQuestion("Video URL", "Text");
    let ownerQuestions: OwnerQuestion[] = new Array<OwnerQuestion>();
    ownerQuestions.push(defaulOwnerQuestion);
    for(let i = 0; i<questions.length; i++){

      let baseKey: string = questions[i].key.split(/\d+/)[0];
      // console.log("baseKey is: " + baseKey);
      let indexOfJsonObjKeyMatchingCurrentQuestionKey: number = jsonObjKeys.indexOf(questions[i].key);
      // console.log("indexOfJsonObjKeyMatchingCurrentQuestionKey is: " + indexOfJsonObjKeyMatchingCurrentQuestionKey);
      // let currentOwnerQuestion = new OwnerQuestion()
      if(baseKey === "labelQuestionName" || baseKey === "genericLabelQuestionName"){
        let currentOwnerQuestion = new OwnerQuestion(jsonObjVals[indexOfJsonObjKeyMatchingCurrentQuestionKey], jsonObjVals[indexOfJsonObjKeyMatchingCurrentQuestionKey+1]); //TODO this hopefully will not throw index errors where you go beyond the array. Assumes that question entries will always preced their question types
        ownerQuestions.push(currentOwnerQuestion);
      }
    }
    // console.log("ownerQuestions after all of this are: ");
    // console.log(ownerQuestions);
    return new OwnerQuestionSet(collectionId, ownerQuestions);
  }

  getCollectionId(): string{
    return this.collectionId;
  }

  getOwnerQuestions(): OwnerQuestion[]{
    return this.ownerQuestions;
  }

  setOwnerQuestion(ownerQuestions: OwnerQuestion[]){
    this.ownerQuestions = ownerQuestions;
  }

  setCollectionId(collectionId: string){
    this.collectionId = collectionId;
  }

}
