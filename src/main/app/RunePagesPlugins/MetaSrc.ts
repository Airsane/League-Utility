import * as cheerio from 'cheerio';
import axios from 'axios';
import {GameMode, IRunePage, RunePages} from './RunePages';

export default class MetaSrc extends RunePages {
  public active: boolean = true;

  public id: string = 'metasrc';
  private build: number[] = [];
  public name: string = 'MetaSrc';
  public possibleGameModes: GameMode[] = [GameMode.NORMAL, GameMode.URF, GameMode.ARAM];
  private url = `https://www.metasrc.com/%gamemode/champion/%champion`;

  private gameModes = ['5v5', 'aram', 'urf'];

  async getPages(
    championName: string,
    gameMode: GameMode = GameMode.NORMAL
  ): Promise<IRunePage[]> {
    return this.extractPage(championName, this.gameModes[gameMode]);
  }

  private async extractPage(championName: string, gameMode: string) {
    const $ = await this.loadPage(championName, gameMode);
    let x = 0;
    const runePages: IRunePage[] = [];
    let mainRune: number[] = [];
    let subRune: number[] = [];
    this.build = [];
    $(
      '#content > div._qngo9y > div:nth-child(4) > div._5cna4p > div:nth-child(4) > div > div > div:nth-child(1) > div > div.tooltipped'
    ).each((_i, el) => {
      this.build.push(parseInt(el.attribs['data-tooltip'].replace('x-item-', '')));
    });

    $("div[id$='0-content'] > div").each((_i, el) => {
      if (x % 2 === 0) {
        $(el)
          .children()
          .each((_i1, el1) => {
            if (el1.attribs['data-tooltip']) {
              mainRune.push(
                parseInt(el1.attribs['data-tooltip'].replace('perk-', ''))
              );
            }
          });
        x++;
      } else {
        $(el)
          .children()
          .each((_i1, el1) => {
            if (el1.attribs['data-tooltip']) {
              subRune.push(
                parseInt(el1.attribs['data-tooltip'].replace('perk-', ''))
              );
            }
          });
        x = 0;
        runePages.push({
          name: `${championName}-${gameMode} ${mainRune[0]}-${subRune[1]}`,
          primaryStyleId: mainRune.shift()!,
          subStyleId: subRune.shift()!,
          selectedPerkIds: mainRune.concat(subRune),
          build: this.build,
        });
        mainRune = [];
        subRune = [];
      }
    });
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
