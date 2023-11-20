import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

import fs from "fs";
import path from "path";

import { app } from "electron";

export default function (e) {
  const userPath = app.getPath("userData");

  fs.unlinkSync(path.join(userPath, "FlurryGen2.json"));

  app.relaunch();
  app.exit();
}
