import { RuneTips } from '../../../main/app/lib/kindred-api';

export const Rune = ({ toolTip }: { toolTip: RuneTips  }) => {

  return (
    <div>
      <img data-toggle="tooltip" data-placement="top"
        src={`https://raw.communitydragon.org/12.2/plugins/rcp-be-lol-game-data/global/default/v1/${
          toolTip.iconPath.toLowerCase().split('v1/')[1]
        }`}
        alt=""
      />
    </div>
  );
};
