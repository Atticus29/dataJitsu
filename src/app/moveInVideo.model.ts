export class MoveInVideo {
  constructor(public moveName: string, public actor: string, public recipient: string, public timeInitiated: number, public timeCompleted: number, public points: number, public associatedMatchId: string, public isASubmission: boolean, public isSuccessfulAttempt: boolean, public annotatorUserId: string) { }
  getMatchId(): string{
    return this.associatedMatchId;
  }
}
