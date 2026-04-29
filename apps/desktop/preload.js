const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  openEditor: (filePath, line) => ipcRenderer.invoke('editor:open', filePath, line)
});
