import Store from 'electron-store'
import {app} from 'electron'

export const settings = new Store({
  name: "settings",
  defaults: {
    config: {
      name: "config",
      cwd: app.getPath('userData'),
      ext: ".json"
    },
    autoChamp: false,
  }
})

export const dataStore = new Store({
  name: "dataStore",
  defaults: {
    config: {
      name: "config",
      cwd: app.getPath('userData'),
      ext: ".json"
    },
    version: "",
    tooltips: [],
    localRunes:[],
    champions:[]
  }
});
