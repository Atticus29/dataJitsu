import { constants } from "./constants";

export class EventInVideo {
  static fromJson(jsonObj: any): EventInVideo {
    const eventName: string = jsonObj.eventName;
    const eventCategory: string = jsonObj.eventCategory;
    const actor: string = jsonObj.actor;
    const recipient: string = jsonObj.recipient;
    const timeInitiated: number = jsonObj.timeInitiated;
    const timeCompleted: number = jsonObj.timeCompleted;
    const points: number = jsonObj.points;
    const associatedVideoId: string = jsonObj.associatedVideoId;
    const isASubmission: boolean = jsonObj.isASubmission;
    const isSuccessfulAttempt: boolean = jsonObj.isSuccessfulAttempt;
    const annotatorUserId: string = jsonObj.annotatorUserId;
    // console.log("got to mapping attempt")
    const tmpEventInVideo = new EventInVideo(
      eventName,
      eventCategory,
      actor,
      recipient,
      timeInitiated,
      timeCompleted,
      points,
      associatedVideoId,
      isASubmission,
      isSuccessfulAttempt,
      annotatorUserId
    );
    if (jsonObj.date) {
      tmpEventInVideo.setDate(jsonObj.date);
    }
    if (jsonObj.isWin) {
      tmpEventInVideo.setIsWin(jsonObj.isWin);
    }
    if (jsonObj.numFlags) {
      tmpEventInVideo.setNumFlag(jsonObj.numFlags);
    }
    if (jsonObj.eventName) {
      tmpEventInVideo.setIsVideoActionDelimiter(
        constants.eventNamesThatAreDelimiters.includes(jsonObj.eventName)
      );
    }
    return tmpEventInVideo;
  }
  public dateAdded: string;
  public isWin: boolean;
  public isDraw: boolean;
  public numFlags: number;
  public isVideoActionDelimiter: boolean;
  constructor(
    public eventName: string,
    public eventCategory: string,
    public actor: string,
    public recipient: string,
    public timeInitiated: number,
    public timeCompleted: number,
    public points: number,
    public associatedVideoId: string,
    public isASubmission: boolean,
    public isSuccessfulAttempt: boolean,
    public annotatorUserId: string
  ) {
    this.dateAdded = new Date().toJSON();
    this.isWin = false;
    this.numFlags = 0;
    this.isVideoActionDelimiter =
      constants.eventNamesThatAreDelimiters.includes(eventName);
  }

  setDate(date: string) {
    this.dateAdded = date;
  }

  setIsVideoActionDelimiter(status: boolean) {
    this.isVideoActionDelimiter = status;
  }

  setIsWin(status: boolean) {
    this.isWin = status;
  }

  setIsDraw(status: boolean) {
    this.isDraw = status;
  }

  setNumFlag(newVal: number) {
    this.numFlags = newVal;
  }

  getVideoId(): string {
    return this.associatedVideoId;
  }
  updateDateAdded(date: string) {
    this.dateAdded = date;
  }

  getMoveName() {
    return this.eventName;
  }
}
