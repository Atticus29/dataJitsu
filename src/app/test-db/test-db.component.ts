import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';
import { DatabaseService } from '../database.service';
import { User } from '../user.model';
import { allCurrentMoves } from '../moves';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-test-db',
  templateUrl: './test-db.component.html',
  styleUrls: ['./test-db.component.scss'],
  providers: [DatabaseService]
})
export class TestDbComponent extends BaseComponent implements OnInit {
  ages: Array<string>;
  giRanks: Array<string>;
  nogiRanks: Array<string>;
  genders: Array<string>;
  weightClasses: Array<string>;
  athleteNames: Array<string>;

  constructor(private db: DatabaseService) {
    super();
  }

  ngOnInit() {
    // console.log(allCurrentMoves);
    // this.db.addMovesListToDb(allCurrentMoves); //TODO this is the line to uncomment

    this.athleteNames = ["Tonon, Garry", "Gracie, Kron", "Garcia, Marcelo", "Oliveira, Arnaldo", "Cornelius, Kennan", "Lo, Leandro", "Musumeci, Michael", "Miyao, João", "Mendes, Rafael", "Charles, Rubens Cobrihna", "Santana, Murilo", "Barral, Romulo", "Ribeiro, Vitor 'Shaolin'",
     "Augusto, Fernando 'Terere'", "Dern, Mackenzie", "Nicolini, Michelle", "Enick, Trayton", "Deodara, Dirt", "Diógenes de Aquino, Thamires", "Alencar, Ana Talita de Oliveira", "Martinez, Richie 'The Boogeyman'",
   "Jones, Craig", "Meregali, Nicholas de Barcellos", "Rice, Tanner", "Ribeiro, Xande", "Pena, Felipe",
 "Ryan, Gordon", "Malfacine,Bruno da Silva", "Gabriel,Rodnei Barbosa Junior", "Orian, Kat", "Gilardi, Zach",
"Gundlach, Andrew", "Candela, Austin", "Fisher, Mark", "Un-named Athlete"];

    // this.db.addAthleteNamesToDb(this.athleteNames);
    //
    // let matchDeets: MatchDetails = new MatchDetails("worlds", "california", new Date().toJSON(), "athlete1", "athlete2", "rooster", "black", "https://www.youtube.com/watch?v=LPj368_plK0&index=183&list=WL", "male", false, "master 1");
    // let move1: MoveInVideo = new MoveInVideo("move 123456", "mount", "athlete1", "athlete2", 361, 379, 4, "testId", false);
    // let move2: MoveInVideo = new MoveInVideo("move 123456", "armbar", "athlete1", "athlete2", 361, 379, 0, "testId", true);
    // let moveArray: Array<MoveInVideo> = [move1, move2];
    // let user1: User = new User("Bob the fake user", "bob@bob.com","1234567", "purple", "advanced", "sbg", 33, 155, 100, new Date().toJSON(), true, "Male", new Date().toJSON());
    // //@TODO register in auth and add uid and then log out
    // let uid = this.db.addUserToDbAndReturnUserId(user1);
    // user1.setUid(uid);
    //
    // let match1: Match = new Match(matchDeets, uid, moveArray);
    // this.db.addMatchToDb(match1);
    //
    // this.weightClasses = ["Rooster", "Bantam", "Light-feather", "Feather", "Light", "Middle", "Medium-heavy", "Heavy", "Super-heavy", "Ultra-heavy", "Absolute", "Add new weight class"];
    // this.weightClasses.forEach(weightClass=>{
    //   this.db.addWeightClassToDb(weightClass);
    // });
    //
    // this.ages = ["Youth", "Juvenile1", "Juvenile2", "Adult", "Master 1", "Master 2", "Master 3", "Master 4", "Master 5", "Master 6", "Add new age class"];
    // this.ages.forEach(ageClass=>{
    //   this.db.addAgeClassToDb(ageClass);
    // });
    //
    // this.giRanks = ["White belt", "Grey belt", "Yellow belt", "Orange belt", "Green belt", "Blue belt", "Purple belt", "Brown belt", "Black belt", "Add new gi rank"];
    // this.giRanks.forEach(noGiRank=>{
    //   this.db.addGiRankToDb(noGiRank);
    // });
    //
    // this.nogiRanks = ["Beginner", "Intermediate", "Advanced", "Elite", "Add new no gi rank"];
    // this.nogiRanks.forEach(noGiRank=>{
    //   this.db.addNoGiRankToDb(noGiRank);
    // });


  }

}
