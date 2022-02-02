import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";

export const Header = () => {

  const [champions, setChampions] = useState<any[]>([]);


  const findChampion = (e: any) => {
    e.preventDefault();
    const inputField = document.querySelector('#ChampionPick')! as HTMLInputElement
    const data = {
      champion: inputField.value.replace(/[^a-z0-9]/gi, "").replace(' ',''),
      gameMode: 0
    }
    window.electron.ipcRenderer.send('champion:update', data);
  }

  useEffect(() => {
    window.electron.storage.on('champions', (champions: any[]) => {
      const edited = champions.map((champ) => {
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

      <form onSubmit={findChampion} className="form-inline ml-3">
        <div className="input-group input-group-sm">
          <Autocomplete  disablePortal size={"small"} id="ChampionPick" sx={{ width: 300 }} renderInput={(params => <TextField {...params} label="Champion"/>)} options={champions}
          />
        </div>
      </form>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-comments"/>
            <span className="badge badge-danger navbar-badge">3</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <a href="#" className="dropdown-item">
              <div className="media">
                <img
                  src="dist/img/user1-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 mr-3 img-circle"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Brad Diesel
                    <span className="float-right text-sm text-danger">
                      <i className="fas fa-star"/>
                    </span>
                  </h3>
                  <p className="text-sm">Call me whenever you can...</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1"/> 4 Hours Ago
                  </p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"/>
            <a href="#" className="dropdown-item">
              <div className="media">
                <img
                  src="dist/img/user8-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 img-circle mr-3"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    John Pierce
                    <span className="float-right text-sm text-muted">
                      <i className="fas fa-star"/>
                    </span>
                  </h3>
                  <p className="text-sm">I got your message bro</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1"/> 4 Hours Ago
                  </p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"/>
            <a href="#" className="dropdown-item">
              <div className="media">
                <img
                  src="dist/img/user3-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 img-circle mr-3"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Nora Silvester
                    <span className="float-right text-sm text-warning">
                      <i className="fas fa-star"/>
                    </span>
                  </h3>
                  <p className="text-sm">The subject goes here</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1"/> 4 Hours Ago
                  </p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"/>
            <a href="#" className="dropdown-item dropdown-footer">
              See All Messages
            </a>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-bell"/>
            <span className="badge badge-warning navbar-badge">15</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-header">15 Notifications</span>
            <div className="dropdown-divider"/>
            <a href="#" className="dropdown-item">
              <i className="fas fa-envelope mr-2"/> 4 new messages
              <span className="float-right text-muted text-sm">3 mins</span>
            </a>
            <div className="dropdown-divider"/>
            <a href="#" className="dropdown-item">
              <i className="fas fa-users mr-2"/> 8 friend requests
              <span className="float-right text-muted text-sm">12 hours</span>
            </a>
            <div className="dropdown-divider"/>
            <a href="#" className="dropdown-item">
              <i className="fas fa-file mr-2"/> 3 new reports
              <span className="float-right text-muted text-sm">2 days</span>
            </a>
            <div className="dropdown-divider"/>
            <a href="#" className="dropdown-item dropdown-footer">
              See All Notifications
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="control-sidebar"
            data-slide="true"
            href="#"
            role="button"
          >
            <i className="fas fa-th-large"/>
          </a>
        </li>
      </ul>
    </nav>
  );
};
