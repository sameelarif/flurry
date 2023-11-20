import axios from "axios";
import delay from "delay";

import Store from "../../../../store/Store";

const getNumber = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const list = Store.getSettings().sms.yomiesms;

      const numbers = list.split(/\r?\n/gm);
      const chosenNumber = numbers[Math.floor(Math.random() * numbers.length)];

      const [number, url] = chosenNumber.split("|");

      if (number) {
        if (url) {
          resolve({
            status: "OK",
            message: "Successfully Got Number",
            number: number,
            id: url,
          });
        } else {
          resolve({ status: "ERR", message: "URL Error" });
        }
      } else {
        resolve({ status: "ERR", message: "Number Error" });
      }
    } catch (e) {
      resolve({ status: "ERR", message: "Searching Error" });
    }
  });
};

const getCode = async (url) => {
  return new Promise(async (resolve, reject) => {
    const startTime = Date.now();

    while (true) {
      await delay(3000);
      if ((Date.now() - startTime) / 1000 < 90) {
        axios
          .get(url, {
            headers: {
              accept: "application/json",
            },
            validateStatus: false,
          })
          .then(async (response) => {
            if (response.status == 200) {
              if (response.data.message !== "No has message") {
                resolve({
                  status: "OK",
                  mesage: "Successfully Got Code",
                  code: response.data.message.match(/\d/g).join("").toString(),
                });
              }
            } else {
              resolve({ status: "ERR", message: response.data.toString() });
            }
          })
          .catch((err) => {
            console.log(err);
            resolve({ status: "ERR", message: "Request Error" });
          });
      } else {
        resolve({ status: "ERR", message: "Timed Out" });
      }
    }
  });
};

const finalize = async (url) => {
  let settings = Store.getSettings();

  settings.sms.yomiesms = settings.sms.yomiesms
    .split(/\r?\n/gm)
    .filter((e) => !e.includes(url))
    .join("\n");

  Store.setSettings(settings);

  resolve({ status: "OK", message: "Successfully Finalized Number" });
};

export default {
  getNumber,
  getCode,
  finalize,
};
