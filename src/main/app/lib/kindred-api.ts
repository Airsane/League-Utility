import LcuApi from './lcu-api';
import axios from "axios";
import {dataStore} from "./Settings";
import {CustomChampion, DDragon} from "../utils/DDragon";
import {IRunePage} from "../RunePagesPlugins/RunePages";
import Logger from "./AirLogger";
import AirStorage from "./Storage";
import {ISession} from "../../main";

export default class KindredApi {
  private api: LcuApi;
  private leagueVersion!: string;
  private dDragonApi: DDragon;
  private logger: Logger;
  private storage: AirStorage;

  constructor() {
    this.api = LcuApi.getSingleton();
    this.logger = Logger.getSingleton();
    this.dDragonApi = new DDragon();
    this.storage = AirStorage.getSingleton();
    (async () => {
      await this.getVersion();
      await this.registerEvents();
    })();
  }

  private async getVersion() {
    const data = (await axios.get(`https://ddragon.leagueoflegends.com/realms/euw.json`)).data;
    this.leagueVersion = data.v;
  }

  private async registerEvents() {
    this.api.on('api:connected', async () => {
      this.logger.info(`Connected to api`);
      if (await this.checkIfClientIsReady()) {
        const session = this.storage.get('session') as ISession;
        session.connected = true;
        this.storage.set('session', session);
        await this.updateStoredData();
        await this.updateCurrentPage();
      }
    });

    this.api.on('/lol-summoner/v1/current-summoner:Update', (summoner: Summoner) => {
      this.updateStoredData();
      const session = this.storage.get('session') as ISession;
      session.connected = true;
      session.summonerLevel = summoner.summonerLevel;
      this.storage.set('session', session);
    })

    this.api.on('/lol-perks/v1/currentpage:Update', async (page: RunePage) => {
      console.log(page);
      this.setCurrentPage(page);
    })
  }

  private async checkIfClientIsReady() {
    try {
      const data = await this.api.get("/lol-summoner/v1/current-summoner");
      if (!data) {
        this.logger.info(`No session found`);
        return false
      }
      this.logger.info(`Session found`);
      return true

    } catch (err: any) {
      this.logger.error(`No session found`);
      return false;
    }
  }

  private async updateStoredData() {
    console.log("getting champs")
    await this.dDragonApi.getChampions()
    if (dataStore.get('version') !== this.leagueVersion && this.leagueVersion) {
      this.logger.debug(`Updating Stored Data from version ${dataStore.get('version')} to ${this.leagueVersion}`);
      dataStore.set('version', this.leagueVersion);
      dataStore.set('champions', await this.dDragonApi.getChampions());
      await this.getToolTips();
    }
  }

  public saveRunePage(runePage: IRunePage) {
    const runePages = dataStore.get('localRunes') as IRunePage[];
    runePages.push(runePage);
    dataStore.set('localRunes', runePages);
  }

  private async getUpdatedToolTips() {
    try {
      this.logger.debug(`Getting tooltips data from league client.`);
      const data: RuneTips[] = await this.api.get(`/lol-perks/v1/perks`);
      dataStore.set('tooltips', data);
    } catch (err: any) {
      this.logger.error(`Error while getting tooltips ${err.stack}`)
    }
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
      return (await this.getChampionById(me.championId)).name;
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
    await this.deletePage(this.getCurrentPage().id);
    const response = this.api.post(`/lol-perks/v1/pages/`, runePage);
    if (!response) {
      console.log('Error: no response after page upload request.');
    }
    await this.updateCurrentPage();
  }

  public async deletePage(id: number) {
    await this.api.del(`/lol-perks/v1/pages/${id}`);
  }

  public async getToolTips(): Promise<RuneTips[]> {
    const toolTips = dataStore.get('tooltips') as RuneTips[];
    if (toolTips.length < 1)
      await this.getUpdatedToolTips()
    return toolTips;
  }

  private setCurrentPage(page: RunePage) {
    this.storage.set('currentPage', page);
  }

  private async updateCurrentPage() {
    this.setCurrentPage(await this.api.get('/lol-perks/v1/currentpage'));
  }

  public getCurrentPage(): RunePage {
    return this.storage.get('currentPage');
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
