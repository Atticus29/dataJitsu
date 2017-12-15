import { matchDetails } from './matchDetails.model';
import { moveInVideo } from './moveInVideo.model';

export class match {
  constructor(public matchDeets: matchDetails, public movesInTheVideo: Array<moveInVideo>) { }
}
