import Logger from "../lib/AirLogger";

export abstract class RunePages {
  public abstract id: string;

  public abstract name: string;

  public abstract active: boolean;

  protected cache: { name: string, runePages: IRunePage[] }[] = [];

  abstract getPages(championName: string): any;

  abstract getBuild(): any;

  protected isCached(championName: string) {
    const runePages = this.cache.find((cached) => cached.name === `${championName}-${this.name}`);
    return runePages;
  }

  protected addToCache(championName: string, runePages: IRunePage[]) {
    const name = `${championName}-${this.name}`
    this.cache.push({name, runePages});
    this.clearCache(name);
    Logger.getSingleton().debug(`Adding ${name} to cache`);
  }

  protected clearCache(name: string) {
    setTimeout(() => {
      const index = this.cache.findIndex((runePage) => runePage.name === name);
      this.cache.splice(index, 1);
      Logger.getSingleton().debug(`Deleting ${name} from cache`);
    }, 1000 * 60 * 15);
  }


}

export interface IRunePage {
  name: string;
  primaryStyleId: number;
  selectedPerkIds: number[];
  subStyleId: number;
  build: number[];
}
