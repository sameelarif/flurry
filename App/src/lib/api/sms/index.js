import fivesim from "./providers/fivesim";
import onlinesim from "./providers/onlinesim";
import smsactivate from "./providers/smsactivate";
import yomiesms from "./providers/yomiesms";

import dialingMap from "./maps/dialing_map";
import Store from "../../../store/Store";
import Map from "./Maps/provider_Map";

export default class {
  constructor(provider) {
    this.provider = provider.toLowerCase().replace("-", "");
    this.provider = this.provider == "yomie" ? "yomiesms" : this.provider;
    this.key = this.getKey(this.provider);
    this.taskID = null;
  }

  async getNumber(service, country) {
    return new Promise(async (resolve, reject) => {
      service = Map.getService(this.provider, service);
      country = Map.getCountry(this.provider, country);

      if (service || this.provider == "yomiesms") {
        if (country || this.provider == "yomiesms") {
          if (this.key || this.provider == "yomiesms") {
            let response;
            switch (this.provider) {
              case "fivesim":
                response = await fivesim.getNumber(service, country, this.key);
                break;
              case "onlinesim":
                response = await onlinesim.getNumber(
                  service,
                  country,
                  this.key,
                );
                break;
              case "smsactivate":
                response = await smsactivate.getNumber(
                  service,
                  country,
                  this.key,
                );
                break;
              case "yomiesms":
                response = await yomiesms.getNumber();
                break;
            }

            if (response.id) {
              this.taskID = response.id;
              delete response.id;
            }

            resolve(response);
          } else {
            resolve({ status: "ERR", message: "Missing Key" });
          }
        } else {
          resolve({ status: "ERR", message: "Country Invalid" });
        }
      } else {
        resolve({ status: "ERR", message: "Service Invalid" });
      }
    });
  }

  async getCode() {
    return new Promise(async (resolve, reject) => {
      if (this.provider !== "yomiesms" && !this.taskID) {
        resolve({ status: "ERR", message: "No Task ID" });
      } else {
        if (this.taskID) {
          let response;
          switch (this.provider) {
            case "fivesim":
              response = await fivesim.getCode(this.taskID, this.key);
              break;
            case "onlinesim":
              response = await onlinesim.getCode(this.taskID, this.key);
              break;
            case "smsactivate":
              response = await smsactivate.getCode(this.taskID, this.key);
              break;
            case "yomiesms":
              response = await yomiesms.getCode(this.url);
          }

          resolve(response);
        } else {
          resolve({ status: "ERR", message: "No Task ID" });
        }
      }
    });
  }

  async cancel() {
    return new Promise(async (resolve, reject) => {
      if (this.provider == "yomiesms") {
        resolve({ status: "OK", message: "Yomie No Cancels" });
      } else {
        if (this.taskID) {
          let response;
          switch (this.provider) {
            case "fivesim":
              response = await fivesim.cancel(this.taskID, this.key);
              break;
            case "onlinesim":
              response = await onlinesim.cancel(this.taskID, this.key);
              break;
            case "smsactivate":
              response = await smsactivate.cancel(this.taskID, this.key);
              break;
          }

          resolve(response);
        } else {
          resolve({ status: "ERR", message: "No Task ID" });
        }
      }
    });
  }

  async finalize() {
    return new Promise(async (resolve, reject) => {
      if (this.taskID) {
        let response;
        switch (this.provider) {
          case "fivesim":
            response = await fivesim.finalize(this.taskID, this.key);
            break;
          case "onlinesim":
            response = await onlinesim.finalize(this.taskID, this.key);
            break;
          case "smsactivate":
            response = await smsactivate.finalize(this.taskID, this.key);
            break;
          case "yomiesms":
            response = await yomiesms.finalize(this.taskID);
            break;
        }

        if (response.id) {
          this.taskID = response.id;
          delete response.id;
        }

        resolve(response);
      } else {
        resolve({ status: "ERR", message: "No Task ID" });
      }
    });
  }

  getDialingCode(country) {
    return dialingMap.map(country);
  }

  getIso2(country) {
    return dialingMap.iso2(country);
  }

  getKey(provider) {
    let settings = Store.getSettings();
    return settings.sms[provider];
  }
}
