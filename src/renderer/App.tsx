import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import {Header} from "./components/Header";
import {SideBar} from "./components/SideBar";
import {RunePage} from "./components/Runes/RunePage";
import {useEffect, useState} from "react";
import {RuneTips} from "../main/app/lib/teemo-api";

const Hello = () => {
  const [runePages, setRunePages] = useState<{ name: string; primaryStyleId: number; selectedPerkIds: number[]; subStyleId: number; }[]>([]);
  const [toolTips, setToolTips] = useState<RuneTips[]>([]);
  const test = () => {
    window.electron.ipcRenderer.send('champion:update', 'Aatrox');
  }
  useEffect(() => {
    (async () => {
      window.electron.ipcRenderer.on('champion:set', (runePages: { name: string; primaryStyleId: number; selectedPerkIds: number[]; subStyleId: number; }[]) => {
        console.log(runePages);
        setRunePages(runePages);
      });

      window.electron.ipcRenderer.on('tooltip:set', (toolTips: RuneTips[]) => {
        console.log(toolTips);
        setToolTips(toolTips);
      });

    })();
  }, []);

  const showRunePages = () => {
    if (runePages.length > 0 && toolTips.length > 0) {
      return (<RunePage toolTips={toolTips} runePage={runePages[0]}></RunePage>)
    }
  }


  return (
    <div className="wrapper">
      <Header></Header>
      <SideBar></SideBar>
      <div className="content-wrapper">
        <div className="content-header"></div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <section className="col-md-6">{showRunePages()}</section>
            </div>
          </div>
          <button onClick={test}>test</button>
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
