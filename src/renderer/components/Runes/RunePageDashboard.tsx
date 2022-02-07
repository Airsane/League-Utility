import {TabController} from "../tabController";
import {useEffect, useState} from "react";
import {IRunePage} from "../../../main/app/RunePagesPlugins/RunePages";
import {RuneTips} from "../../../main/app/lib/kindred-api";
import {IPlugin} from "../../App";
import {IInit} from "../../../main/app/lib/Controller";
import {RunePage} from "./RunePage";

export const RunePageDashboard = () => {

  const [runePages, setRunePages] = useState<IRunePage[]>([]);
  const [toolTips, setToolTips] = useState<RuneTips[]>([]);
  const [plugins, setPlugins] = useState<IPlugin[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("");

  useEffect(() => {
    window.electron.ipcRenderer.send('plugin:update', {id: currentTab});
  }, [currentTab]);

  const handleSwitchTab = (tabId: string) => {
    setCurrentTab(tabId)
  }

  const showRunePages = () => {
    if (runePages.length > 0 && toolTips.length > 0) {
      return runePages.map((runePage, i) => {
        return (
          <RunePage key={i} toolTips={toolTips} isLocalPage={currentTab === 'local-page'} runePage={runePage}/>
        );
      });
    }
    return;
  };

  useEffect(() => {
    (async () => {
      window.electron.ipcRenderer.on(
        'champion:set', (receivedRunePage: IRunePage[]
        ) => {
          setRunePages(receivedRunePage);
        }
      );

      window.electron.ipcRenderer.on('init', (initPackage: IInit) => {
        setCurrentTab(initPackage.plugins[0].id);
        setPlugins(initPackage.plugins);
        setToolTips(initPackage.tooltips);
      });
      window.electron.ipcRenderer.send('ready', true);

    })();

    return () => {
      window.electron.ipcRenderer.removeAllListeners('champion:set');
      window.electron.ipcRenderer.removeAllListeners('init');
    }
  }, []);

  return (
    <div><TabController currentPage={currentTab} plugins={plugins} handleClick={handleSwitchTab}/>
      <div className="content-header"></div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <section className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Aatrox
                  </h3>
                </div>
                <div className="card-body">
                  {showRunePages()}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
