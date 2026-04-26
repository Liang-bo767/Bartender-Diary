import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  diary: {
    load: (date: string) => ipcRenderer.invoke('diary:load', date),
    save: (date: string, content: string) => ipcRenderer.invoke('diary:save', date, content)
  },
  settings: {
    load: () => ipcRenderer.invoke('settings:load'),
    save: (settings: unknown) => ipcRenderer.invoke('settings:save', settings)
  }
})
