export class MoveInVideo {
  constructor(public moveName: string, public actor: string, public recipient: string, public timeInitiated: number, public timeCompleted: number, public points: number, public associatedMatchId: string, public isASubmission: boolean, public isSuccessfulAttempt: boolean) { }
  getMatchId(): string{
    return this.associatedMatchId;
  }
}
