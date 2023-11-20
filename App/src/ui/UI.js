import { ipcMain } from "electron";
import Screens from "./constants/screens";
import Store from "../store/Store";

import Loaders from "./screens/onLoad";
import SettingsActions from "./actions/settings/settings";
import AccountActions from "./actions/accounts/accounts";
import ProxyActions from "./actions/proxies/proxies";
import TaskActions from "./actions/tasks/task";

class UI {
  constructor() {
    //Loaders

    ipcMain.on(`${Screens.DASH}-LOAD`, async (e) => {
      e.sender.send(`${Screens.DASH}-LOAD`, await Loaders.onDashboardLoad());
    });

    ipcMain.on(`${Screens.PROXY}-LOAD`, async (e) => {
      e.sender.send(`${Screens.PROXY}-LOAD`, await Loaders.onProxiesLoad());
    });

    ipcMain.on(`${Screens.SETTINGS}-LOAD`, async (e) => {
      e.sender.send(`${Screens.SETTINGS}-LOAD`, await Loaders.onSettingsLoad());
    });

    ipcMain.on(`PROFILES-LOAD`, async (e) => {
      e.sender.send(`PROFILES-LOAD`, await Loaders.onProfilesLoad());
    });

    ipcMain.on(`${Screens.AUTH}-LOAD`, async (e) => {
      e.sender.send(`${Screens.AUTH}-LOAD`, await Loaders.onAuthLoad());
    });

    ipcMain.on(`${Screens.ACCOUNTS}-LOAD`, async (e) => {
      e.sender.send(`${Screens.ACCOUNTS}-LOAD`, await Loaders.onAccountsLoad());
    });

    ipcMain.on(`${Screens.TASKS}-LOAD`, async (e) => {
      e.sender.send(`${Screens.TASKS}-LOAD`, await Loaders.onTasksLoad());
    });

    ipcMain.on(`${Screens.TASKS}-OPTIONS`, async (e) => {
      e.sender.send(
        `${Screens.TASKS}-OPTIONS`,
        await Loaders.loadTasksOptions(),
      );
    });

    Object.keys(SettingsActions).forEach((action) => {
      ipcMain.on(`${Screens.SETTINGS}-${action}`, SettingsActions[action]);
    });

    Object.keys(AccountActions).forEach((action) => {
      ipcMain.on(`${Screens.ACCOUNTS}-${action}`, AccountActions[action]);
    });

    Object.keys(ProxyActions).forEach((action) => {
      ipcMain.on(`${Screens.PROXY}-${action}`, ProxyActions[action]);
    });

    Object.keys(TaskActions).forEach((action) => {
      ipcMain.on(`${Screens.TASKS}-${action}`, TaskActions[action]);
    });
  }

  mount(win) {
    this.ipcRenderer = win.webContents;
  }

  error(message) {
    this.ipcRenderer.send("error", message);
  }

  /*
  Manually update a screen's display with data
   */
  update(screen, data) {
    this.ipcRenderer.send(`${screen}-LOAD`, data);
  }
}

export default new UI();
