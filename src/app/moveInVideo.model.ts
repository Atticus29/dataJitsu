export class MoveInVideo {
  constructor(public moveName: string, public actor: string, public recipient: string, public timeInitiated: number, public timeCompleted: number, public points: number, public associatedMatchDetailsId: string, public isASubmission: boolean) { }
}
