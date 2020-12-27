export class OwnerQuestion {
  // private question: string;
  // private questionType: string;
  constructor(private question: string, private questionType:string, private controlType:string){}

  getQuestion(): string{
    return this.question;
  }

  getQuestionType(): string{
    return this.question;
  }

  getControlType(): string{
    return this.controlType;
  }

  setControlType(controlType: string){
    this.controlType = controlType;
  }

  setQuestion(question: string){
    this.question = question;
  }

  setQuestionType(questionType: string){
    this.questionType = questionType;
  }

}
