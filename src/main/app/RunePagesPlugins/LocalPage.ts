import {GameMode, IRunePage, RunePages} from "./RunePages";
import {dataStore} from "../lib/Settings";

export default class LocalPage extends RunePages {
  active: boolean = true;
  id: string = "local-page";
  name: string = "Local Page";
  possibleGameModes: GameMode[] = [GameMode.NORMAL, GameMode.URF, GameMode.ARAM];

  getBuild(): any {
  }

  getPages(championName: string, _gameMode: GameMode): any {
    const runePages = dataStore.get('localRunes') as IRunePage[];
    return runePages.filter((page) => page.name.toLowerCase().startsWith(championName.toLowerCase()));
  }

}
