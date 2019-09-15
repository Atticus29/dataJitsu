import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  public startTimePoint: BehaviorSubject<number> = new BehaviorSubject(0);
  public endTimePoint: BehaviorSubject<number> = new BehaviorSubject(1);
  public points: BehaviorSubject<number> = new BehaviorSubject(-1);
  public moveCategory: BehaviorSubject<string> = new BehaviorSubject("No Category Currently Selected");
  public moveName: BehaviorSubject<string> = new BehaviorSubject("No Annotation Currently Selected");
  public currentMatch: BehaviorSubject<string> = new BehaviorSubject("currentMatch");
  public performer: BehaviorSubject<string> = new BehaviorSubject("Nobody");
  public recipient: BehaviorSubject<string> = new BehaviorSubject("Nobody");
  public matchId: BehaviorSubject<string> = new BehaviorSubject("tmpId");
  public videoResumeStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public submission: BehaviorSubject<string> = new BehaviorSubject<string>("No");
  public annotationBegun: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public attemptStatus: BehaviorSubject<string> = new BehaviorSubject("Yes");
  public currentUserBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public desiredJumpStartTime: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public fetchNewAnnotations: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  resetAllExceptCurrentMatch(){
    console.log("resetAllExceptCurrentMatch has been called");
    this.startTimePoint.next(-1);
    this.endTimePoint.next(-1);
    this.points.next(-1);
    this.moveName.next("No Annotation Currently Selected");
    this.moveCategory.next("No Category Currently Selected");
    this.performer.next("Nobody");
    this.recipient.next("Nobody");
    // this.matchId.next("tmpId");
    this.videoResumeStatus.next(false);
    this.submission.next("No");
    this.annotationBegun.next(false);
    this.attemptStatus.next("Yes");
    console.log("resetAllExceptCurrentMatch has been completed");
  }

  resetAll(){
    this.startTimePoint.next(-1);
    this.endTimePoint.next(-1);
    this.points.next(-1);
    this.moveName.next("No Annotation Currently Selected");
    this.moveCategory.next("No Category Currently Selected");
    this.currentMatch.next("currentMatch");
    this.performer.next("Nobody");
    this.recipient.next("Nobody");
    this.matchId.next("tmpId");
    this.videoResumeStatus.next(false);
    this.submission.next("No");
    this.attemptStatus.next("Yes");
    this.annotationBegun.next(false);
  };
}
