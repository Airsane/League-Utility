import {RunePages} from "./RunePages";
import MetaSrc from "./MetaSrc";
import LocalPage from "./LocalPage";

export default class PluginController {
  private runePlugins: RunePages[] = [];
  private selectedPlugin: string = "";

  constructor() {
    this.loadPlugins();
  }

  private loadPlugins() {
    this.runePlugins.push(new LocalPage());
    this.runePlugins.push(new MetaSrc());
    this.selectedPlugin = this.runePlugins[0].id;
    this.runePlugins = this.runePlugins.filter((pl) => pl.active);
  }

  public getPlugins(): { name: string, id: string }[] {
    return this.runePlugins.map((pl) => {
      return {name: pl.name, id: pl.id};
    });
  }

  public getPluginInfo(name: string) {
    const pl = this.runePlugins.find((plugin) => plugin.name === name)!;
    return {name: pl.name, id: pl.id};
  }

  public getActivePlugin(): RunePages {
    return this.runePlugins.find((plugin) => plugin.id === this.selectedPlugin)!;
  }

  public setActivePlugin(id: string) {
    if (!this.runePlugins.find((plugin) => plugin.id === id)) {
      throw new Error("Invalid plugin name " + id);
    }
    this.selectedPlugin = id;
  }
}
