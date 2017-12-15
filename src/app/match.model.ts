import { matchDetails } from './matchDetails.model';
import { moveInVideo } from './moveInVideo.model';
import { user } from './user.model';

export class match {
  constructor(public matchDeets: matchDetails, public originalPoster: user, public movesInTheVideo: Array<moveInVideo>) { }
}
