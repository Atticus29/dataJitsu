  import { constants } from './constants';

export class EventInVideo {
  private dateAdded: string;
  public isWin: boolean;
  public isDraw: boolean;
  public numFlags: number;
  public isVideoActionDelimiter: boolean;
  constructor(public eventName: string, public eventCategory: string, public actor: string, public recipient: string, public timeInitiated: number, public timeCompleted: number, public points: number, public associatedMatchId: string, public isASubmission: boolean, public isSuccessfulAttempt: boolean, public annotatorUserId: string) {
    this.dateAdded = new Date().toJSON();
    this.isWin = false;
    this.numFlags = 0;
    this.isVideoActionDelimiter = constants.eventNamesThatAreDelimiters.includes(eventName);
  }

  static fromJson (jsonObj: any): EventInVideo{
    let moveName: string = jsonObj.moveName;
    let moveCategory: string = jsonObj.moveCategory;
    let actor: string = jsonObj.actor;
    let recipient: string = jsonObj.recipient;
    let timeInitiated: number = jsonObj.timeInitiated;
    let timeCompleted: number = jsonObj.timeCompleted;
    let points: number = jsonObj.points;
    let associatedMatchId: string = jsonObj.associatedMatchId;
    let isASubmission: boolean = jsonObj.isASubmission;
    let isSuccessfulAttempt: boolean = jsonObj.isSuccessfulAttempt;
    let annotatorUserId: string = jsonObj.annotatorUserId;
    // console.log("got to mapping attempt")
    let tmpEventInVideo = new EventInVideo( moveName, moveCategory, actor, recipient, timeInitiated, timeCompleted, points, associatedMatchId, isASubmission, isSuccessfulAttempt, annotatorUserId);
    if(jsonObj.date){
      tmpEventInVideo.setDate(jsonObj.date);
    };
    if(jsonObj.isWin){
      tmpEventInVideo.setIsWin(jsonObj.isWin);
    };
    if(jsonObj.numFlags){
      tmpEventInVideo.setNumFlag(jsonObj.numFlags);
    };
    if(jsonObj.moveName){
      tmpEventInVideo.setIsVideoActionDelimiter(constants.eventNamesThatAreDelimiters.includes(jsonObj.moveName));
    };
    return tmpEventInVideo;
  }

  setDate(date: string){
    this.dateAdded = date;
  }

  setIsVideoActionDelimiter(status: boolean){
    this.isVideoActionDelimiter = status;
  }

  setIsWin(status: boolean){
    this.isWin = status;
  }

  setIsDraw(status: boolean){
    this.isDraw = status;
  }

  setNumFlag(newVal: number){
    this.numFlags = newVal;
  }

  getMatchId(): string{
    return this.associatedMatchId;
  }
  updateDateAdded(date: string){
    this.dateAdded = date;
  }

  getMoveName(){
    return this.eventName;
  }
}
