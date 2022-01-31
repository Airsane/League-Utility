import {GameMode, RunePage, RunePages} from "./RunePages";
import * as cheerio from 'cheerio';
import axios from "axios";


export default class MetaSrc extends RunePages {
  public active: boolean = true;
  public id: string = "metasrc";
  public name: string = "MetaSrc";
  private url = `https://www.metasrc.com/%gamemode/champion/%champion`;
  private gameModes = ["5v5", "aram", "urf"];

  async getPages(championName: string, gameMode: GameMode = GameMode.NORMAL): Promise<RunePage[]> {
    return await this.extractPage(championName, this.gameModes[gameMode]);
  }

  private async extractPage(championName: string, gameMode: string) {
    const $ = await this.loadPage(championName, gameMode);
    let x = 0;
    const runePages: RunePage[] = [];
    let mainRune: number[] = [];
    let subRune: number[] = [];
    $("div[id$='0-content'] > div").each((_i, el) => {
      if (x % 2 === 0) {
        $(el).children().each((_i1, el1) => {
          if (el1.attribs['data-tooltip']) {
            mainRune.push(parseInt(el1.attribs['data-tooltip'].replace('perk-', '')));
          }
        })
        x++;
      } else {
        $(el).children().each((_i1, el1) => {
          if (el1.attribs['data-tooltip']) {
            subRune.push(parseInt(el1.attribs['data-tooltip'].replace('perk-', '')));
          }
        });
        x = 0;
        runePages.push({
          name: `${gameMode}-${championName} ${mainRune[0]}-${subRune[1]}`,
          primaryStyleId: mainRune.shift()!,
          subStyleId: subRune.shift()!,
          selectedPerkIds: mainRune.concat(subRune)
        })
        mainRune = [];
        subRune = [];
      }
    })
    return runePages;
  }

  private async loadPage(championName: string, gameMode: string) {
    console.log(`Loading page metasrc`);
    console.log(this.url.replace('%gamemode', gameMode).replace('%champion', championName));
    const {data} = (await axios.get(this.url.replace('%gamemode', gameMode).replace('%champion', championName.toLowerCase())));
    return cheerio.load(data);

  }


}
