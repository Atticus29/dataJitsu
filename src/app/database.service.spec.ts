// import { TestBed, inject } from '@angular/core/testing';
// import { Match } from './match.model';
// import { VideoDetails } from './videoDetails.model';
// import { EventInVideo } from './eventInVideo.model';
// import { User } from './user.model';
//
// import { DatabaseService } from './database.service';
//
// describe('DatabaseService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [DatabaseService]
//     });
//   });
//
//   it('should ...', inject([DatabaseService], (service: DatabaseService) => {
//     expect(service).toBeTruthy();
//   }));
// });
//
//
// describe ('tests for the db service', ()=>{
//   it('can add a match to the database', ()=>{
//     let videoDeets: VideoDetails = new VideoDetails("testId", "worlds", "california", new Date().toJSON(), "athlete1", "athlete2", "rooster", "black", "https://www.youtube.com/watch?v=LPj368_plK0&index=183&list=WL", "male", false, "master 1");
//     let move1: EventInVideo = new EventInVideo("move 123456", "mount", "athlete1", "athlete2", 361, 379, 4, "testId", false);
//     let move2: EventInVideo = new EventInVideo("move 123456", "armbar", "athlete1", "athlete2", 361, 379, 0, "testId", true);
//     let moveArray: Array<EventInVideo> = [move1, move2];
//     let user1: User = new User("testUser", "Bob the fake user", "bob@bob.com", "red", "sbg", 33, 155, "light", 100);
//     let match1: Match = new Match(videoDeets, user1, moveArray);
//     let db: DatabaseService = new DatabaseService();
//     db.createMatch(match1);
//
//     expect(match1 instanceof Match).toBe(true);
//
//   });
// });
