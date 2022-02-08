import * as cheerio from 'cheerio';
import axios from 'axios';
import {IRunePage, RunePages} from './RunePages';

export default class MetaSrc extends RunePages {
  public active: boolean = true;

  public id: string = 'metasrc';
  private build: number[] = [];
  public name: string = 'MetaSrc';
  private url = `https://www.metasrc.com/%gamemode/champion/%champion`;
  private gameModes = ['5v5', 'aram', 'urf']

  async getPages(
    championName: string,
  ): Promise<IRunePage[]> {
    return this.extractPage(championName);
  }

  private async extractPage(championName: string) {
    const runePages: IRunePage[] = [];
    const isCached = this.isCached(championName);
    if(isCached)
      return isCached.runePages;
    for (const gameMode of this.gameModes) {
      const $ = await this.loadPage(championName, gameMode);
      this.build = [];
      $(
        '#content > div._qngo9y > div:nth-child(4) > div._5cna4p > div:nth-child(4) > div > div > div:nth-child(1) > div > div.tooltipped'
      ).each((_i, el) => {
        this.build.push(parseInt(el.attribs['data-tooltip'].replace('x-item-', ''), 10));
      });

      const images = $('svg > image[data-xlink-href]');
      for(let i = 8; i < 40; i+=10){
        let mainStyle:number;
        let subStyle:number;
        let selectedRunes:number[] = [];
        for(let j = 0; j < 11; j++){
          const rune = parseInt($(images[i+j]).parent().parent()[0]!.attribs['data-tooltip'].replace('perk-', ''),10);
          if(j == 0){
            mainStyle = rune;
            continue;
          }
          if(j == 5){
            subStyle = rune;
            continue;
          }
          selectedRunes.push(rune);
        }
        runePages.push({
          name: `[${gameMode.toUpperCase()}] ${championName} ${mainStyle!}-${subStyle!}`,
          build:this.build,
          primaryStyleId:mainStyle!,
          selectedPerkIds:selectedRunes,
          subStyleId:subStyle!
        })
      }
    }
    this.addToCache(championName,runePages);
    return runePages;
  }

  private async loadPage(championName: string, gameMode: string) {
    const {data} = await axios.get(
      this.url
        .replace('%gamemode', gameMode)
        .replace('%champion', championName.toLowerCase())
    );
    return cheerio.load(data);
  }

  public async getBuild(): Promise<any> {
    return this.build;
  }

}
