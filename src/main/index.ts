import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { is } from '@electron-toolkit/utils'

let entriesDir: string
let settingsPath: string

async function ensureDir(dir: string): Promise<void> {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle('diary:load', async (_, date: string) => {
    const filePath = join(entriesDir, `${date}.json`)
    try {
      const data = await readFile(filePath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return null
    }
  })

  ipcMain.handle('diary:save', async (_, date: string, content: string) => {
    await ensureDir(entriesDir)
    const entry = { date, content, updatedAt: new Date().toISOString() }
    await writeFile(join(entriesDir, `${date}.json`), JSON.stringify(entry, null, 2))
  })

  ipcMain.handle('settings:load', async () => {
    try {
      const data = await readFile(settingsPath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return null
    }
  })

  ipcMain.handle('settings:save', async (_, settings: unknown) => {
    const userDataPath = app.getPath('userData')
    await ensureDir(userDataPath)
    await writeFile(settingsPath, JSON.stringify(settings, null, 2))
  })
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0f0f14',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  const userDataPath = app.getPath('userData')
  entriesDir = join(userDataPath, 'entries')
  settingsPath = join(userDataPath, 'settings.json')

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
