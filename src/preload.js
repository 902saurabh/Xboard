// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getClipboard: ({ query, sort, limit, offset }) => ipcRenderer.invoke('find-documents', { query, sort, limit, offset }),
})
