import { Injectable, Optional, SkipSelf } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class TrackerService {
  public startTimePoint: BehaviorSubject<number> = new BehaviorSubject(0);
  public endTimePoint: BehaviorSubject<number> = new BehaviorSubject(1);
  public points: BehaviorSubject<number> = new BehaviorSubject(-1);
  public eventCategory: BehaviorSubject<string> = new BehaviorSubject(
    "No Category Currently Selected"
  );
  public moveSubcategory: BehaviorSubject<string> = new BehaviorSubject("");
  public eventName: BehaviorSubject<string> = new BehaviorSubject(
    "No Annotation Currently Selected"
  );
  public currentMatch: BehaviorSubject<string> = new BehaviorSubject(
    "currentMatch"
  );
  public performer: BehaviorSubject<string> = new BehaviorSubject("Nobody");
  public recipient: BehaviorSubject<string> = new BehaviorSubject("Nobody");
  public videoId: BehaviorSubject<string> = new BehaviorSubject("tmpId");
  public videoResumeStatus: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public submission: BehaviorSubject<string> = new BehaviorSubject<string>(
    "No"
  );
  public annotationBegun: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public attemptStatus: BehaviorSubject<string> = new BehaviorSubject("Yes");
  public currentUserBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject(
    null
  );
  public desiredJumpStartTime: BehaviorSubject<number> =
    new BehaviorSubject<number>(null);
  public fetchNewAnnotations: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public youtubePlayerLoadedStatus: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  public currentUserDbId: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentUserUid: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(@Optional() @SkipSelf() parent?: TrackerService) {
    // if (parent) {
    //   throw Error(
    //     `[TrackerService]: trying to create multiple instances,
    //     but this service should be a singleton.`
    //   );
    // }
    // console.log("deleteMe l1 trackerService instantiated");
  }

  resetAllExceptCurrentMatch() {
    // console.log("resetAllExceptCurrentMatch has been called");
    this.startTimePoint.next(-1);
    this.endTimePoint.next(-1);
    this.points.next(-1);
    this.eventName.next("No Annotation Currently Selected");
    this.eventCategory.next("No Category Currently Selected");
    this.moveSubcategory.next("");
    this.performer.next("Nobody");
    this.recipient.next("Nobody");
    // this.videoId.next("tmpId");
    this.videoResumeStatus.next(false);
    this.submission.next("No");
    this.annotationBegun.next(false);
    this.attemptStatus.next("Yes");
    this.youtubePlayerLoadedStatus.next(false);
    // console.log("resetAllExceptCurrentMatch has been completed");
  }

  resetAll() {
    this.startTimePoint.next(-1);
    this.endTimePoint.next(-1);
    this.points.next(-1);
    this.eventName.next("No Annotation Currently Selected");
    this.eventCategory.next("No Category Currently Selected");
    this.moveSubcategory.next("");
    this.currentMatch.next("currentMatch");
    this.performer.next("Nobody");
    this.recipient.next("Nobody");
    this.videoId.next("tmpId");
    this.videoResumeStatus.next(false);
    this.submission.next("No");
    this.attemptStatus.next("Yes");
    this.annotationBegun.next(false);
    this.youtubePlayerLoadedStatus.next(false);
  }
}
