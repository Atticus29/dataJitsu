import { constants } from './constants';

export class User {
  private id: string;
  private weightClass: string;
  private ageClass: string;
  public uid: string;
  private privileges: {};
  private votingInfo: {};
  private paidStatus: boolean;
  private annotatedEnoughOverride: boolean;
  constructor(public name: string, public email: string, public password:string, public giRank: string, public noGiRank: string, public affiliation: string, public age: number, public weight: number, public reputationPoints: number, public dateLastAnnotated: string, public gender: string, public dateCreated: any) {
    this.privileges = {
      isAdmin: false,
      canEditMatches: false,
      canAnnotateVideos: true,
      canRateMatches: true,
      canRateAnnotations: false,
      canFlagAnnotations: false,
      canFlagUsers: false,
      canViewAllMatches: false
    };
    this.votingInfo = {
      annotationVoteQuota: constants.annotationVoteQuota,
      annotationVotesCastToday: 0
    }
    this.paidStatus = false;
    this.annotatedEnoughOverride = false;
  }

  isValidWeight(): boolean{
    return (this.weight<8 || this.weight > 1400);
  }

  setUid(uid: string){
    this.uid = uid;
  }

  setId(id: string){
    this.id = id;
  }

  getName(){
    return this.name;
  }

  getId(){
    return this.id;
  }

  getUid(): string{
    return this.uid;
  }

  setWeightClass(weightClass: string){
    this.weightClass = weightClass;
  }

  setAgeClass(ageClass: string){
    this.ageClass = ageClass;
  }

  getPassword(){
    return this.password;
  }

  getUserName(){
    return this.name;
  }

  getEmail(){
    return this.email;
  }

  getPrivileges(){
    return this.privileges;
  }
}
