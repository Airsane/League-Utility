import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { RunePage } from './components/Runes/RunePage';
import { RuneTips } from '../main/app/lib/teemo-api';

const Hello = () => {
  const [runePages, setRunePages] = useState<
    {
      name: string;
      primaryStyleId: number;
      selectedPerkIds: number[];
      subStyleId: number;
    }[]
  >([]);
  const [toolTips, setToolTips] = useState<RuneTips[]>([]);
  const test = () => {
    //@ts-ignore
    window.electron.ipcRenderer.send('champion:update', document.querySelector('#ChampionPick').value);
  };
  useEffect(() => {
    (async () => {
      window.electron.ipcRenderer.on(
        'champion:set', (runePages: {
            name: string;
            primaryStyleId: number;
            selectedPerkIds: number[];
            subStyleId: number;
          }[]
        ) => {
          console.log("xddd")
          setRunePages(runePages);
        }
      );

      window.electron.ipcRenderer.on('tooltip:set', (toolTips: RuneTips[]) => {
        setToolTips(toolTips);
      });
    })();
  }, []);

  const showRunePages = () => {
    if (runePages.length > 0 && toolTips.length > 0) {
      return runePages.map((runePage) => {
        return (
          <section className="col-md-6">
            <RunePage toolTips={toolTips} runePage={runePage} />
          </section>
        );
      });
    }
  };

  return (
    <div className="wrapper">
      <Header />
      <SideBar />
      <div className="content-wrapper">
        <div className="content-header" />
        <section className="content">
          <div className="container-fluid">
            <div className="row">{showRunePages()}</div>
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
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
