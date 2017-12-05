// Electron
import { ipcMain, shell, Menu } from 'electron'

// Modules
import menuSettings from '../utils/contextMenus/menu_settings'
import menuAccount from '../utils/contextMenus/menu_account'
import menuProject from '../utils/contextMenus/menu_project'
import Config from './config'

// All System Events Available
const SYSTEM_EVENTS = {
  toggleSettings: 'sys:toggleSettings',
  openURL: 'sys:openURL',
  openConsoleURL: 'sys:openConsoleURL',
  openAccountUsageContextMenu: 'sys:openAccountUsageContextMenu',
  openProjectContextMenu: 'sys:openProjectContextMenu'
}

// Send Data to UI
// This is the state of the UI, with all API information the app need
export const UpdateUI = (mb, projects) => {
  if (!mb.window) return false

  mb.window.webContents.send('api:data', projects)
}

// UI Events Listener
// UI sends events using ipcRender and main proccess listen here
export const Events = {
  init(mb) {
    this.listenOpenURL()
    this.listenOpenConsoleURL()
    this.listenAccountUsageContextMenu(mb)
    this.listenProjectContextMenu(mb)
    this.listenSettingsMenu(mb)
  },

  listenSettingsMenu(mb) {
    ipcMain.on(SYSTEM_EVENTS.toggleSettings, (evt, url) => {
      const menu = Menu.buildFromTemplate(menuSettings(mb))

      menu.popup(mb.window)
    })
  },

  listenOpenURL() {
    ipcMain.on(SYSTEM_EVENTS.openURL, (evt, url) => shell.openExternal(url))
  },

  listenOpenConsoleURL() {
    ipcMain.on(SYSTEM_EVENTS.openConsoleURL, (evt, url) => shell.openExternal(Config.get('URLS').urlConsole))
  },

  listenAccountUsageContextMenu(mb) {
    ipcMain.on(SYSTEM_EVENTS.openAccountUsageContextMenu, (evt, accountUsageData) => {
      const menu = Menu.buildFromTemplate(menuAccount(mb, accountUsageData))

      menu.popup(mb.window)
    })
  },

  listenProjectContextMenu(mb) {
    ipcMain.on(SYSTEM_EVENTS.openProjectContextMenu, (evt, projectId) => {
      const menu = Menu.buildFromTemplate(menuProject(mb, projectId))

      menu.popup(mb.window)
    })
  }
}

export default Events
