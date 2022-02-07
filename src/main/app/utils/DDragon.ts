import axios from 'axios';

export class DDragon {
  private URL = 'https://ddragon.leagueoflegends.com/';

  public latestVersion!: string;

  private _runesReforged: RuneReforged[] = [];

  constructor() {
    (async () => {
      this.latestVersion = await this.getLatestVersion();
    })();
  }

  get runesReforged(): RuneReforged[] {
    return this._runesReforged;
  }

  private async getLatestVersion() {
    const {data} = await axios.get(`${this.URL}api/versions.json`);
    return data[0];
  }

  public async getChampions(): Promise<CustomChampion[]> {
    const data = (await axios.get(`${this.URL}cdn/${this.latestVersion}/data/en_US/champion.json`)).data as DDragonChampions;
    const champions: CustomChampion[] = [];
    for (const key of Object.keys(data.data)) {
      const champ = data.data[key];
      champions.push({
        name: champ.name,
        id: champ.key,
        title: champ.title
      })
    }
    return champions;
  }
}


export interface CustomChampion {
  name: string;
  id: number
  title: string;
}

interface DDragonChampions {
  type: Type;
  format: string;
  version: Version;
  data: { [key: string]: Champion };
}

interface Champion {
  version: Version;
  id: string;
  key: number;
  name: string;
  title: string;
  blurb: string;
  info: Info;
  image: Image;
  tags: Tag[];
  partType: string;
  stats: { [key: string]: number };
}

interface Image {
  full: string;
  sprite: Sprite;
  group: Type;
  x: number;
  y: number;
  w: number;
  h: number;
}

enum Type {
  Champion = "champion",
}

enum Sprite {
  Champion0png = "champion0.png",
  Champion1png = "champion1.png",
  Champion2png = "champion2.png",
  Champion3png = "champion3.png",
  Champion4png = "champion4.png",
  Champion5png = "champion5.png",
}

interface Info {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

enum Tag {
  Assassin = "Assassin",
  Fighter = "Fighter",
  Mage = "Mage",
  Marksman = "Marksman",
  Support = "Support",
  Tank = "Tank",
}

export enum Version {
  The1221 = "12.2.1",
}


export interface RuneReforged {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: Slot[];
}

export interface Slot {
  runes: Rune[];
}

export interface Rune {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
  longDesc: string;
}
