import axios from 'axios';

export class DDragon {
  private URL = 'https://ddragon.leagueoflegends.com/';

  public latestVersion!: string;

  private _runesReforged: RuneReforged[] = [];

  constructor() {
    (async () => {
      this.latestVersion = await this.getLatestVersion();
      this._runesReforged = await this.getRunesReforged();
    })();
  }

  get runesReforged(): RuneReforged[] {
    return this._runesReforged;
  }

  private async getLatestVersion() {
    const { data } = await axios.get(`${this.URL}api/versions.json`);
    return data[0];
  }

  private async getRunesReforged(): Promise<RuneReforged[]> {
    if (!this.latestVersion) this.latestVersion = await this.getLatestVersion();
    console.log(
      `${this.URL}cdn/${this.latestVersion}/data/en_US/runesReforged.json`
    );
    const { data } = await axios.get(
      `${this.URL}cdn/${this.latestVersion}/data/en_US/runesReforged.json`
    );
    return data;
  }
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
