import {Rune} from './Rune';
import {IRunePage} from '../../../main/app/RunePagesPlugins/RunePages';

export const RunePage = ({
                           runePage,
                           toolTips,
                           isLocalPage
                         }: {
  runePage: IRunePage;
  toolTips: RuneTips[];
  isLocalPage: boolean;
}) => {
  const setRunePage = () => {
    window.electron.ipcRenderer.send('runePage:set', runePage);
  };

  const saveRunePage = () =>{
    window.electron.ipcRenderer.send('runePage:save', runePage);
  }

  const showSaveButton = () => {
    if (isLocalPage)
      return
    return (<button className="btn btn-success" onClick={saveRunePage}>
      Save Rune
    </button>)
  }

  return (
    <div className="card">
      <div className="card-header ui-sortable-handle">
        <h3 className="card-title">
          <i className="fas fa-chart-pie mr-1"/>
          {runePage.name}
        </h3>
      </div>
      <div className="card-body">
        <div className="tab-content p-0">
          <div className="primaryRunes row">
            {runePage.selectedPerkIds.map((perk, i) => {
              return <Rune key={i} toolTip={toolTips.find((t) => t.id === perk)!}/>;
            })}
          </div>
          <div className="secondaryRunes row">
            {runePage.build.map((item) => {
              return (
                <img
                  width="50px"
                  height="50px"
                  src={`https://ddragon.leagueoflegends.com/cdn/12.2.1/img/item/${item}.png`}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-primary" onClick={setRunePage}>
          Set Runes
        </button>
        {showSaveButton()}
      </div>
    </div>
  );
};

export interface RuneTips {
  iconPath: string;
  id: number;
  longDesc: string;
  name: string;
  shortDesc: string;
  tooltip: string;
}

export interface PageBuild {
}
