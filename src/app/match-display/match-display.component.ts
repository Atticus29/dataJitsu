import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-match-display',
  templateUrl: './match-display.component.html',
  styleUrls: ['./match-display.component.css']
})
export class MatchDisplayComponent implements OnInit {
  matchId : string;
  matchDetails: MatchDetails;
  match: Match;
  matchUrl: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.matchId = params['matchId'];
      console.log(this.matchId);
      this.db.getMatchFromNodeKey(this.matchId).takeUntil(this.ngUnsubscribe).subscribe(match =>{
        // this.match = new Match(match);
        this.match = match;
        // console.log(this.match);
        // this.matchUrl = match.matchDeets.videoUrl;
        // console.log(this.matchUrl);
        this.matchUrl = "https://youtube.com/embed/" + this.parseVideoUrl(match.matchDeets.videoUrl) + "?enablejsapi=1&html5=1&";
        console.log(this.matchUrl);
        // this.matchDetails = this.match.getMatchDetails();
        // console.log(this.matchDetails);
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

  parseVideoUrl(url: string){ //@TODO seems hacky
    // console.log("url entering parseVideoUrl is: " + url);
    var re = /.*youtu.+?be\/(.+)/ig;
    var result = re.exec(url);
    // console.log(result[1]);
    return result[1];
  }


}
