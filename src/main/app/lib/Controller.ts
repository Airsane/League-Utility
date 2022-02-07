import {BrowserWindow, ipcMain} from 'electron';
import {IRunePage} from "../RunePagesPlugins/RunePages";
import KindredApi, {RuneTips, SummonerPick} from "./kindred-api";
import LcuApi from "./lcu-api";
import PluginController from "../RunePagesPlugins/PluginController";
import AirStorage from "./Storage";
import Logger from "./AirLogger";
import {dataStore} from "./Settings";

export default class Controller {
  private ipcMain;
  private mainWindow: BrowserWindow;
  private pluginController: PluginController;
  private kindredApi;
  private lcuApi;
  private lastChampionName = "";
  private storage: AirStorage;
  private logger: Logger;

  constructor(mainWindow: BrowserWindow) {
    this.ipcMain = ipcMain;
    this.logger = Logger.getSingleton();
    this.pluginController = new PluginController();
    this.mainWindow = mainWindow;
    this.kindredApi = new KindredApi();
    this.lcuApi = LcuApi.getSingleton();
    this.storage = AirStorage.getSingleton();
    this.registerListeners();
  }


  private sendToRender(channel: string, data: any) {
    this.mainWindow.webContents.send(channel, data);
  }

  private registerListeners() {
    // AutoChamp
    this.lcuApi.on('/lol-champ-select/v1/session:Update', async (data: SummonerPick) => {
      const championName = await this.kindredApi.autoChampSelect(data);
      if (!championName)
        return;
      await this.handleChampionSelect(championName);
    });

    this.lcuApi.getConnector().on('disconnect', () => {
      this.logger.info(`Client closed`)
      this.lcuApi.destroyWebSocket();
    })


    // SetRunes
    this.ipcMain.on('runePage:set', async (_event, runePage: IRunePage) => {
      await this.kindredApi.setRunePage(runePage);
    });

    // SaveRunes
    this.ipcMain.on('runePage:save', async (_event, runePage: IRunePage) => {
      await this.kindredApi.saveRunePage(runePage);
    })

    this.ipcMain.on('plugin:update', async (_event, data: { id: string }) => {
      if (!data.id)
        return
      this.pluginController.setActivePlugin(data.id);
      if (!this.lastChampionName)
        return
      // Refresh rune pages when plugin is changed.
      await this.handleChampionSelect(this.lastChampionName);
    })

    this.ipcMain.on('champion:update', async (_event, data: { champion: string }) => {
      this.lastChampionName = data.champion;
      await this.handleChampionSelect(data.champion);
    });

    this.ipcMain.on('ready', async (event, ready: boolean) => {
      if (!ready)
        return;
      const initPackage: IInit = {
        plugins: this.pluginController.getPlugins(),
        tooltips: await this.kindredApi.getToolTips()
      };
      this.storage.set('champions', dataStore.get('champions'));
      event.reply('init', initPackage);
    })

    this.ipcMain.on('storage:get', (event, key) => {
      event.returnValue = this.storage.get(key);
    })

    this.ipcMain.on('storage:set', (_event, data: { key: string, value: any }) => {
      this.storage.set(data.key, data.value);
    })

    this.storage.on(`data:updated`, (key) => {
      this.mainWindow.webContents.send(`storage:on:${key}`, this.storage.get(key));
      this.mainWindow.webContents.send(`storage:on:all`);
    })


  }

  private async handleChampionSelect(championName: string) {
    const plugin = this.pluginController.getActivePlugin();
    const pages = await plugin.getPages(championName);
    this.sendToRender('tooltip:set', await this.kindredApi.getToolTips());
    this.sendToRender('champion:set', pages);
  }


}

export interface IInit {
  plugins: { name: string, id: string }[]
  tooltips: RuneTips[]
}
