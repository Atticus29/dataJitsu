import { Match } from './match.model';
import { MatchDetails } from './matchDetails.model';
import { MoveInVideo } from './moveInVideo.model';
import { User } from './user.model';

describe ('tests for the match class', ()=>{
  it('can create a match', ()=>{
    let matchDeets: matchDetails = new matchDetails("testId", "worlds", "california", new Date().toJSON(), "athlete1", "athlete2", "rooster", "black", "https://www.youtube.com/watch?v=LPj368_plK0&index=183&list=WL", "male", false, "master 1");
    let move1: MoveInVideo = new MoveInVideo("move 123456", "mount", "athlete1", "athlete2", 361, 379, 4, "testId", false);
    let move2: MoveInVideo = new MoveInVideo("move 123456", "armbar", "athlete1", "athlete2", 361, 379, 0, "testId", true);
    let moveArray: Array<MoveInVideo> = [move1, move2];
    let user1: User = new User("testUser", "Bob the fake user", "bob@bob.com", "red", "sbg", 33, 155, "light", 100);
    let match1: Match = new Match(matchDeets, user1, moveArray);
    let match2: Match = new Match(matchDeets, moveArray);
    expect(match1 instanceof Match).toBe(true);
    expect(match2 instanceof Match).toBe(false); //TODO or to throw an error??
  });
});
