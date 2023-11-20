import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

import axios from "axios";

import { app } from "electron";

const HYPER_API_Key = "[REDACTED]";

export default function (e) {
  const license = Store.getKey();

  resetLicense(license).then(() => {
    Store.removeKey("license");

    app.relaunch();
    app.exit();
  });
}

async function resetLicense(license) {
  return axios
    .patch(
      `https://api.hyper.co/v6/licenses/${license}`,
      {
        metadata: {},
      },
      {
        headers: {
          Authorization: `Bearer ${HYPER_API_Key}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    )
    .then(console.log)
    .catch(() => null);
}
