export class NewsItem {
  private dateAdded: string;
  constructor(public eventName: string, public actor: string, public recipient: string, public timeInitiated: number, public timeCompleted: number, public points: number, public associatedVideoId: string, public isASubmission: boolean, public isSuccessfulAttempt: boolean, public annotatorUserId: string) {
    this.dateAdded = new Date().toJSON();
  }
  getVideoId(): string{
    return this.associatedVideoId;
  }
  updateDateAdded(date: string){
    this.dateAdded = date;
  }

  getMoveName(){
    return this.eventName;
  }
}
