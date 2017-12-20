import { MatchDetails } from './matchDetails.model';
import { MoveInVideo } from './moveInVideo.model';
import { User } from './user.model';

export class Match {
  private isAnnotated: boolean;
  constructor(public matchDeets: MatchDetails, public originalPoster: User, public movesInTheVideo: Array<MoveInVideo>) {
   }


  addMoveToMatch(move: MoveInVideo){
    this.movesInTheVideo.push(move);
  }

  markAsAnnotated(){
    this.isAnnotated = true;
  }
}
