  import { constants } from './constants';

export class EventInVideo {
  private dateAdded: string;
  public isWin: boolean;
  public isDraw: boolean;
  public numFlags: number;
  public isVideoActionDelimiter: boolean;
  constructor(public eventName: string, public eventCategory: string, public actor: string, public recipient: string, public timeInitiated: number, public timeCompleted: number, public points: number, public associatedVideoId: string, public isASubmission: boolean, public isSuccessfulAttempt: boolean, public annotatorUserId: string) {
    this.dateAdded = new Date().toJSON();
    this.isWin = false;
    this.numFlags = 0;
    this.isVideoActionDelimiter = constants.eventNamesThatAreDelimiters.includes(eventName);
  }

  static fromJson (jsonObj: any): EventInVideo{
    let eventName: string = jsonObj.eventName;
    let eventCategory: string = jsonObj.eventCategory;
    let actor: string = jsonObj.actor;
    let recipient: string = jsonObj.recipient;
    let timeInitiated: number = jsonObj.timeInitiated;
    let timeCompleted: number = jsonObj.timeCompleted;
    let points: number = jsonObj.points;
    let associatedVideoId: string = jsonObj.associatedVideoId;
    let isASubmission: boolean = jsonObj.isASubmission;
    let isSuccessfulAttempt: boolean = jsonObj.isSuccessfulAttempt;
    let annotatorUserId: string = jsonObj.annotatorUserId;
    // console.log("got to mapping attempt")
    let tmpEventInVideo = new EventInVideo( eventName, eventCategory, actor, recipient, timeInitiated, timeCompleted, points, associatedVideoId, isASubmission, isSuccessfulAttempt, annotatorUserId);
    if(jsonObj.date){
      tmpEventInVideo.setDate(jsonObj.date);
    };
    if(jsonObj.isWin){
      tmpEventInVideo.setIsWin(jsonObj.isWin);
    };
    if(jsonObj.numFlags){
      tmpEventInVideo.setNumFlag(jsonObj.numFlags);
    };
    if(jsonObj.eventName){
      tmpEventInVideo.setIsVideoActionDelimiter(constants.eventNamesThatAreDelimiters.includes(jsonObj.eventName));
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
