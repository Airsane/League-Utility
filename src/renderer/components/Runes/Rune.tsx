import {RuneTips} from "../../../main/app/lib/teemo-api";

export const Rune = ({toolTip}: { toolTip: RuneTips }) => {
  return (<div>
    <img
      src={`https://raw.communitydragon.org/12.2/plugins/rcp-be-lol-game-data/global/default/v1/${toolTip.iconPath.toLowerCase().split('v1/')[1]}`}
      alt=""/>
  </div>)
}
