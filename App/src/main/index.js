"use strict";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

import { ipcMain, shell } from "electron";
import { machineId } from "node-machine-id";
import { app, BrowserWindow, autoUpdater, dialog } from "electron";
import { processExistsMultiple } from "process-exists";
import { format as formatUrl } from "url";

import * as path from "path";

import Storage from "./../store/Store";
import UI from "./../ui/UI";

let mainWindow, authData;

const isDevelopment = process.env.mode === "DEVELOPMENT" ? true : false;

// Force only one instance of this to be open
const gotTheLock = app.requestSingleInstanceLock();

const HYPER_API_Key = "[REDACTED]";

if (!gotTheLock) {
  app.quit();
}

if (!isDevelopment) {
  // Disable error dialogs by overriding
  dialog.showErrorBox = function (title, content) {
    console.log(`${title}\n${content}`);
  };

  setTimeout(() => {
    checkProcesses();
  }, 5000);
}

async function getLicense(license) {
  return axios
    .get(`https://api.hyper.co/v6/licenses/${license}`, {
      headers: { Authorization: `Bearer ${HYPER_API_Key}` },
    })
    .then((response) => response.data)
    .catch(console.log);
}

async function updateLicense(license, hwid) {
  return axios
    .patch(
      `https://api.hyper.co/v5/licenses/${license}`,
      {
        metadata: { hwid },
      },
      {
        headers: { Authorization: `Bearer ${HYPER_API_Key}` },
      },
    )
    .then((response) => response.data)
    .catch(console.log);
}

async function checkLicense(license, authWindow) {
  if (license.trim() === "") {
    authWindow.webContents.send("error", "License is empty");
    return false;
  }

  let licenseData = await getLicense(license);
  log(licenseData);

  if (!licenseData) {
    authWindow.webContents.send("error", "License not found");
    log("License not found");
    return false;
  }

  if (!licenseData.user) {
    authWindow.webContents.send("error", "License not bound");
    log("License not bound");
    return false;
  }

  const hwid = await machineId();

  if (
    Object.keys(licenseData.metadata).length === 0 ||
    !licenseData?.metadata?.hwid
  ) {
    log("Updating License");
    await updateLicense(license, hwid);

    authData = licenseData;

    Storage.saveKey(license, licenseData.user.discord.id);

    return true;
  } else if (hwid === licenseData.metadata.hwid) {
    authData = licenseData;

    Storage.saveKey(license, licenseData.user.discord.id);

    return true;
  }

  authWindow.webContents.send(
    "error",
    "License is already in use on another machine!",
  );
  log("License is already in use on another machine!");

  return false;
}

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webviewTag: true,
      devTools: isDevelopment,
    },
    frame: false,
    transparent: true,
    resizable: true,
    roundedCorners: true,
    width: 1440,
    minWidth: 1440,
    minHeight: 800,
    height: 800,
    icon: "static/taskbarIconTransparent.ico",
    title: "FlurryGen 3.0",
  });

  window.webContents.openDevTools({ mode: "detach" });
  if (!isDevelopment) {
    autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: "info",
        buttons: ["Update", "Next time"],
        title: "Application Update",
        message: process.platform === "win32" ? releaseNotes : releaseName,
        detail:
          "A new version has been released. Update to the latest version?",
      };

      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall();
      });
    });

    autoUpdater.on("error", (message) => {
      console.error("There was a problem updating the application");
      console.error(message);
    });
  }

  if (isDevelopment) {
    window.loadURL(process.env.developmentURL);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__static, "core", "index.html"),
        protocol: "file",
        slashes: true,
      }),
    );
  }

  if (process.platform === "win32") {
    const DiscordRPC = require("discord-rich-presence");

    const clientId = "[removed]";

    const client = DiscordRPC(clientId);

    client.updatePresence({
      details: "Next-Gen Account Automation",
      startTimestamp: Date.now(),
      largeImageKey: "flurry-logo",
      largeImageText: "Alpha Testing",
      instance: false,
      buttons: [
        {
          label: "Twitter",
          url: "[removed]",
        },
      ],
    });

    client.on("error", console.error);
  }

  Storage.setAuth(authData);
  UI.mount(window);

  window.on("closed", () => {
    mainWindow = null;
  });

  window.show();

  // window.webContents.on("devtools-opened", () => {
  //   window.focus();
  //   setImmediate(() => {
  //     window.focus();
  //   });
  // });

  return window;
}

async function createAuthWindow() {
  const authWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      devTools: isDevelopment,
    },
    frame: false,
    maximazable: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    width: 610,
    minWidth: 610,
    height: 460,
    minHeight: 460,
    icon: "static/taskbarIconTransparent.ico",
    title: "FlurryGen 3.0",
  });

  authWindow.loadURL(
    formatUrl({
      pathname: path.join(__static, "index.html"),
      protocol: "file",
      slashes: true,
    }),
  );

  authWindow.webContents.once("dom-ready", () => {
    authWindow.webContents.send("key", Storage.getKey());
  });

  ipcMain.on("checkKey", async (e, keyValue) => {
    let valid = await checkLicense(keyValue, authWindow);

    if (valid) {
      mainWindow = createMainWindow();
      authWindow.close();
    }
  });

  ipcMain.on("openDashboard", async (e, data) => {
    shell.openExternal("[removed]");
  });
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createAuthWindow();
  }
});

app.on("ready", async () => {
  if ((await prefetchLicense(Storage.getKey())) === true) createMainWindow();
  else createAuthWindow();
});

async function prefetchLicense(license) {
  if (!license) return false;
  if (license.trim() === "") {
    return false;
  }

  log("Checking license...");
  let licenseData = await getLicense(license);

  if (!licenseData) {
    log("License not found");
    return false;
  }

  if (!licenseData.user) {
    log("License not bound");
    return false;
  }

  const hwid = await machineId();

  if (
    Object.keys(licenseData.metadata).length === 0 ||
    !licenseData?.metadata?.hwid
  ) {
    log("Updating License");
    await updateLicense(license, hwid);
    authData = licenseData;

    Storage.saveKey(license, licenseData.user.discord.id);

    return true;
  } else if (hwid === licenseData.metadata.hwid) {
    authData = licenseData;

    Storage.saveKey(license, licenseData.user.discord.id);

    return true;
  }
  return true;
  log("License is already in use on another machine!");
  return false;
}

ipcMain.on("exit", () => {
  process.exit();
});

let debuggerType;

async function checkProcesses() {
  try {
    const exists = await processExistsMultiple([
      "Charles.exe",
      "Wireshark.exe",
      "Fiddler.exe",
      "HTTP Toolkit.exe",
    ]);

    if (exists.get("Charles.exe")) {
      debuggerType = "Charles";
      await reportActivity();
      process.exit();
    } else if (exists.get("Wireshark.exe")) {
      debuggerType = "Wireshark";
      await reportActivity();
      process.exit();
    } else if (exists.get("Fiddler.exe")) {
      debuggerType = "Fiddler";
      await reportActivity();
      process.exit();
    } else if (exists.get("HTTP Toolkit.exe")) {
      debuggerType = "HTTP Toolkit";
      await reportActivity();
      process.exit();
    }
  } catch (err) {
    //console.log(err);
  }
}

async function reportActivity() {
  let form = {
    avatar_url: "[removed]",
    username: "FlurryGen 3.0",
    content: null,
    embeds: [
      {
        title: "Security - FlurryGen",
        description: `Detected ${debuggerType} running on the user's device, the application was terminated`,
        color: "13107199",
        footer: {
          icon_url: "[removed]",
          text: "FlurryGen",
        },
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: "License Key",
            value: `${Storage.getKey()}`,
            inline: true,
          },
          {
            name: "Application",
            value: `${debuggerType}`,
            inline: true,
          },
        ],
      },
    ],
  };
  return axios({
    method: "post",
    url: "[REDACTED]",
    data: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function log(content) {
  const now = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
  console.log(now, content);
}
