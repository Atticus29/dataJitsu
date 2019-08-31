import { Match } from './match.model';
import { MatchDetails } from './matchDetails.model';
import { MoveInVideo } from './moveInVideo.model';
import { User } from './user.model';

describe ('tests for the match class', ()=>{
  it('can create a match', ()=>{
    let matchDeets: MatchDetails = new MatchDetails("worlds", "california", new Date().toJSON(), "athlete1", "athlete2", "rooster", "black belt", "https://www.youtube.com/watch?v=LPj368_plK0&index=183&list=WL", "male", false, "master 1");
    let move1: MoveInVideo = new MoveInVideo("mount", "athlete1", "athlete2", 361, 379, 4, "testId", false, true, "annotatorIdTest");
    let move2: MoveInVideo = new MoveInVideo("armbar", "athlete1", "athlete2", 361, 379, 0, "testId", true, true,"annotatorIdTest");
    let moveArray: Array<MoveInVideo> = [move1, move2];
    // let user1: User = new User("Bob the fake user", "bob@bob.com", "red1234567","black belt", "elite", "sbg", 33, 155, 100, "", "male",new Date().toJSON());
    let match1: Match = new Match(matchDeets, "user1Id", moveArray);
    let match2: Match = new Match(matchDeets,"user2Id", moveArray);
    expect(match1 instanceof Match).toBe(true);
    expect(match2 instanceof Match).toBe(false); //@TODO or to throw an error??
  });
});
