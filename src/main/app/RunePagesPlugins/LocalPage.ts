import {IRunePage, RunePages} from "./RunePages";
import {dataStore} from "../lib/Settings";

export default class LocalPage extends RunePages {
  active: boolean = true;
  id: string = "local-page";
  name: string = "Local Page";

  getBuild(): any {
    throw new Error("No Build Implemented");
  }

  getPages(championName: string): any {
    const runePages = dataStore.get('localRunes') as IRunePage[];
    return runePages.filter((page) => page.name.toLowerCase().startsWith(championName.toLowerCase()));
  }

}
