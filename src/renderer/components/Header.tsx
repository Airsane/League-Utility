import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";

export const Header = () => {

  const [champions, setChampions] = useState<any[]>([]);


  const findChampion = (e: any,value:any) => {
    e.preventDefault();
    const data = {
      champion: value.label.replace(/[^a-z0-9]/gi, "").replace(' ',''),
      gameMode: 0
    }
    console.log("Updating champ " + data.champion);
    window.electron.ipcRenderer.send('champion:update', data);
  }

  useEffect(() => {
    window.electron.storage.on('champions', (recievedChamps: any[]) => {
      const edited = recievedChamps.map((champ) => {
        return {label: champ.name, id: champ.id}
      })
      setChampions(edited);
    })

    return () => {
      window.electron.storage.removeListeners('champions');
    }
  }, [])


  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav"/>

      <form onSubmit={(e) =>{e.preventDefault();}} className="form-inline ml-3">
        <div className="input-group input-group-sm">
          <Autocomplete onChange={findChampion}  disablePortal size={"small"} id="ChampionPick" sx={{ width: 300 }} renderInput={(params => <TextField {...params} label="Champion"/>)} options={champions}
          />
        </div>
      </form>
    </nav>
  );
};
