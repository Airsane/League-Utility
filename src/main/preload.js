const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel, args) {
      ipcRenderer.send(channel, args);
    },
    on(channel, func) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    removeAllListeners(channel) {
      ipcRenderer.removeAllListeners(channel)
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  storage: {
    set(key, value) {
      ipcRenderer.send('storage:set', {key: key, value: value});
    },
    get(key) {
      return ipcRenderer.sendSync('storage:get', key);
    },
    getAll() {
      return ipcRenderer.sendSync('storage:getAll');
    },
    on(key, func) {
      ipcRenderer.on(`storage:on:${key}`, (event, ...args) => func(...args));
    },
    removeListeners(key) {
      ipcRenderer.removeAllListeners(`storage:on:${key}`)

    }
  }
});
