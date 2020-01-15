import { constants } from './constants';

export class EventInVideo {
  private dateAdded: string;
  public isWin: boolean;
  public isDraw: boolean;
  public numFlags: number;
  public isMatchActionDelimiter: boolean;
  constructor(public moveName: string, public moveCategory: string, public actor: string, public recipient: string, public timeInitiated: number, public timeCompleted: number, public points: number, public associatedMatchId: string, public isASubmission: boolean, public isSuccessfulAttempt: boolean, public annotatorUserId: string) {
    this.dateAdded = new Date().toJSON();
    this.isWin = false;
    this.numFlags = 0;
    this.isMatchActionDelimiter = constants.moveNamesThatAreDelimiters.includes(moveName);
  }

  setIsMatchActionDelimiter(status: boolean){
    this.isMatchActionDelimiter = status;
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
    return this.moveName;
  }
}
