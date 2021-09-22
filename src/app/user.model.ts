import { event } from 'jquery';
import { constants } from './constants';
import { EventInVideo } from './eventInVideo.model';
import { ReputationLog } from './reputationLog.model';

export class User {
  public id: string;
  private weightClass: string;
  private ageClass: string;
  public uid: string;
  private privileges: {};
  private votingInfo: {};
  public paidStatus: boolean;
  private annotatedEnoughOverride: boolean;
  private reputationLog: ReputationLog;
  private eventsInVideo: EventInVideo[];

  static fromJson(jsonObj: any): User {
    const affiliation: string = jsonObj.affiliation;
    const age: number = jsonObj.age;
    const annotatedEnoughOverride: boolean = jsonObj.annotatedEnoughOverride;
    const dateCreated: string = jsonObj.dateCreated;
    const dateLastAnnotated: string = jsonObj.dateLastAnnotated;
    const email: string = jsonObj.email;
    const gender: string = jsonObj.gender;
    const giRank: string = jsonObj.giRank;
    const id: string = jsonObj.id;
    const areThereEvents: boolean = jsonObj.eventsAnnotated ? true : false;
    const eventsAnnotated: EventInVideo[] = areThereEvents ? Object.values(jsonObj.eventsAnnotated).map(EventInVideo.fromJson) : [];
    const name: string = jsonObj.name;
    const noGiRank: string = jsonObj.noGiRank;
    const paidStatus: boolean = jsonObj.paidStatus;
    const password: string = jsonObj.password;
    const privileges: {} = jsonObj.privileges;
    const isThereReputationLog: boolean = jsonObj.reputationLog ? true : false;
    const reputationLog: ReputationLog = isThereReputationLog ? ReputationLog.fromJson(jsonObj.reputationLog) : null;
    const reputationPoints: number = jsonObj.reputationPoints;
    const uid: string = jsonObj.uid;
    const annotationVotesCastToday: number = jsonObj.votingInfo ? jsonObj.votingInfo.annotationVotesCastToday : 0;
    const weight: number = jsonObj.weight;
    const newUser = new User(
      name,
      email,
      password,
      giRank,
      noGiRank,
      affiliation,
      age,
      weight,
      reputationPoints,
      dateLastAnnotated,
      gender,
      dateCreated
    );
    newUser.setVotesCastToday(annotationVotesCastToday);
    newUser.setId(id);
    newUser.setUid(uid);
    if (reputationLog) {newUser.setReputationLog(reputationLog); }
    newUser.setPrivileges(privileges);
    newUser.setPaidStatus(paidStatus);
    newUser.setAnnotatedEnoughOverride(annotatedEnoughOverride);
    if (eventsAnnotated) { newUser.addEventsInVideo(eventsAnnotated); }
    return newUser;
  }

  constructor(
      public name: string,
      public email: string,
      public password: string,
      public giRank: string,
      public noGiRank: string,
      public affiliation: string,
      public age: number,
      public weight: number,
      public reputationPoints: number,
      public dateLastAnnotated: string,
      public gender: string,
      public dateCreated: any
    ) {
    this.privileges = {
      isAdmin: false,
      isModerator: false, // can confirm removal of move names and downvoted/flagged annotations
      canEditMatches: false,
      canAnnotateVideos: true,
      canRateMatches: true,
      canRateAnnotations: false,
      canFlagAnnotations: false,
      canFlagUsers: false,
      canViewAllMatches: false,
      canEditVideo: false
    };
    this.votingInfo = {
      annotationVoteQuota: constants.annotationVoteQuota,
      annotationVotesCastToday: 0
    }
    this.paidStatus = false;
    this.annotatedEnoughOverride = false;
  }

  addEventsInVideo(newEvents: EventInVideo[]) {
    if (this.eventsInVideo) {
      this.eventsInVideo.concat(newEvents); // TODO check that this works correctly
    } else {
      this.eventsInVideo = newEvents;
    }
  }

  setPaidStatus(paidStatus: boolean) {
    this.paidStatus = paidStatus;
  }

  setAnnotatedEnoughOverride(annotatedEnoughOverrideStatus: boolean) {
    this.annotatedEnoughOverride = annotatedEnoughOverrideStatus;
  }

  isValidWeight(): boolean {
    return (this.weight < 8 || this.weight > 1400);
  }

  setPrivileges(privileges: {}) {
    this.privileges = privileges;
  }

  setReputationLog(repLog: ReputationLog) {
    this.reputationLog = repLog;
  }

  setVotesCastToday(numVotes: number) {
    this.votingInfo = {
      annotationVoteQuota: constants.annotationVoteQuota,
      annotationVotesCastToday: numVotes
    }
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
