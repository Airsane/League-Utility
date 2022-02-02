import {BrowserWindow, ipcMain} from 'electron';
import {GameMode, IRunePage} from "../RunePagesPlugins/RunePages";
import TeemoApi, {RuneTips, SummonerPick} from "./teemo-api";
import LcuApi from "./lcu-api";
import {settings} from "./Settings";
import PluginController from "../RunePagesPlugins/PluginController";

export default class Controller {
  private ipcMain;
  private mainWindow: BrowserWindow;
  private pluginController: PluginController;
  private teemoApi;
  private lcuApi;
  private lastChampionName = "";
  private lastGameMode = 0;

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
      if (!championName)
        return;
      await this.handleChampionSelect(championName,0);
    });

    // SetRunes
    this.ipcMain.on('runePage:set', async (_event, runePage: IRunePage) => {
      await this.teemoApi.setRunePage(runePage);
    });

    // SaveRunes
    this.ipcMain.on('runePage:save',async (_event,runePage:IRunePage) =>{
      await this.teemoApi.saveRunePage(runePage);
    })

    this.ipcMain.on('plugin:update', async (_event, data: { id: string }) => {
      if(!data.id)
        return
      this.pluginController.setActivePlugin(data.id);
      if(!this.lastChampionName)
        return
      // Refresh rune pages when plugin is changed.
      await this.handleChampionSelect(this.lastChampionName,this.lastGameMode);
    })

    this.ipcMain.on('champion:update', async (_event, data: { champion: string, gameMode: number }) => {
      this.lastGameMode = data.gameMode;
      this.lastChampionName = data.champion;
      await this.handleChampionSelect(data.champion, data.gameMode);
    });

    this.ipcMain.on('ready', async (event, ready: boolean) => {
      if (!ready)
        return;
      const initPackage: IInit = {
        plugins: this.pluginController.getPlugins(),
        tooltips: this.teemoApi.getToolTips()
      };
      event.reply('init', initPackage);
    })
  }

  private async handleChampionSelect(championName: string, gameMode: GameMode) {
    const plugin = this.pluginController.getActivePlugin();
    const pages = await plugin.getPages(championName, gameMode);
    this.sendToRender('tooltip:set', this.teemoApi.getToolTips());
    this.sendToRender('champion:set', pages);
  }


}

export interface IInit {
  plugins: { name: string, id: string }[]
  tooltips: RuneTips[]
}
