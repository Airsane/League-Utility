import {IPlugin} from "../App";

export const TabController = ({handleClick, currentPage, plugins}: { handleClick: (id:string)=>void,currentPage:string, plugins: IPlugin[] }) => {

  const handleClickBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = e.currentTarget.dataset.id!;
    handleClick(id);
  }

  const renderButtons = () => {
    return plugins.map((plugin,index) => {
      return <button onClick={handleClickBtn} key={index} data-id={plugin.id} className={plugin.id===currentPage ? "active" : ""}>{plugin.name}</button>
    })
  }

  return (
    <div className="tabSwitcher">
      {renderButtons()}
    </div>
  )
}
