// import {GameMode, IRunePage, RunePages} from "./RunePages";
// import * as cheerio from 'cheerio';
// import axios from "axios";
//
// export default class opGG extends RunePages{
//   active: boolean = true;
//   id: string = 'opgg';
//   name: string = 'OP.GG';
//   possibleGameModes: GameMode[] = [GameMode.NORMAL];
//   private url = 'http://www.op.gg/champion/';
//
//   private parsePage($:cheerio.CheerioAPI, champion:string, position:string) {
//     return $("tbody[class*='ChampionKeystoneRune-'] tr")
//       .toArray()
//       .map(extractRunePagesFromElement($, champion, position));
//   }
//
//   private async extractPages(html: string, champion: string, callback: Function) {
//     const $ = cheerio.load(html);
//     let pages = [];
//     let initialPosition;
//
//     const positions = $('.champion-stats-position li').map((_, element) => {
//       if (element.attribs['class'].indexOf('champion-stats-header__position--active') !== -1) {
//         initialPosition = element.attribs['data-position'].toLowerCase();
//       }
//
//       return element.attribs['data-position'].toLowerCase();
//     }).get();
//
//     pages = pages.concat(parsePage($, champion, initialPosition));
//
//     getBuild()
//   :
//     any
//     {
//     }
//
//     async
//     getPages(championName
//   :
//     string, _gameMode
//   :
//     GameMode
//   ):
//     any
//     {
//       const runePages: IRunePage[] = [];
//
//       const entryChampUrl = this.url + championName;
//       const data = (await axios.get(entryChampUrl)).data
//
//     }
//
//   private async
//     extractPage()
//     {
//
//     }
//
//   }
