export class NewsItem {
  private dateAdded: string;
  constructor(public moveName: string, public actor: string, public recipient: string, public timeInitiated: number, public timeCompleted: number, public points: number, public associatedMatchId: string, public isASubmission: boolean, public isSuccessfulAttempt: boolean, public annotatorUserId: string) {
    this.dateAdded = new Date().toJSON();
  }
  getMatchId(): string{
    return this.associatedMatchId;
  }
  updateDateAdded(date: string){
    this.dateAdded = date;
  }

  getMoveName(){
    return this.moveName;
  }
}
