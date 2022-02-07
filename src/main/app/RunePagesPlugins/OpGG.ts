import {IRunePage, RunePages} from "./RunePages";
import * as cheerio from 'cheerio';
import axios from "axios";

export default class opGG extends RunePages {
  active: boolean = true;
  id: string = 'opgg';
  name: string = 'OP.GG';
  private url = 'http://www.op.gg/champion/';


  async getPages(championName: string) {
    const isCached = this.isCached(championName);
    if (isCached)
      return isCached.runePages;

    const entryChampUrl = this.url + championName;
    const pages = await this.extractPages(entryChampUrl, championName);
    this.addToCache(championName,pages);
    return pages;
  }

  private extractRunePagesFromElement($: cheerio.CheerioAPI, champion: string, position: string) {
    // @ts-ignore
    const getPerkIdFromImg = (_, elem) => $(elem)
      .attr('src')
      .split('/')
      .slice(-1)
      .pop()
      .split('.')[0];


    return (runePageElement: any, index: number) => {

      const stats = $(runePageElement).parent()
        .find('> div:nth-child('+(index%2+1)*2+') div.rune-setting__ratio-value')
        .map((i, elem) => {
          console.log(elem)
          return $(elem).text()
        })
        .get();


      const name = `${champion} ${position.toUpperCase()} PR${stats[0]} WR${stats[1]}`;

      let selectedPerkIds = $(runePageElement)
        .find('div.perk-page__item.perk-page__item--active > div > img')
        .map(getPerkIdFromImg)
        .get();
      selectedPerkIds = selectedPerkIds.concat(
        $(runePageElement)
          .find('.fragment__summary .perk-page__image img.active')
          .map(getPerkIdFromImg)
          .get()
      );

      const styleIds = $(runePageElement).find('.perk-page__item.perk-page__item--mark img').map(getPerkIdFromImg);

      const selectedPerkIdsInt = selectedPerkIds.map(x => parseInt(x, 10));

      const runePage: IRunePage = {
        name,
        selectedPerkIds: selectedPerkIdsInt,
        primaryStyleId: parseInt(styleIds[0], 10),
        subStyleId: parseInt(styleIds[1], 10),
        build: []
      }

      return runePage;
    };
  }

  private parsePage($: cheerio.CheerioAPI, champion: string, position: string) {
    return $(".tabItems > div > div.perk-page-wrap")
      .toArray()
      .map(this.extractRunePagesFromElement($, champion, position));
  }

  private async extractPages(entryChampUrl: string, champion: string) {
    const $ = cheerio.load((await axios.get(entryChampUrl)).data);
    let pages = [];

    let initPos: string;

    const positions = $('.champion__list--position > div').map((_, element) => {
      if (element.attribs.class.indexOf('active') !== -1) {
        initPos = element.attribs['data-position'].toLowerCase();
      }
      return element.attribs['data-position'].toLowerCase();
    }).get();

    pages = this.parsePage($, champion, initPos!);

    return pages;
    positions.splice(positions.indexOf(initPos!), 1);

  }

  getBuild(): any {
  }

}
