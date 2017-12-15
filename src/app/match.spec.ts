import { match } from './match.model';
import { matchDetails } from './matchDetails.model';
import { moveInVideo } from './moveInVideo.model';
import { user } from './user.model';

describe ('tests for the match class', ()=>{
  it('can create a match', ()=>{
    let matchDeets: matchDetails = new matchDetails("testId", "worlds", "california", new Date(), "athlete1", "athlete2", "rooster", "black", "https://www.youtube.com/watch?v=LPj368_plK0&index=183&list=WL", "male", false, "master 1");
    let move1: moveInVideo = new moveInVideo("move 123456", "mount", "athlete1", "athlete2", 361, 379, 4, "testId", false);
    let move2: moveInVideo = new moveInVideo("move 123456", "armbar", "athlete1", "athlete2", 361, 379, 0, "testId", true);
    let moveArray: Array<moveInVideo> = [move1, move2];
    let user1: user = new user("testUser", "Bob the fake user", "bob@bob.com", "red", "sbg", 33, 155, "light", 100);
    let match1: match = new match(matchDeets, user1, moveArray);
    let match2: match = new match(matchDeets, moveArray);
    expect(match1 instanceof match).toBe(true);
    expect(match2 instanceof match).toBe(false); //TODO or to throw an error??
  });
});
