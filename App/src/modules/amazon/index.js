import Functionality from "../../tasks/Functionality";

import cheerio from "cheerio";
import tough from "tough-cookie";

export default class extends Functionality {
  constructor(task, id) {
    super(task, id);

    this.setRunning(true);

    if (!this.invalidTask) this.control("initialize");
  }

  async control(step) {
    if (this.getQtyLeft() > 0 && this.checkStop()) {
      try {
        const nextStep = await this[step]();
        this.control(nextStep);
      } catch (e) {
        e.msg == undefined
          ? this.updateStatus("Unknown Error", "red")
          : this.updateStatus(e.msg, "red");

        setTimeout(() => {
          this.control(step);
        }, 3000);
      }
    } else {
      !this.checkStop()
        ? this.stopTask()
        : this.completeTask(this.task.quantity);
    }
  }

  initialize() {
    return new Promise(async (resolve, reject) => {
      this.getIdentity();
      this.getUserAgent();

      this.jar = new tough.CookieJar();

      this.session = new this.client({
        jar: this.jar,
        proxy: this.task.useProxies
          ? this.getProxyObj(this.task.proxyGroup)
          : undefined,
      });

      switch (this.task.region) {
        case "United States":
          this.extension = "com";
          this.signUpLink =
            "https://www.amazon.com/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3F_encoding%3DUTF8%26ref_%3Dnav_custrec_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "Canada":
          this.extension = "ca";
          this.signUpLink =
            "https://www.amazon.ca/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.ca%2F%3F_encoding%3DUTF8%26ref_%3Dnav_custrec_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=caflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "Germany":
          this.extension = "de";
          this.signUpLink =
            "https://www.amazon.de/-/en/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.de%2F%3F_encoding%3DUTF8%26ref_%3Dnav_custrec_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=deflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "United Kingdom":
          this.extension = "co.uk";
          this.signUpLink =
            "https://www.amazon.co.uk/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.co.uk%2F%3F_encoding%3DUTF8%26ref_%3Dnav_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=gbflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "Australia":
          this.extension = "com.au";
          this.signUpLink =
            "https://www.amazon.com.au/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com.au%2F%3F_encoding%3DUTF8%26ref_%3Dnav_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=auflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "China":
          this.extension = "cn";
          this.signUpLink =
            "https://www.amazon.cn/ap/register?_encoding=UTF8&openid.assoc_handle=cnflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.cn%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26ref_%3Dnav_custrec_newcust";
          break;
        case "France":
          this.extension = "fr";
          this.signUpLink =
            "https://www.amazon.fr/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.fr%2F%3F_encoding%3DUTF8%26ref_%3Dnav_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=frflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "India":
          this.extension = "in";
          this.signUpLink =
            "https://www.amazon.in/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3F_encoding%3DUTF8%26ref_%3Dnav_custrec_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "Italy":
          this.extension = "it";
          this.signUpLink =
            "https://www.amazon.it/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.it%2F%3F_encoding%3DUTF8%26ref_%3Dnav_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=itflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "Japan":
          this.extension = "co.jp";
          this.signUpLink =
            "https://www.amazon.co.jp/-/en/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.co.jp%2F%3F_encoding%3DUTF8%26ref_%3Dnav_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=jpflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "Mexico":
          this.extension = "com.mx";
          this.signUpLink =
            "https://www.amazon.com.mx/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com.mx%2F%3F_encoding%3DUTF8%26ref_%3Dnav_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=mxflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        case "Turkey":
          this.extension = "com.tr";
          this.signUpLink =
            "https://www.amazon.com.tr/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com.tr%2F%3F_encoding%3DUTF8%26ref_%3Dnav_custrec_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=trflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
        default:
          this.extension = "com";
          this.signUpLink =
            "https://www.amazon.com/ap/register?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3F_encoding%3DUTF8%26ref_%3Dnav_custrec_newcust&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";
          break;
      }

      resolve("getSignup");
    });
  }

  async getSignup() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Connecting to IMAP", "blue");

      try {
        this.emailCode = this.getOTP("amazon");

        await this.sleep(1000);
      } catch (error) {
        console.log(error);
        this.updateStatus("IMAP Error");

        await this.sleep(3000);

        reject({ message: "Failed to Connect to IMAP" });
        throw "Error connecting to IMAP";
      }

      this.updateStatus("Getting Signup", "blue");

      try {
        const res = await this.session._request({
          url: this.signUpLink,
          method: "GET",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            referer: "https://www.google.com/",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          timeout: 10000,
        });

        const $ = cheerio.load(res.body);

        [
          "appActionToken",
          "appAction",
          "subPageType",
          "openid.return_to",
          "prevRID",
          "workflowState",
        ].forEach((name) => {
          this[name] = $(`input[name="${name}"]`).attr("value");
        });

        this.metadata1 = await this.getMetadata();

        if (res.statusCode == 200) {
          resolve("sendAccount");
        } else {
          throw `Error Getting Signup`;
        }
      } catch (e) {
        reject({ msg: "Getting Signup Failed" });
      }
    });
  }

  async sendAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Sending Account Details", "blue");

      try {
        const res = await this.session._request({
          url: `https://www.amazon.${this.extension}/ap/register`,
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            "content-type": "application/x-www-form-urlencoded",
            origin: `https://www.amazon.${this.extension}`,
            referer: "https://www.google.com/",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          form: {
            appActionToken: this.appActionToken,
            appAction: this.appAction,
            "openid.return_to": this["openid.return_to"],
            prevRID: this.prevRID,
            workflowState: this.workflowState,
            claimToken: null,
            customerName: `${this.identity.firstName} ${this.identity.lastName}`,
            email: this.identity.email,
            password: this.identity.password,
            passwordCheck: this.identity.password,
            metadata1: this.metadata1,
          },
          timeout: 10000,
        });

        this.referer = res.finalUrl;

        const $ = cheerio.load(res.body);

        ["clientContext", "verifyToken"].forEach((name) => {
          this[name] = $(`input[name="${name}"]`).attr("value");
        });

        if (res.statusCode == 200) {
          resolve("solveCaptcha");
        } else {
          throw `Error Sending Account`;
        }
      } catch (e) {
        reject({ msg: "Sending Account Failed" });
      }
    });
  }

  async solveCaptcha() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Solving Captcha", "blue");

      try {
        this.captchaInstance = new this.captcha({
          provider: this.task.captchaProvider,
          retries: 100,
        });

        this.captchaToken = await this.captchaInstance.solve(
          this.id,
          "funcaptcha",
          {
            publickey: "2F1CD804-FE45-F12B-9723-240962EBA6F8",
            surl: "https://api.arkoselabs.com",
            URL: this.referer,
          },
        );

        const res = await this.session._request({
          url: `https://www.amazon.${this.extension}/ap/cvf/verify`,
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            "content-type": "application/x-www-form-urlencoded",
            origin: `https://www.amazon.${this.extension}`,
            referer: this.referer,
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          form: {
            cvf_captcha_arkose_response_token: this.captchaToken,
            clientContext: this.clientContext,
            "openid.pape.max_auth_age": "0",
            "openid.return_to": `https://www.amazon.${this.extension}/?ref_=nav_signin`,
            "openid.identity":
              "http://specs.openid.net/auth/2.0/identifier_select",
            "openid.assoc_handle": "usflex",
            "openid.mode": "checkid_setup",
            "openid.claimed_id":
              "http://specs.openid.net/auth/2.0/identifier_select",
            pageId: "usflex",
            "openid.ns": "http://specs.openid.net/auth/2.0",
            verifyToken: this.verifyToken,
          },
          timeout: 10000,
        });

        const $ = cheerio.load(res.body);

        ["clientContext", "verifyToken"].forEach((name) => {
          this[name] = $(`input[name="${name}"]`).attr("value");
        });

        if (res.statusCode == 200) {
          if (this?.finalUrl?.includes("ref_=nav_signin")) {
            this.updateStatus("Account Created!", "green", --qtyLeft, true);
            await this.displaySuccess();
            await this.sleep(1500);

            resolve("initialize");
          }

          resolve("verifyEmail");
        } else {
          throw `Error Solving Captcha`;
        }
      } catch (e) {
        reject({ msg: "Solving Captcha Failed" });
      }
    });
  }

  async verifyEmail() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Verifying Email (IMAP)", "blue");

      try {
        this.emailCode = await Promise.all([this.emailCode]);
        this.emailCode = this.emailCode[0];

        const res = await this.session._request({
          url: `https://www.amazon.${this.extension}/ap/cvf/verify`,
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            "content-type": "application/x-www-form-urlencoded",
            origin: `https://www.amazon.${this.extension}`,
            referer: this.referer,
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          form: {
            action: "code",
            "openid.assoc_handle": "usflex",
            "openid.mode": "checkid_setup",
            "openid.ns": "http://specs.openid.net/auth/2.0",
            verifyToken: this.verifyToken,
            code: this.emailCode.toString(),
            autoReadHiddenInputCode: null,
            autoReadStatus: "manual",
            metadata1: this.metadata1,
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          if (this?.finalUrl?.includes("ref_=nav_signin")) {
            this.updateStatus("Account Created!", "green", --qtyLeft, true);
            await this.displaySuccess();
            await this.sleep(1500);

            resolve("initialize");
          }

          resolve("verifyPhone");
        } else {
          throw `Error Verifying Email`;
        }
      } catch (e) {
        reject({ msg: "Email Verification Failed" });
      }
    });
  }

  async verifyPhone() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Verifying Phone", "blue");

      this.smsUsed = true;

      let qtyLeft = this.getQtyLeft();

      if (this.task.verifyWIthPhnNum) {
        this.smsInstance = new this.sms(this.task.provider);

        const smsResponse = await this.smsInstance.getNumber(
          "amazon",
          this.task.phnRegion,
        );

        if (smsResponse?.status == "ERR") {
          this.updateStatus(`SMS ${smsResponse.message}`, "red");
          await this.sleep(3000);
          this.smsInstance.cancel();

          reject({ msg: "Account Creation Failed" });

          throw `Error Creating Account`;
        } else {
          this.phone_number = smsResponse.number.toString();
        }
      } else {
        this.updateStatus("Must Enable Phone Verification", "red");
        await this.sleep(3000);
        this.stopTask();

        throw `Error Creating Account`;
      }

      try {
        let res = await this.session._request({
          url: `https://www.amazon.${this.extension}/ap/cvf/verify`,
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            "content-type": "application/x-www-form-urlencoded",
            origin: `https://www.amazon.${this.extension}`,
            referer: this.referer,
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          form: {
            "openid.assoc_handle": "usflex",
            "openid.mode": "checkid_setup",
            "openid.ns": "http://specs.openid.net/auth/2.0",
            verifyToken: this.verifyToken,
            cvf_phone_cc: this.getIso2(this.task.phnRegion),
            cvf_phone_num: this.phone_number.substring(1),
            cvf_action: "collect",
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          this.updateStatus("Waiting for SMS code", "blue");

          const codeResponse = await this.smsInstance.getCode();

          if (codeResponse?.status == "ERR") {
            this.updateStatus(`SMS ${codeResponse.message}`, "red");
            this.smsInstance.cancel();
            await this.sleep(3000);
            reject({ msg: "Phone Verification Failed" });
            throw `Error Creating Account`;
          }

          this.code = codeResponse.code;

          this.updateStatus("Submitting Account", "blue");

          res = await this.session._request({
            url: `https://www.amazon.${this.extension}/ap/cvf/verify`,
            method: "POST",
            headers: {
              accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
              "accept-language": "de-DE,de;q=0.9",
              authority: `www.amazon.${this.extension}`,
              "content-type": "application/x-www-form-urlencoded",
              origin: `https://www.amazon.${this.extension}`,
              referer: this.referer,
              "sec-ch-ua":
                '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-site": "same-origin",
              "sec-fetch-mode": "navigate",
              "sec-fetch-user": "?1",
              "sec-fetch-dest": "document",
              "upgrade-insecure-requests": "1",
              "user-agent": this.userAgent,
            },
            form: {
              "openid.assoc_handle": "usflex",
              "openid.mode": "checkid_setup",
              "openid.ns": "http://specs.openid.net/auth/2.0",
              verifyToken: this.verifyToken,
              code: this.code,
              cvf_action: "code",
            },
            timeout: 10000,
          });

          if (res.statusCode <= 309) {
            if (res.body.includes("already exists with the mobile number")) {
              this.updateStatus("Phone # Already Used", "red");

              this.sleep(3000);

              throw `Error Creating Account`;
            } else if (
              res.body.includes("You indicated you are a new customer,")
            ) {
              this.updateStatus("Email Already Used", "red");

              this.sleep(3000);

              throw `Error Creating Account`;
            }
            if (!this.task.setProfileInfo) {
              this.updateStatus("Account Created!", "green", --qtyLeft, true);
              await this.displaySuccess();
              await this.sleep(1500);

              resolve("initialize");
            } else {
              resolve("getWallet");
            }
          } else {
          }
        } else {
          throw `Error Creating Account`;
        }
      } catch (e) {
        await this.displayFail();
        reject({ msg: "Account Creation Failed" });
      }
    });
  }

  async getWallet() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Wallet", "blue");

      try {
        const res = await this.session._request({
          url: `https://www.amazon.${this.extension}/cpe/yourpayments/wallet`,
          qs: {
            ref_: "ya_d_c_pmt_mpo",
          },
          method: "GET",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            origin: `https://www.amazon.${this.extension}`,
            referer: this.referer,
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          timeout: 10000,
        });

        if (res?.finalUrl?.includes("/ap/signin")) {
        }

        const $ = cheerio.load(res.body);

        ["ppw-widgetState"].forEach((name) => {
          this[name] = $(`input[name="${name}"]`).attr("value");
        });

        if (res.statusCode == 200) {
          resolve("getData");
        } else {
          throw `Error Getting Wallet`;
        }
      } catch (e) {
        reject({ msg: "Getting Wallet Failed" });
      }
    });
  }

  async getData() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Data", "blue");

      try {
        const res = await this.session._request({
          url: `https://www.amazon.${this.extension}/payments-portal/data/widgets2/v1/customer/A20FHIX94QRZSY/continueWidget`,
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            "content-type": "application/x-www-form-urlencoded",
            origin: `https://www.amazon.${this.extension}`,
            referer: this.referer,
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          form: {
            "ppw-jsEnabled": true,
            "ppw-widgetState": this["ppw-widgetState"],
            "ppw-widgetEvent": "StartAddInstrumentEvent",
          },
          timeout: 10000,
        });

        const $ = cheerio.load(JSON.parse(res.body).htmlContent);

        ["ppw-widgetState"].forEach((name) => {
          this[name] = $(`input[name="${name}"]`).attr("value");
        });

        this.iframeName = res.body.split("var iFrameName = '")[1].split("'")[0];
        this.widgetInstanceId = res.body
          .split('widgetInstanceId":"')[1]
          .split('"')[0];

        if (res.statusCode == 200) {
          resolve("getFields");
        } else {
          throw `Error Getting Data`;
        }
      } catch (e) {
        reject({ msg: "Getting Data Failed" });
      }
    });
  }

  async getFields() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Fields", "blue");

      try {
        const res = await this.session._request({
          url: `https://apx-security.amazon.${this.extension}/cpe/pm/register`,
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            "content-type": "application/x-www-form-urlencoded",
            origin: `https://www.amazon.${this.extension}`,
            referer: this.referer,
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          form: {
            widgetState: this["ppw-widgetState"],
            returnUrl: `https://www.amazon.${this.extension}:443/cpe/yourpayments/wallet`,
            clientId: "YA:Wallet",
            usePopover: "true",
            maxAgeSeconds: "900",
            iFrameName: "ApxSecureIframe-pp-0nEUlD-6",
            parentWidgetInstanceId: "IzdBNmuPQE0d",
            hideAddPaymentInstrumentHeader: "true",
            creatablePaymentMethods: "CC",
          },
          timeout: 10000,
        });

        const $ = cheerio.load(JSON.parse(res.body).htmlContent);

        ["ppw-widgetState"].forEach((name) => {
          this[name] = $(`input[name="${name}"]`).attr("value");
        });

        if (res.statusCode == 200) {
          resolve("setDetails1");
        } else {
          throw `Error Getting Fields`;
        }
      } catch (e) {
        reject({ msg: "Getting Fields Failed" });
      }
    });
  }

  async setDetails1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Setting Details (1/2)", "blue");

      try {
        const res = await this.session._request({
          url: `https://apx-security.amazon.${this.extension}/payments-portal/data/widgets2/v1/customer/A20FHIX94QRZSY/continueWidget`,
          qs: {
            sif_profile: "APX-Encrypt-All-NA",
          },
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "de-DE,de;q=0.9",
            authority: `www.amazon.${this.extension}`,
            "content-type": "application/x-www-form-urlencoded",
            origin: `https://www.amazon.${this.extension}`,
            referer: `https://www.amazon.${this.extension}/cpe/yourpayments/wallet?ref_=ya_d_c_pmt_mpo&`,
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
          },
          form: {
            "ppw-widgetEvent:AddCreditCardEvent": "",
            "ppw-jsEnabled": true,
            widgetState: this["ppw-widgetState"],
            ie: "UTF-8",
            addCreditCardNumber: this.formatCardNumber("4647070765342070"),
            "ppw-accountHolderName": "John Doe",
            "ppw-expirationDate_month": "1",
            "ppw-expirationDate_year": "2027",
            addCreditCardVerificationNumber: "",
            "ppw-addCreditCardVerificationNumber_isRequired": "false",
            "ppw-addCreditCardPostalCode": "",
            "ppw-addCreditCardPostalCode_isRequired": "false",
          },
          timeout: 10000,
        });

        const $ = cheerio.load(JSON.parse(res.body).htmlContent);

        ["ppw-widgetState"].forEach((name) => {
          this[name] = $(`input[name="${name}"]`).attr("value");
        });

        if (res.statusCode == 200) {
          resolve("setDetails2");
        } else {
          throw `Error Setting Details (1)`;
        }
      } catch (e) {
        reject({ msg: "Setting Details (1) Failed" });
      }
    });
  }

  async setDetails2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Setting Details (2/2)", "blue");

      try {
        const res = await this.session._request({
          url: `https://apx-security.amazon.${this.extension}/payments-portal/data/widgets2/v1/customer/A20FHIX94QRZSY/continueWidget`,
          method: "POST",
          headers: {
            authority: `www.amazon.${this.extension}`,
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            referer: `https://www.amazon.${this.extension}/cpe/yourpayments/wallet?ref_=ya_d_c_pmt_mpo&`,
            "accept-language": "de-DE,de;q=0.9",
            "Widget-Ajax-Attempt-Count": "0",
            "X-Requested-With": "XMLHttpRequest",
          },
          form: {
            "ppw-widgetEvent:AddCreditCardEvent": "",
            "ppw-jsEnabled": true,
            widgetState: this["ppw-widgetState"],
            ie: "UTF-8",
            "ppw-pickAddressType": "Inline",
            "ppw-fullName": "John Doe",
            "ppw-line1": "1 Green Street",
            "ppw-line2": "",
            "ppw-city": "New York",
            "ppw-stateOrRegion": "New York",
            "ppw-postalCode": "10001",
            "ppw-countryCode": "US",
            "ppw-phoneNumber": "1234567890",
          },
          timeout: 10000,
        });

        const $ = cheerio.load(JSON.parse(res.body).htmlContent);

        ["ppw-widgetState"].forEach((name) => {
          this[name] = $(`input[name="${name}"]`).attr("value");
        });

        if (res.statusCode == 200) {
          this.updateStatus("Account Created!", "green", --qtyLeft, true);
          await this.displaySuccess();
          await this.sleep(1500);

          resolve("initialize");
        } else {
          throw `Error Setting Details (2)`;
        }
      } catch (e) {
        reject({ msg: "Setting Details (2) Failed" });
      }
    });
  }

  async getMetadata() {
    this.updateStatus("Solving Anti-Bot", "blue");

    const response = await this.session.post({
      url: `https://www.botbypass.com/metadata_api/registration?email=${encodeURIComponent(
        this.identity.email,
      )}&passwordLength=${encodeURIComponent(
        this.identity.password.length,
      )}&name=${encodeURIComponent(
        `${this.identity.firstName} ${this.identity.lastName}`,
      )}&location=${encodeURIComponent(
        `https://www.amazon.${this.extension}/ap/register`,
      )}&referrer=${this.referer}&userAgent=${encodeURIComponent(
        this.userAgent,
      )}&apiKey=38cfcce7-9529-4329-a0db-2fa48464a2d2`,
    });

    return JSON.parse(response.body).metadata1;
  }

  async displaySuccess() {
    this.addToGroup("amazon", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "Amazon",
      this.identity.email,
      this.identity.password,
      this.smsUsed,
    );

    if (
      this.task.customEmails &&
      this.checkEmailGroupLength(this.task.emailGroup) > 0
    ) {
      this.deleteUsedCustomEmail(this.task.emailGroup, this.identity.email);
    }

    await this.webhook({
      content: null,
      embeds: [
        {
          title: "Created Amazon account",
          description: `[Copy account credentials](https://[removed]/?text=${encodeURI(
            this.identity.email,
          )}:${encodeURI(this.identity.password)})`,
          color: 12773868,
          fields: [
            {
              name: "Email",
              value: `||${this.identity.email}||`,
              inline: true,
            },
            {
              name: "Password",
              value: `||${this.identity.password}||`,
              inline: true,
            },
          ],
          footer: {
            text: "FlurryGen",
            icon_url:
              "https://cdn.discordapp.com/emojis/887810357815566386.gif",
          },
          timestamp: new Date().toISOString(),
          thumbnail: {
            url: "https://media.discordapp.net/attachments/901342456551993385/907635984206807080/amzpng.png",
          },
        },
      ],
      username: "FlurryGen 3.0",
      avatar_url: "https://www.[removed]/assets/logo.png",
    });
  }

  async displayFail() {
    this.updateDashFail(false);
  }
}
