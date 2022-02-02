import {IPlugin} from "../App";

export const TabController = ({handleClick, currentPage, plugins}: { handleClick: Function,currentPage:string, plugins: IPlugin[] }) => {

  const handleClickBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = e.currentTarget.dataset.id;
    handleClick(id);
  }

  const renderButtons = () => {
    return plugins.map((plugin) => {
      return <button onClick={handleClickBtn} data-id={plugin.id} className={plugin.id===currentPage ? "active" : ""}>{plugin.name}</button>
    })
  }

  return (
    <div className="tabSwitcher">
      {renderButtons()}
    </div>
  )
}
