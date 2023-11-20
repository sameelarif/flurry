import capmonster from "./providers/capmonster";
import twocaptcha from "./providers/twocaptcha";
import anticaptcha from "./providers/anticaptcha";

import Store from "../../../store/Store";

export default class {
  constructor(opts) {
    console.log(opts.provider);
    switch (opts.provider) {
      case "2Captcha":
        this.provider = "twoCaptcha";
        break;
      case "CapMonster":
        this.provider = "capmonster";
        break;
      case "Anti-Captcha":
        this.provider = "antiCaptcha";
        break;
    }

    this.retries = opts.retries;
    this.taskID = null;

    this.key = this.getKey();
  }

  getKey() {
    let settings = Store.getSettings();
    return settings.captcha[this.provider];
  }

  async solve(id, type, opts) {
    let response;

    switch (type) {
      case "recaptchatwo":
        if (opts.sitekey && opts.URL) {
          switch (this.provider) {
            case "twoCaptcha":
              response = await twocaptcha.recaptchatwo(
                id,
                opts.sitekey,
                opts.URL,
              );
              break;
            case "capmonster":
              response = await capmonster.recaptchatwo(
                id,
                opts.sitekey,
                opts.URL,
              );
              break;
            case "antiCaptcha":
              response = await twocaptcha.recaptchatwo(
                id,
                opts.sitekey,
                opts.URL,
              );
              break;
          }
        } else {
          response = { status: "ERR", message: "Missing Sitekey/URL" };
        }
        break;
      case "recaptchathree":
        if (opts.sitekey && opts.action && opts.URL) {
          switch (this.provider) {
            case "twoCaptcha":
              response = await twocaptcha.recaptchathree(
                id,
                this.key,
                opts.sitekey,
                opts.action,
                opts.URL,
              );
              break;
            case "capmonster":
              response = await capmonster.recaptchathree(
                id,
                this.key,
                opts.sitekey,
                opts.action,
                opts.URL,
              );
              break;
            case "antiCaptcha":
              response = await twocaptcha.recaptchathree(
                id,
                this.key,
                opts.sitekey,
                opts.action,
                opts.URL,
              );
              break;
          }
        } else {
          response = { status: "ERR", message: "Missing Sitekey/Action/URL" };
        }
        break;
      case "funcaptcha":
        if (opts.publickey && opts.surl && opts.URL) {
          switch (this.provider) {
            case "twoCaptcha":
              console.log(id, this.key, opts.publickey, opts.surl, opts.URL);
              response = await twocaptcha.funcaptcha(
                id,
                this.key,
                opts.publickey,
                opts.surl,
                opts.URL,
              );
              break;
            case "capmonster":
              response = await capmonster.funcaptcha(
                id,
                this.key,
                opts.publickey,
                opts.surl,
                opts.URL,
              );
              break;
            case "antiCaptcha":
              response = await anticaptcha.funcaptcha(
                id,
                this.key,
                opts.publickey,
                opts.surl,
                opts.URL,
              );
              break;
          }
        } else {
          response = { status: "ERR", message: "Missing PublicKey/sURL/URL" };
        }
        break;
      case "geetest":
        if (opts.gt && opts.challenge && opts.server && opts.URL) {
          switch (this.provider) {
            case "twoCaptcha":
              response = await twocaptcha.geetest(
                opts.gt,
                opts.challenge,
                opts.server,
                opts.URL,
              );
              break;
            case "capmonster":
              response = await capmonster.geetest(
                opts.gt,
                opts.challenge,
                opts.server,
                opts.URL,
              );
              break;
            case "antiCaptcha":
              response = await anticaptcha.geetest(
                opts.gt,
                opts.challenge,
                opts.server,
                opts.URL,
              );
              break;
          }
        } else {
          response = {
            status: "ERR",
            message: "Missing GT/Challenge ID/API Server/URL",
          };
        }
        break;
    }

    if (response.status) {
      if (response.status == "OK") {
        this.taskID = response.id;
        delete response.id;
      }
    }

    return response;
  }

  async getSolution() {}
}
