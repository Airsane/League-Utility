import LcuApi from "./lcu-api";

export default class TeemoApi {
  private api: LcuApi
  private currentPage!: RunePage;
  private summonerLevel!: number;
  private tooltips!: RuneTips[];

  constructor() {
    this.api = LcuApi.getSingleton();
    this.registerEvents();
  }

  private async registerEvents() {
    this.api.on('api:connected', () => {
      console.log("Api connected")
      this.updateConnectionData();
    })
  }

  private updateConnectionData() {
    this.updateCurrentPage();
    this.updateSummoner();
    this.updateToolTips();
  }

  private async updateToolTips() {
    const data: RuneTips[] = await this.api.get(`/lol-perks/v1/perks`);
    this.tooltips = data;
  }

  private async updateSummoner() {
    const summoner = await this.api.get(`/lol-summoner/v1/current-summoner`);
    if (!summoner)
      return;
    this.summonerLevel = summoner.summonerLevel;
  }


  public async setRunePage(runePage: { name: string; primaryStyleId: number; selectedPerkIds: number[]; subStyleId: number; }) {
    await this.deletePage(this.currentPage.id);
    const response = this.api.post(`/lol-perks/v1/pages/`, runePage);
    if (!response) {
      console.log("Error: no response after page upload request.");
    }
    await this.updateCurrentPage();

  }

  public async deletePage(id: number) {
    await this.api.del(`/lol-perks/v1/pages/${id}`);
  }

  public getToolTips() {
    return this.tooltips;
  }

  public async getSummonerLevel() {
    return this.summonerLevel ?? 0;
  }

  private async updateCurrentPage(){
    this.currentPage = await this.api.get('/lol-perks/v1/currentpage');
  }

  public async getCurrentPage(): Promise<RunePage> {
    return this.currentPage!;
  }


}

interface RunePage {
  autoModifiedSelections: any[];
  current: boolean;
  id: number;
  isActive: boolean;
  isDeletable: boolean;
  isEditable: boolean;
  isValid: boolean;
  lastModified: number;
  name: string;
  order: number;
  primaryStyleId: number;
  selectedPerkIds: number[];
  subStyleId: number;
}

export interface RuneTips {
  iconPath: string;
  id: number;
  longDesc: string;
  name: string;
  shortDesc: string;
  tooltip: string;
}

