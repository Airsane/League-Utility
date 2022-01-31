export abstract class RunePages {
  public abstract id: string;

  public abstract name: string;

  public abstract active: boolean;

  abstract getPages(championName: string, gameMode: GameMode): any;

  abstract getBuild(): any;
}

export enum GameMode {
  NORMAL,
  ARAM,
  URF,
}

export interface RunePage {
  name: string;
  primaryStyleId: number;
  selectedPerkIds: number[];
  subStyleId: number;
  build: number[];
}
