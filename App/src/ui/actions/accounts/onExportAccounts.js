import { BrowserWindow, dialog } from "electron";

import fs from "fs";

export default function (e, { site, name, accountsEntered }) {
  if (site && name) {
    let cleanAccounts = accountsEntered.split("\n").map((k) => k.trim());

    const win = BrowserWindow.getFocusedWindow();

    const fileName = dialog.showSaveDialogSync(win, {
      title: "Save Account List",
      filters: [{ name: "Text Documents", extensions: ["txt"] }],
      defaultPath: `~/${site}-${name}-${Date.now()}.txt`,
    });

    if (fileName) {
      fs.writeFile(fileName, cleanAccounts, (err) => {
        let options = { buttons: ["Close"] };

        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options);
      });
    }
  }
}
