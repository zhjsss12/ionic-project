export class dataClass {
  id : string;
  data : any[]=[];


  constructor() {}

  public setData(v : string[]) {
    this.data = v;
  }

  public getData() : string[] {
    return this.data;
  }

  public setId(v : string) {
    this.id = v;
  }

  public getId() : string {
    return this.id;
  }

}
