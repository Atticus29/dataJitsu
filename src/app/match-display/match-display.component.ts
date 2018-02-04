import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { MatchDetails } from '../matchDetails.model';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-match-display',
  templateUrl: './match-display.component.html',
  styleUrls: ['./match-display.component.css']
})
export class MatchDisplayComponent implements OnInit {
  matchId : string;
  matchDetails: MatchDetails;
  match: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.matchId = params['matchId'];
      console.log(this.matchId);
      this.db.getMatchFromNodeKey(this.matchId).takeUntil(this.ngUnsubscribe).subscribe(match =>{
        this.match = match;
        console.log(this.match);
      })
      // this.db.getTeamById(this.teamId)
      //   .takeUntil(this.ngUnsubscribe).subscribe(team => this.team = team);
      // this.db.getPlayersOnTeam(this.teamId)
      //   .takeUntil(this.ngUnsubscribe).subscribe(players => this.players = players);
      // this.db.getGamesPlayedByTeam(this.teamId)
      // .takeUntil(this.ngUnsubscribe).subscribe(games => this.games = games);
      // this.authService.getCurrentUser()
      // .takeUntil(this.ngUnsubscribe).subscribe(userInfo => {
      //   this.user = userInfo});
      // this.db.getUserIdAssociatedWithTeam(this.teamId)
      // .takeUntil(this.ngUnsubscribe).subscribe(userId =>{
      //     this.db.getUserById(Object.keys(userId)[0]).takeUntil(this.ngUnsubscribe).subscribe(userInfo => this.userAssociatedWithTeam = userInfo);
      // });
    });
  }

}
