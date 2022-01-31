import {Rune} from "./Rune";

export const RunePage = ({
                           runePage,
                           toolTips
                         }: { runePage: { name: string; primaryStyleId: number; selectedPerkIds: number[]; subStyleId: number; }, toolTips: RuneTips[] }) => {
  return (
    <div className="card">
      <div className="card-header ui-sortable-handle">
        <h3 className="card-title">
          <i className="fas fa-chart-pie mr-1"></i>
          RunePage Name
        </h3>
      </div>
      <div className="card-body">
        <div className="tab-content p-0">
          <div className="primaryRunes row">
            <Rune toolTip={toolTips.find((t) => t.id === runePage.primaryStyleId)!}></Rune>
          </div>
          <div className="secondaryRunes row">
            {runePage.selectedPerkIds.map((perk) => {
              return <Rune toolTip={toolTips.find(t => t.id === perk)!}></Rune>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface RuneTips {
  iconPath: string;
  id: number;
  longDesc: string;
  name: string;
  shortDesc: string;
  tooltip: string;
}
