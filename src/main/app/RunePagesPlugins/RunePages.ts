export abstract class RunePages {
  public abstract id: string;

  public abstract name: string;

  public abstract active: boolean;


  abstract getPages(championName: string): any;

  abstract getBuild(): any;
}

export interface IRunePage {
  name: string;
  primaryStyleId: number;
  selectedPerkIds: number[];
  subStyleId: number;
  build: number[];
}
