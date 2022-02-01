import {RunePages} from "./RunePages";
import MetaSrc from "./MetaSrc";

export default class PluginController {
  private runePlugins: RunePages[] = [];
  private selectedPlugin: string = "";

  constructor() {
    this.loadPlugins();
  }

  private loadPlugins() {
    this.runePlugins.push(new MetaSrc());
    this.selectedPlugin = this.runePlugins[0].name;
    this.runePlugins = this.runePlugins.filter((pl) => pl.active);
  }

  public getPlugins(): string[] {
    return this.runePlugins.map((pl) => pl.name);
  }

  public getPluginInfo(name: string) {
    const pl = this.runePlugins.find((pl) => pl.name === name)!;
    return {name: pl.name, id: pl.id, gameModes: pl.possibleGameModes};
  }

  public getActivePlugin(): RunePages {
    return this.runePlugins.find((plugin) => plugin.name === this.selectedPlugin)!;
  }

  public setActivePlugin(name: string) {
    if (!this.runePlugins.find((plugin) => plugin.name === name)) {
      throw new Error("Invalid plugin name " + name);
    }
    this.selectedPlugin = name;
  }
}
