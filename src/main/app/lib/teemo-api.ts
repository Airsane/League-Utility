import LcuApi from './lcu-api';
import axios from "axios";
import {dataStore} from "./Settings";
import {CustomChampion, DDragon} from "../utils/DDragon";
import {IRunePage} from "../RunePagesPlugins/RunePages";

export default class TeemoApi {
  private api: LcuApi;
  private currentPage!: RunePage;
  private summoner!: Summoner;
  private leagueVersion!: string;
  private dDragonApi: DDragon;

  constructor() {
    this.api = LcuApi.getSingleton();
    this.dDragonApi = new DDragon();
    (async () => {
      await this.getVersion();
      await this.registerEvents();
      setTimeout(() => {
      }, 5000);
    })();
  }

  private async getVersion() {
    const data = (await axios.get(`https://ddragon.leagueoflegends.com/realms/euw.json`)).data;
    this.leagueVersion = data.v;
  }

  private async registerEvents() {
    this.api.on('api:connected', () => {
      console.log('Api connected');
      this.updateConnectionData();
      this.updateStoredData();
    });
  }

  private async updateStoredData() {
    if (dataStore.get('version') !== this.leagueVersion && this.leagueVersion) {
      console.log("Updating Data");
      dataStore.set('tooltips', await this.getUpdatedToolTips());
      dataStore.set('version', this.leagueVersion);
      dataStore.set('champions', await this.dDragonApi.getChampions());
    }
  }

  public saveRunePage(runePage: IRunePage) {
    const runePages = dataStore.get('localRunes') as IRunePage[];
    runePages.push(runePage);
    dataStore.set('localRunes', runePages);
  }

  private async updateConnectionData() {
    await this.updateSummoner();
    await this.updateCurrentPage();
  }

  private async getUpdatedToolTips() {
    const data: RuneTips[] = await this.api.get(`/lol-perks/v1/perks`);
    return data;
  }

  private async updateSummoner() {
    const summoner = await this.api.get(`/lol-summoner/v1/current-summoner`);
    if (!summoner) return;
    this.summoner = summoner;
    this.summoner.summonerId
  }

  private getChampion(searchFunc: any) {
    const champions = dataStore.get('champions') as CustomChampion[];
    const champion = champions.find(searchFunc);
    if (!champion)
      throw new Error(`No champion found`);
    return champion;
  }

  public getChampionById(id: number): CustomChampion {
    const searchFunction = (champion: CustomChampion) => {
      return champion.id === id;
    }
    return this.getChampion(searchFunction);
  }


  public getChampionByName(name: string): CustomChampion {
    const searchFunction = (champion: CustomChampion) => {
      return champion.name.toLowerCase() === name.toLowerCase();
    }
    return this.getChampion(searchFunction);
  }

  public async autoChampSelect(data: SummonerPick) {
    const me = data.myTeam.find((d) => d.cellId === data.localPlayerCellId);
    if (me) {
      const championName = (await this.getChampionById(me.championId)).name;
      return championName;
    }
    return '';
  }

  public getLeagueVersion() {
    return this.leagueVersion;
  }

  public async setRunePage(runePage: {
    name: string;
    primaryStyleId: number;
    selectedPerkIds: number[];
    subStyleId: number;
  }) {
    await this.deletePage(this.currentPage.id);
    const response = this.api.post(`/lol-perks/v1/pages/`, runePage);
    if (!response) {
      console.log('Error: no response after page upload request.');
    }
    await this.updateCurrentPage();
  }

  public async deletePage(id: number) {
    await this.api.del(`/lol-perks/v1/pages/${id}`);
  }

  public getToolTips(): RuneTips[] {
    return dataStore.get('tooltips');
  }

  private async updateCurrentPage() {
    this.currentPage = await this.api.get('/lol-perks/v1/currentpage');
  }

  public async getCurrentPage(): Promise<RunePage> {
    return this.currentPage!;
  }
}

export interface SummonerPick {
  actions: any[];
  allowBattleBoost: boolean;
  allowDuplicatePicks: boolean;
  allowLockedEvents: boolean;
  allowRerolling: boolean;
  allowSkinSelection: boolean;
  bans: Bans;
  benchChampionIds: number[];
  benchEnabled: boolean;
  boostableSkinCount: number;
  chatDetails: ChatDetails;
  counter: number;
  entitledFeatureState: EntitledFeatureState;
  gameId: number;
  hasSimultaneousBans: boolean;
  hasSimultaneousPicks: boolean;
  isCustomGame: boolean;
  isSpectating: boolean;
  localPlayerCellId: number;
  lockedEventIndex: number;
  myTeam: Team[];
  recoveryCounter: number;
  rerollsRemaining: number;
  skipChampionSelect: boolean;
  theirTeam: Team[];
  timer: Timer;
  trades: Trade[];
}

export interface Bans {
  myTeamBans: any[];
  numBans: number;
  theirTeamBans: any[];
}

export interface ChatDetails {
  chatRoomName: string;
  chatRoomPassword: null;
}

export interface EntitledFeatureState {
  additionalRerolls: number;
  unlockedSkinIds: any[];
}

export interface Team {
  assignedPosition: string;
  cellId: number;
  championId: number;
  championPickIntent: number;
  entitledFeatureType: EntitledFeatureType;
  selectedSkinId: number;
  spell1Id: number;
  spell2Id: number;
  summonerId: number;
  team: number;
  wardSkinId: number;
}

export enum EntitledFeatureType {
  Empty = '',
  None = 'NONE',
}

export interface Timer {
  adjustedTimeLeftInPhase: number;
  internalNowInEpochMs: number;
  isInfinite: boolean;
  phase: string;
  totalTimeInPhase: number;
}

export interface Trade {
  cellId: number;
  id: number;
  state: string;
}

export interface ItemSet {
  title: string;
  type: string;
  map: string;
  mode: string;
  priority: boolean;
  sortrank: number;
  blocks: Block[];
  championKey: string;
}

export interface Block {
  recMath: boolean;
  minSummonerLevel: number;
  maxSummonerLevel: number;
  showIfSummonerSpell: string;
  hideIfSummonerSpell: string;
  type: string;
  items: Item[];
}

export interface Item {
  id: string;
  count: number;
}

export interface Summoner {
  accountId: number;
  displayName: string;
  internalName: string;
  nameChangeFlag: boolean;
  percentCompleteForNextLevel: number;
  privacy: string;
  profileIconId: number;
  puuid: string;
  rerollPoints: RerollPoints;
  summonerId: number;
  summonerLevel: number;
  unnamed: boolean;
  xpSinceLastLevel: number;
  xpUntilNextLevel: number;
}

export interface RerollPoints {
  currentPoints: number;
  maxRolls: number;
  numberOfRolls: number;
  pointsCostToRoll: number;
  pointsToReroll: number;
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
