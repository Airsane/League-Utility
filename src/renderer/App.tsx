import {MemoryRouter as Router, Routes, Route} from 'react-router-dom';
import {Header} from './components/Header';
import {SideBar} from './components/SideBar';
import {RunePageDashboard} from "./components/Runes/RunePageDashboard";

export interface IPlugin {
  name: string,
  id: string
}

const Hello = () => {

  return (
    <div className="wrapper">
      <Header/>
      <SideBar/>
      <div className="content-wrapper">
        <RunePageDashboard/>
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
