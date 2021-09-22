export class ReputationLog {
  static fromJson(jsonObj: any): ReputationLog{
    const date: string = jsonObj.date;
    const points: number = jsonObj.points;
    const reason: string = jsonObj.reason;
    return new ReputationLog(date, reason, points);
  }
  constructor(public date: string, public reason: string, public points: number) {
  }
}
