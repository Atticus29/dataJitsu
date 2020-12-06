export class OwnerQuestion {
  // private question: string;
  // private questionType: string;
  constructor(private question: string, private questionType:string){}

  getQuestion(): string{
    return this.question;
  }

  getQuestionType(): string{
    return this.question;
  }

  setQuestion(question: string){
    this.question = question;
  }

  setQuestionType(questionType: string){
    this.questionType = questionType;
  }

}
