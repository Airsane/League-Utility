import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Header} from './components/Header';
import {SideBar} from './components/SideBar';
import {RunePage} from './components/Runes/RunePage';
import {RuneTips} from '../main/app/lib/teemo-api';
import {IRunePage} from "../main/app/RunePagesPlugins/RunePages";
import {TabController} from "./components/tabController";
import {IInit} from "../main/app/lib/Controller";

export interface IPlugin {
  name: string,
  id: string
}

const Hello = () => {
  const [runePages, setRunePages] = useState<IRunePage[]>([]);
  const [toolTips, setToolTips] = useState<RuneTips[]>([]);
  const [plugins, setPlugins] = useState<IPlugin[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("");

  useEffect(() => {
    (async () => {
      window.electron.ipcRenderer.on(
        'champion:set', (runePages: IRunePage[]
        ) => {
          setRunePages(runePages);
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
          <section className="col-md-6">
            <RunePage key={i} toolTips={toolTips} isLocalPage={currentTab === 'local-page'} runePage={runePage}/>
          </section>
        );
      });
    }
    return;
  };

  return (
    <div className="wrapper">
      <Header/>
      <SideBar/>
      <div className="content-wrapper">
        <TabController currentPage={currentTab} plugins={plugins} handleClick={handleSwitchTab}/>
        <div className="content-header"></div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">{showRunePages()}</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello/>}/>
      </Routes>
    </Router>
  );
}
