import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  public startTimePoint: BehaviorSubject<number> = new BehaviorSubject(0);
  public endTimePoint: BehaviorSubject<number> = new BehaviorSubject(1);
  public points: BehaviorSubject<number> = new BehaviorSubject(-1);
  public moveName: BehaviorSubject<string> = new BehaviorSubject("No Annotation Currently Selected");
  public currentMatch: BehaviorSubject<string> = new BehaviorSubject("currentMatch");
  public performer: BehaviorSubject<string> = new BehaviorSubject("Nobody");
  public recipient: BehaviorSubject<string> = new BehaviorSubject("Nobody");
  public matchId: BehaviorSubject<string> = new BehaviorSubject("tmpId");
  public videoResumeStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public submission: BehaviorSubject<string> = new BehaviorSubject<string>("No");
  public annotationBegun: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }
}
