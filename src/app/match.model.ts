import { VideoDetails } from './videoDetails.model';
import { EventInVideo } from './eventInVideo.model';
// import { User } from './user.model';

export class Match {
  private isAnnotated: boolean;
  private videoRatings: number[];
  private matchCreated: string;
  constructor(public videoDeets: VideoDetails, public originalPosterId: string, public eventsInVideo: Array<EventInVideo>) {
    this.updateAnnotationStatus(false);
   }
   static fromJson (jsonObj: any): Match{
     let originalPosterId = jsonObj.originalPosterId;
     let moves = null;
     if(jsonObj.event){
      this.eventsInVideo = Object.values(jsonObj.eventsInVideo);
     }else{
      this.eventsInVideo = new Array<EventInVideo>();
     }
     let isAnnotated = jsonObj.isAnnotated? jsonObj.isAnnotated: null;
     let videoRatings = jsonObj.videoRatings? jsonObj.videoRatings: null;
     let matchCreated = jsonObj.matchCreated? jsonObj.matchCreated: null;
     let videoDeets = jsonObj.videoDeets? jsonObj.videoDeets: null; //Object.values(jsonObj.videoDeets);
     if(videoDeets){
      videoDeets =  VideoDetails.fromJson(videoDeets);
     }
     if(this.eventsInVideo){
       let tmpMatch = new Match(videoDeets, originalPosterId, this.eventsInVideo);
       if(isAnnotated){
         tmpMatch.updateAnnotationStatus(isAnnotated)
       };
       if(videoRatings){
         tmpMatch.updateMatchRatings(videoRatings)
       };
       if(this.eventsInVideo){
         tmpMatch.updateMoves(this.eventsInVideo)
       };
       if(matchCreated){
         tmpMatch.updateMatchCreated(matchCreated)
       };
       return tmpMatch;
     }
   }

   updateMatchCreated(matchCreated: string){
     if(typeof matchCreated === 'object'){
       let matchCreatedVals: string[] = Object.values(matchCreated);
       this.matchCreated = matchCreatedVals[0]; //TODO check whether this is working
     }else{
       this.matchCreated = matchCreated;
     }
   }

  addEventToVideo(event: EventInVideo){
    this.eventsInVideo.push(event);
  }

  updateMoves(movesObj: any){
     if(typeof movesObj === 'object'){
       let moves = Object.values(movesObj);
       let movesAsEventsInVideo =  moves.map(EventInVideo.fromJson);
       this.eventsInVideo = movesAsEventsInVideo;
     }else{
       console.log("assuming this is an array?");
       console.log(movesObj);
       let moves = movesObj;
       let movesAsEventsInVideo =  moves.map(EventInVideo.fromJson);
       this.eventsInVideo = movesAsEventsInVideo;
     }
   }

  updateMatchRatings(videoRatingsObj: any){
     if(typeof videoRatingsObj === 'object'){
       let ratings: number[] = Object.values(videoRatingsObj);
       this.videoRatings = ratings;
     }else{
       console.log("assuming this is an array?");
       console.log(videoRatingsObj);
       let ratings = videoRatingsObj;
       this.videoRatings = ratings;
     }
   }

  updateAnnotationStatus(status: boolean){
    this.isAnnotated = status;
  }

  getVideoDetails(){
    // console.log(this.videoDeets);
    return this.videoDeets;
  }

  getOriginalPosterId(){
    return this.originalPosterId;
  }

  getMovesInTheVideo(){
    return this.eventsInVideo;
  }

  addMovesToAnnotation(eventsInVideo: Array<EventInVideo>){
    //TODO flesh out
    this.updateAnnotationStatus(true);
  }

  removeMoveFromAnnotation(timeInitiated: number, timeCompleted: number){
    //TODO flesh out
    let TODOUpdateMe = true;
    this.updateAnnotationStatus(TODOUpdateMe);
  }
}
