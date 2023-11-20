const axios = require("axios");
const exceptions = require("./exceptions");

class SMSActivate {
  constructor(apiToken) {
    if (typeof apiToken !== "string") {
      throw new exceptions.InvalidAPIKey("API Key must be a string");
    }

    this.token = apiToken;
    this.session = axios.create({
      baseURL: "http://api.sms-activate.org/stubs/handler_api.php",
    });
  }

  async _createRequest(action, data) {
    const request = await this.session({
      method: "POST",
      params: {
        action,
        api_key: this.token,
        ...data,
      },
    });

    // TODO: Need to rewrite this disgraceful code :p
    if (request.data.includes("BAD_KEY")) {
      throw new exceptions.InvalidAPIKey("Invalid API Key");
    }

    if (request.data.includes("ERROR_SQL")) {
      throw new exceptions.SQLError("SQL Website error");
    }

    if (request.data.includes("NO_BALANCE")) {
      throw new exceptions.NoBalance("Not enough money for the order");
    }

    if (request.data.includes("NO_NUMBERS")) {
      throw new exceptions.NoFreeNumbers("No free numbers");
    }

    if (request.data.includes("BAD_STATUS")) {
      throw new exceptions.BadStatus("Bad status");
    }

    if (request.data.includes("BAD_SERVICE")) {
      throw new exceptions.BadService("Bad serivce");
    }

    if (request.data.includes("NO_ACTIVATION")) {
      throw new exceptions.InvalidActivation("Invalid activation id");
    }

    if (request.data.includes("BANNED")) {
      throw new exceptions.BannedUser(
        `Banned until ${request.data.split(":")[1]}`,
      );
    }

    return request.data;
  }

  async getBalance(withCashBack = false) {
    const respCash = await this._createRequest(
      withCashBack ? "getBalanceAndCashBack" : "getBalance",
    );
    const dataSplit = respCash.split(":");

    if (dataSplit[0] === "ACCESS_BALANCE" && dataSplit[1]) {
      return parseInt(dataSplit[1]);
    }

    return null;
  }

  async getNumber(service, country = 0, forward = false) {
    const getNumberResp = await this._createRequest("getNumber", {
      service,
      country,
      forward: Number(forward),
    });

    const dataSplit = getNumberResp.split(":");

    if (dataSplit[0] === "ACCESS_NUMBER" && dataSplit[1] && dataSplit[2]) {
      return { id: parseInt(dataSplit[1]), number: parseInt(dataSplit[2]) };
    }

    return null;
  }

  async setStatus(id, status, forward = false) {
    const getNumberResp = await this._createRequest("setStatus", {
      id,
      status,
      forwards: Number(forward),
    });

    return getNumberResp;
  }

  async getCode(id) {
    const getNumberResp = await this._createRequest("getStatus", {
      id,
    });
    const dataSplit = getNumberResp.split(":");

    if (dataSplit[0] === "STATUS_OK" && dataSplit[1]) {
      return dataSplit[1];
    }

    return null;
  }

  async getStatus(id) {
    const getNumberResp = await this._createRequest("getStatus", {
      id,
    });
    const dataSplit = getNumberResp.split(":");

    return dataSplit[0];
  }
}

module.exports = SMSActivate;
