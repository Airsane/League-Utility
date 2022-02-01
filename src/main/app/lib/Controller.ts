import {BrowserWindow, ipcMain} from 'electron';
import {GameMode, IRunePage} from "../RunePagesPlugins/RunePages";
import TeemoApi, {SummonerPick} from "./teemo-api";
import LcuApi from "./lcu-api";
import {settings} from "./Settings";
import PluginController from "../RunePagesPlugins/PluginController";

export default class Controller {
  private ipcMain;
  private mainWindow: BrowserWindow;
  private pluginController:PluginController;
  private teemoApi;
  private lcuApi;

  constructor(mainWindow: BrowserWindow) {
    this.ipcMain = ipcMain;
    this.pluginController = new PluginController();
    this.mainWindow = mainWindow;
    this.teemoApi = new TeemoApi();
    this.lcuApi = LcuApi.getSingleton();
    this.registerListeners();
    console.log(settings.get('test'));
  }


  private sendToRender(channel: string, data: any) {
    this.mainWindow.webContents.send(channel, data);
  }

  private registerListeners() {
    // AutoChamp
    this.lcuApi.on('/lol-champ-select/v1/session:Update', async (data: SummonerPick) => {
      const championName = await this.teemoApi.autoChampSelect(data);
      await this.handleChampionSelect(championName);
    });

    // SetRunes
    this.ipcMain.on('runePage:set', async (_event, runePage: IRunePage) => {
      await this.teemoApi.setRunePage(runePage);
    });

    this.ipcMain.on('tooltips:get', async (event) => {
      event.reply('tooltips:set', this.teemoApi.getToolTips());
    });

    this.ipcMain.on('champion:update', async (_event, name) => {
      await this.handleChampionSelect(name);
    });
  }

  private async handleChampionSelect(championName: string) {
    const plugin = this.pluginController.getActivePlugin();
    const pages = await plugin.getPages(championName, GameMode.URF);
    this.sendToRender('tooltip:set', this.teemoApi.getToolTips());
    this.sendToRender('champion:set', pages);
  }


}
