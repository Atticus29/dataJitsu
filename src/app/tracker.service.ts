import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  public startTimePoint: BehaviorSubject<number> = new BehaviorSubject(0);
  public endTimePoint: BehaviorSubject<number> = new BehaviorSubject(1);
  public moveName: BehaviorSubject<string> = new BehaviorSubject("tempMove");
  public currentMatch: BehaviorSubject<string> = new BehaviorSubject("currentMatch");
  public performer: BehaviorSubject<string> = new BehaviorSubject("Nobody");

  constructor() { }
}
