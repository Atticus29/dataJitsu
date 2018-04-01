import { MatchDetails } from './matchDetails.model';
import { MoveInVideo } from './moveInVideo.model';
// import { User } from './user.model';

export class Match {
  private isAnnotated: boolean;
  constructor(public matchDeets: MatchDetails, public originalPosterId: string, public movesInTheVideo: Array<MoveInVideo>) {
    this.updateAnnotationStatus();
   }

  addMoveToMatch(move: MoveInVideo){
    this.movesInTheVideo.push(move);
  }

  updateAnnotationStatus(){
    if(this.movesInTheVideo.length >= 1){
      this.isAnnotated = true;
    } else {
      this.isAnnotated = false;
    }
  }

  getMatchDetails(){
    // console.log(this.matchDeets);
    return this.matchDeets;
  }

  getOriginalPosterId(){
    return this.originalPosterId;
  }

  getMovesInTheVideo(){
    return this.movesInTheVideo;
  }

  addMovesToAnnotation(movesInTheVideo: Array<MoveInVideo>){
    //TODO flesh out
    this.updateAnnotationStatus();
  }

  removeMoveFromAnnotation(timeInitiated: number, timeCompleted: number){
    //TODO flesh out
    this.updateAnnotationStatus();
  }
}
