import { VideoDetails } from './videoDetails.model';
import { EventInVideo } from './eventInVideo.model';
// import { User } from './user.model';

export class Match {
  private isAnnotated: boolean;
  private matchRatings: number[];
  private matchCreated: string;
  constructor(public matchDeets: VideoDetails, public originalPosterId: string, public moves: Array<EventInVideo>) {
    this.updateAnnotationStatus(false);
   }

   static fromJson (jsonObj: any): Match{
     console.log("got into fromJson");
     let originalPosterId = jsonObj.originalPosterId;
     let moves = null;
     if(jsonObj.moves){
      moves = Object.values(jsonObj.moves);
     }else{
      moves = new Array<EventInVideo>();
     }
     let isAnnotated = jsonObj.isAnnotated;
     let matchRatings = jsonObj.matchRatings;
     let matchCreated = jsonObj.matchCreated;
     let matchDeets = jsonObj.matchDeets; //Object.values(jsonObj.matchDeets);
     let matchDeetArray = new Array<any>();
     matchDeetArray.push(matchDeets);
     matchDeets =  matchDeetArray.map(VideoDetails.fromJson);
     console.log('matchDeets form fromJson:');
     console.log(matchDeets);
     if(moves){
       let tmpMatch = new Match(matchDeets, originalPosterId, moves);
       if(isAnnotated){
         tmpMatch.updateAnnotationStatus(isAnnotated)
       };
       if(matchRatings){
         tmpMatch.updateMatchRatings(matchRatings)
       };
       if(moves){
         tmpMatch.updateMoves(moves)
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
       console.log("assuming this is a string?");
       console.log(matchCreated);
       this.matchCreated = matchCreated;
     }
   }

   updateMoves(movesObj: any){
     if(typeof movesObj === 'object'){
       let moves = Object.values(movesObj);
       let movesAsEventsInVideo =  moves.map(EventInVideo.fromJson);
       this.moves = movesAsEventsInVideo;
     }else{
       console.log("assuming this is an array?");
       console.log(movesObj);
       let moves = movesObj;
       let movesAsEventsInVideo =  moves.map(EventInVideo.fromJson);
       this.moves = movesAsEventsInVideo;
     }
   }

   updateMatchRatings(matchRatingsObj: any){
     if(typeof matchRatingsObj === 'object'){
       let ratings: number[] = Object.values(matchRatingsObj);
       this.matchRatings = ratings;
     }else{
       console.log("assuming this is an array?");
       console.log(matchRatingsObj);
       let ratings = matchRatingsObj;
       this.matchRatings = ratings;
     }
   }

  addMoveToMatch(move: EventInVideo){
    this.moves.push(move);
  }

  updateAnnotationStatus(status: boolean){
    this.isAnnotated = status;
    //I think this has more to do with whether it's been voted as well-annotated by people rather than simply whether it has annotations
    // if(this.movesInTheVideo.length >= 1){
    //   this.isAnnotated = true;
    // } else {
    //   this.isAnnotated = false;
    // }
  }

  getVideoDetails(){
    // console.log(this.matchDeets);
    return this.matchDeets;
  }

  getOriginalPosterId(){
    return this.originalPosterId;
  }

  getMovesInTheVideo(){
    return this.moves;
  }

  // addMovesToAnnotation(movesInTheVideo: Array<EventInVideo>){
  //   //TODO flesh out
  //   this.updateAnnotationStatus();
  // }
  //
  // removeMoveFromAnnotation(timeInitiated: number, timeCompleted: number){
  //   //TODO flesh out
  //   this.updateAnnotationStatus();
  // }
}
