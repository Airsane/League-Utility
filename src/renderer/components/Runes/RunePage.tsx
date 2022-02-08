import {Rune} from './Rune';
import {IRunePage} from '../../../main/app/RunePagesPlugins/RunePages';

export const RunePage = ({
                           runePage,
                           toolTips,
                           isLocalPage,
                           isCurrentPage = false
                         }: {
  runePage: IRunePage;
  toolTips: RuneTips[];
  isLocalPage: boolean;
  isCurrentPage?:boolean;
}) => {
  const setRunePage = () => {
    window.electron.ipcRenderer.send('runePage:set', runePage);
  };

  const saveRunePage = () => {
    window.electron.ipcRenderer.send('runePage:save', runePage);
  }

  const showSaveButton = () => {
    if (isLocalPage)
      return
    return (<button className="btn btn-success" onClick={saveRunePage}>
      <i className="fas fa-download"></i>
    </button>)
  }

  const showUploadButton = ()=>{
    if(!isCurrentPage){
      return(<button className="btn btn-primary" onClick={setRunePage}>
        <i className="fas fa-upload"></i>
      </button>)
    }
    return
  }

  return (
    <div className="rune-page-row mb-3">
      <div className="runes">{runePage.selectedPerkIds.map((perk, i) => {
        return <Rune key={i} toolTip={toolTips.find((t) => t.id === perk)!}/>;
      })}</div>
      <div className="text-sm">{runePage.name}</div>
      <div>
        {showSaveButton()}
        {showUploadButton()}
      </div>
    </div>
    // <div className="card">
    //   <div className="card-header ui-sortable-handle">
    //     <h3 className="card-title">
    //       <i className="fas fa-chart-pie mr-1"/>
    //       {runePage.name}
    //     </h3>
    //   </div>
    //   <div className="card-body">
    //     <div className="tab-content p-0">
    //       <div className="primaryRunes row">
    //
    //       </div>
    //       <div className="secondaryRunes row">

    //       </div>
    //     </div>
    //   </div>
    //   <div className="card-footer">
    //     <button className="btn btn-primary" onClick={setRunePage}>
    //       Set Runes
    //     </button>
    //     {showSaveButton()}
    //   </div>
    // </div>
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

// tslint:disable-next-line:no-empty-interface
export interface PageBuild {
}
