export class User {
  private id: string;
  constructor(public name: string, public email: string, public giRank: string, public noGiRank: string, public affiliation: string, public age: number, public weight: number, public weightClass: string, public reputationPoints: number, public dateLastAnnotated: Date, public paidStatus: boolean, public gender: string) { }

  isValidWeight(): boolean{
    return (this.weight<8 || this.weight > 1400);
  }

  setId(id: string){
    this.id = id;
  }
}
