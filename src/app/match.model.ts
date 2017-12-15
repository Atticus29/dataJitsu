import { MatchDetails } from './matchDetails.model';
import { MoveInVideo } from './moveInVideo.model';
import { User } from './user.model';

export class Match {
  constructor(public matchDeets: MatchDetails, public originalPoster: User, public movesInTheVideo: Array<MoveInVideo>) { }
}
