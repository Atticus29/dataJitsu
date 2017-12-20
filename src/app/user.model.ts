export class User {
  private id: string;
  private weightClass: string;
  private ageClass: string;
  constructor(public name: string, public email: string, public giRank: string, public noGiRank: string, public affiliation: string, public age: number, public weight: number, public reputationPoints: number, public dateLastAnnotated: Date, public paidStatus: boolean, public gender: string, public dateCreated: Date) { }

  isValidWeight(): boolean{
    return (this.weight<8 || this.weight > 1400);
  }

  setId(id: string){
    this.id = id;
  }

  setWeightClass(weightClass: string){
    this.weightClass = weightClass;
  }

  setAgeClass(ageClass: string){
    this.ageClass = ageClass;
  }
}
