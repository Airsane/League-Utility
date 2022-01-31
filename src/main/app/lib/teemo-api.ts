import LcuApi from './lcu-api';

export default class TeemoApi {
  private api: LcuApi;

  private currentPage!: RunePage;

  private summoner!: Summoner;

  private tooltips!: RuneTips[];

  constructor() {
    this.api = LcuApi.getSingleton();
    this.registerEvents();
  }

  private async registerEvents() {
    this.api.on('api:connected', () => {
      console.log('Api connected');
      this.updateConnectionData();
    });
  }

  private async updateConnectionData() {
    await this.updateSummoner();
    this.updateCurrentPage();
    this.updateToolTips();
  }

  private async updateToolTips() {
    const data: RuneTips[] = await this.api.get(`/lol-perks/v1/perks`);
    this.tooltips = data;
  }

  private async updateSummoner() {ok
    const summoner = await this.api.get(`/lol-summoner/v1/current-summoner`);
    if (!summoner) return;
    this.summoner = summoner;
  }

  public async autoChampSelect(data: SummonerPick) {
    const me = data.myTeam.find((d) => d.cellId === data.localPlayerCellId);
    console.log(me?.championId);
    if(me)
    {
      const championName = (await this.getChampion(me.championId)).name;
      console.log(championName);
      return championName;
    }
    return '';
  }

  private async getChampion(id: number) {
    const data = await this.api.get(
      `/lol-champions/v1/inventories/${this.summoner.summonerId}/champions/${id}`
    );
    return data;
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


  public getToolTips() {
    return this.tooltips;
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
