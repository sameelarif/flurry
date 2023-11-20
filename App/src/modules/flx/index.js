import Functionality from "../../tasks/Functionality";
import browserData from "../../lib/tools/Browser_Data";

import request from "request-promise";
import faker from "faker";

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
        console.log("e from reject:", e);
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
      this.getUserAgent("mobile");

      this.browserData = browserData.generate();

      let m = this.getRandomInt(1, 12);
      let d = this.getRandomInt(1, 29);
      let y = this.getRandomInt(1980, 2000);

      m = m >= 10 ? m.toString() : `0${m}`;
      d = d >= 10 ? d.toString() : `0${d}`;

      this.identity["birthday"] = `${m}/${d}/${y}`;

      this.jar = request.jar();

      this.request = request.defaults({
        proxy: this.task.useProxies
          ? this.getProxy(this.task.proxyGroup)
          : undefined,
        withCredentials: true,
        strictSSL: false,
        resolveWithFullResponse: true,
        followAllRedirects: true,
      });

      this.activationToken = null;

      resolve("getSession");
    });
  }

  async getSession() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Session", "blue");

      try {
        const res = await this.request({
          url: `https://www.footlocker.com/apigate/v3/session`,
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-FL-APP-VERSION": "5.3.5",
            "X-FLAPI-API-IDENTIFIER": "921B2b33cAfba5WWcb0bc32d5ix89c6b0f614",
            "X-FL-DEVICE-ID": "573DB8BB-0BB9-40C7-BE49-6B119AAAC4CF",
            "Accept-Language": "en-US,en;q=0.9",
            "X-API-KEY": "m38t5V0ZmfTsRpKIiQlszub1Tx4FbnGG",
            "Accept-Encoding": "identity",
            "User-Agent": "FootLocker/CFNetwork/Darwin",
            "X-API-COUNTRY": "US",
            Connection: "keep-alive",
            "X-API-LANG": "en-US",
            "X-NewRelic-ID": "VgAPVVdRDRAIVldUBQQEUFY=",
            "X-FL-REQUEST-ID": "8C6C4319-5313-426C-A1EB-9E5D4164BD5C",
          },
          jar: this.jar,
          timeout: 3000,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          let data = JSON.parse(res.body);
          this.csrf = data.data.csrfToken;

          if (this.csrf) {
            resolve("createAccount");
          } else {
            throw `Step Requirements Failed`;
          }
        }
      } catch (e) {
        reject({ msg: "Error Getting Session" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      let qtyLeft = this.getQtyLeft();

      let parsedJar;
      this.jar._jar.store.getAllCookies(function (err, cookieArray) {
        if (err) throw new Error("Failed to get cookies");
        parsedJar = JSON.stringify(cookieArray, null, 4);
      });

      this.parsedJar = parsedJar;

      try {
        this.updateStatus("Creating Account", "blue");

        const res = await this.request({
          url: `https://www.footlocker.com/apigate/v3/users`,
          method: "POST",
          headers: {
            "User-Agent": "FootLocker/CFNetwork/Darwin",
            "X-API-LANG": "en-US",
            "X-API-COUNTRY": "US",
            "X-FL-APP-VERSION": "5.3.5",
            "X-FLAPI-SESSION-ID": this.getSingleCookie(parsedJar, "JSESSIONID"),
            "X-CSRF-TOKEN": this.csrf,
            Connection: "keep-alive",
            "X-FL-REQUEST-ID": "FB5A1BC8-3BD2-4DF0-B35A-08C92E807346",
            "Accept-Language": "en-US,en;q=0.9",
            "X-FLAPI-API-IDENTIFIER": "921B2b33cAfba5WWcb0bc32d5ix89c6b0f614",
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-FL-DEVICE-ID": "573DB8BB-0BB9-40C7-BE49-6B119AAAC4CF",
            "X-API-KEY": "m38t5V0ZmfTsRpKIiQlszub1Tx4FbnGG",
            "Accept-Encoding": "gzip, deflate, br",
            // "user-agent": this.userAgent,
            // "x-csrf-token": this.csrf,
            // "x-fl-request-id": this.uuid(),
            // "x-flapi-session-id": this.getSingleCookie(parsedJar, "JSESSIONID"),
          },
          body: JSON.stringify({
            postalCode:
              this.task.zipCode || faker.address.zipCode().split("-")[0],
            uid: this.identity.email,
            preferredLanguage: "en",
            bannerEmailOptIn: Math.random() > 0.5,
            lastName: this.identity.lastName,
            loyaltyFlxEmailOptIn: true,
            flxTcVersion: "2.0",
            password: this.identity.password,
            "g-recaptcha-response": "",
            loyaltyStatus: true,
            birthday: this.identity.birthday,
            firstName: this.identity.firstName,
            phoneNumber: faker.phone.phoneNumberFormat().replace(/-/g, ""),
          }),
          jar: this.jar,
        });

        if ([200, 201].includes(res.statusCode)) {
          this.csrf = res.headers["x-csrf-token"];

          if (this.task.verifyEmail) {
            resolve("verifyEmail");
          } else {
            this.updateStatus("Account Created!", "green", --qtyLeft, true);
            this.displaySuccess();
            await this.sleep(800);

            resolve("initialize");
          }
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Creation Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async verifyEmail() {
    return new Promise(async (resolve, reject) => {
      let qtyLeft = this.getQtyLeft();

      if (!this.activationToken) {
        this.updateStatus("Waiting for Email", "blue");
        try {
          this.activationToken = (await this.getOTP("footlocker")).toString();
        } catch (e) {
          reject({ msg: "IMAP Failed" });
        }
      }

      let parsedJar;
      this.jar._jar.store.getAllCookies(function (err, cookieArray) {
        if (err) throw new Error("Failed to get cookies");
        parsedJar = JSON.stringify(cookieArray, null, 4);
      });

      this.parsedJar = parsedJar;

      try {
        this.updateStatus("Submitting Verification", "blue");

        const res = await this.request({
          url: `https://www.footlocker.com/apigate/v3/activation`,
          method: "POST",
          headers: {
            "User-Agent": "FootLocker/CFNetwork/Darwin",
            "X-API-LANG": "en-US",
            "X-API-COUNTRY": "US",
            "X-FL-APP-VERSION": "5.3.5",
            "X-FLAPI-SESSION-ID": this.getSingleCookie(parsedJar, "JSESSIONID"),
            "X-CSRF-TOKEN": this.csrf,
            Connection: "keep-alive",
            "X-FL-REQUEST-ID": "FB5A1BC8-3BD2-4DF0-B35A-08C92E807346",
            "Accept-Language": "en-US,en;q=0.9",
            "X-FLAPI-API-IDENTIFIER": "921B2b33cAfba5WWcb0bc32d5ix89c6b0f614",
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-FL-DEVICE-ID": "573DB8BB-0BB9-40C7-BE49-6B119AAAC4CF",
            "X-API-KEY": "m38t5V0ZmfTsRpKIiQlszub1Tx4FbnGG",
            "Accept-Encoding": "gzip, deflate, br",
          },
          json: {
            activationToken: decodeURIComponent(this.activationToken),
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 5000,
        });

        if ([200, 201].includes(res.statusCode)) {
          if (this.task.generatePoints) {
            resolve("login");
          } else {
            this.updateStatus("Account Created!", "green", --qtyLeft, true);
            this.displaySuccess();
            await this.sleep(800);

            resolve("initialize");
          }
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        console.log(e);
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async login() {
    return new Promise(async (resolve, reject) => {
      try {
        this.updateStatus("Logging In", "blue");

        let parsedJar;
        this.jar._jar.store.getAllCookies(function (err, cookieArray) {
          if (err) throw new Error("Failed to get cookies");
          parsedJar = JSON.stringify(cookieArray, null, 4);
        });

        this.parsedJar = parsedJar;

        const res = await this.request({
          url: `https://www.footlocker.com/apigate/v3/auth`,
          method: "POST",
          headers: {
            accept: "application/json",
            "accept-encoding": "identity",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "isx-dhdh": "1",
            "cache-control": "no-cache",
            "user-agent": this.userAgent,
            "x-csrf-token": this.csrf,
            "x-fl-request-id": this.uuid(),
            "x-flapi-session-id": this.getSingleCookie(parsedJar, "JSESSIONID"),
          },
          json: {
            uid: this.identity.email,
            password: this.identity.password,
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 10000,
        });

        if ([200, 201].includes(res.statusCode)) {
          resolve("getSession2");
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Login Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async getSession2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Session (2)", "blue");

      try {
        const res = await this.request({
          url: `https://www.footlocker.com/apigate/v3/session`,
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-FL-APP-VERSION": "5.3.5",
            "X-FLAPI-API-IDENTIFIER": "921B2b33cAfba5WWcb0bc32d5ix89c6b0f614",
            "X-FL-DEVICE-ID": "573DB8BB-0BB9-40C7-BE49-6B119AAAC4CF",
            "Accept-Language": "en-US,en;q=0.9",
            "X-API-KEY": "m38t5V0ZmfTsRpKIiQlszub1Tx4FbnGG",
            "Accept-Encoding": "identity",
            "User-Agent": "FootLocker/CFNetwork/Darwin",
            "X-API-COUNTRY": "US",
            Connection: "keep-alive",
            "X-API-LANG": "en-US",
            "X-NewRelic-ID": "VgAPVVdRDRAIVldUBQQEUFY=",
            "X-FL-REQUEST-ID": "8C6C4319-5313-426C-A1EB-9E5D4164BD5C",
          },
          jar: this.jar,
          timeout: 3000,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          this.csrf = JSON.parse(res.body).data.csrfToken;
          if (this.csrf) {
            resolve("getConfig");
          } else {
            throw `Step Requirements Failed`;
          }
        }
      } catch (e) {
        reject({ msg: "Error Getting Session (2)" });
      }
    });
  }

  async getConfig() {
    return new Promise(async (resolve, reject) => {
      try {
        this.updateStatus("Getting Config", "blue");

        let parsedJar;
        this.jar._jar.store.getAllCookies(function (err, cookieArray) {
          if (err) throw new Error("Failed to get cookies");
          parsedJar = JSON.stringify(cookieArray, null, 4);
        });

        this.parsedJar = parsedJar;

        const res = await this.request({
          url: "https://www.footlocker.com/api/content/crowdtwist-config.details.json",
          method: "GET",
          headers: {
            accept: "application/json",
            "accept-encoding": "identity",
            "user-agent": this.userAgent,
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 10000,
        });

        if ([200, 201, 202, 203, 204].includes(res.statusCode)) {
          resolve("getLoginUrl");
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async getLoginUrl() {
    return new Promise(async (resolve, reject) => {
      try {
        this.updateStatus("Getting FLX Info", "blue");

        let parsedJar;
        this.jar._jar.store.getAllCookies(function (err, cookieArray) {
          if (err) throw new Error("Failed to get cookies");
          parsedJar = JSON.stringify(cookieArray, null, 4);
        });

        this.parsedJar = parsedJar;

        const res = await this.request({
          url: "https://www.footlocker.com/apigate/v3/ctloginurl",
          method: "GET",
          headers: {
            "User-Agent": "FootLocker/CFNetwork/Darwin",
            "X-API-LANG": "en-US",
            "X-API-COUNTRY": "US",
            "X-FL-APP-VERSION": "5.3.5",
            "X-FLAPI-SESSION-ID": this.getSingleCookie(parsedJar, "JSESSIONID"),
            "X-CSRF-TOKEN": this.csrf,
            Connection: "keep-alive",
            "X-FL-REQUEST-ID": "FB5A1BC8-3BD2-4DF0-B35A-08C92E807346",
            "Accept-Language": "en-US,en;q=0.9",
            "X-FLAPI-API-IDENTIFIER": "921B2b33cAfba5WWcb0bc32d5ix89c6b0f614",
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-FL-DEVICE-ID": "573DB8BB-0BB9-40C7-BE49-6B119AAAC4CF",
            "X-API-KEY": "m38t5V0ZmfTsRpKIiQlszub1Tx4FbnGG",
            "Accept-Encoding": "gzip, deflate, br",
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 10000,
        });

        if ([200, 201, 202, 203, 204].includes(res.statusCode)) {
          resolve("getLoginUrl");
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async generatePoints1() {
    return new Promise(async (resolve, reject) => {
      try {
        this.updateStatus("Generating Points (1)", "blue");

        let parsedJar;
        this.jar._jar.store.getAllCookies(function (err, cookieArray) {
          if (err) throw new Error("Failed to get cookies");
          parsedJar = JSON.stringify(cookieArray, null, 4);
        });

        this.parsedJar = parsedJar;

        const res = await this.request({
          url: `https://www.footlocker.com/api/v3/users/preferences?timestamp=${Date.now()}`,
          method: "PUT",
          headers: {
            accept: "application/json",
            "accept-encoding": "identity",
            "user-agent": this.userAgent,
            "x-csrf-token": this.csrf,
            "x-fl-request-id": this.uuid(),
            "x-flapi-session-id": this.getSingleCookie(parsedJar, "JSESSIONID"),
          },
          json: {
            id: "FLX_SHOE_SIZE",
            values: ["10.5_Mens"],
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 10000,
        });

        if ([200, 201, 202, 203, 204].includes(res.statusCode)) {
          resolve("generatePoints2");
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async generatePoints2() {
    return new Promise(async (resolve, reject) => {
      try {
        this.updateStatus("Generating Points (2)", "blue");

        let parsedJar;
        this.jar._jar.store.getAllCookies(function (err, cookieArray) {
          if (err) throw new Error("Failed to get cookies");
          parsedJar = JSON.stringify(cookieArray, null, 4);
        });

        this.parsedJar = parsedJar;

        const res = await this.request({
          url: `https://www.footlocker.com/api/v3/users/preferences?timestamp=${Date.now()}`,
          method: "PUT",
          headers: {
            accept: "application/json",
            "accept-encoding": "identity",
            "user-agent": this.userAgent,
            "x-csrf-token": this.csrf,
            "x-fl-request-id": this.uuid(),
            "x-flapi-session-id": this.getSingleCookie(parsedJar, "JSESSIONID"),
          },
          json: {
            id: "FLX_SHOP_FOR",
            values: ["Men"],
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 10000,
        });

        if ([200, 201, 202, 203, 204].includes(res.statusCode)) {
          resolve("generatePoints3");
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async generatePoints3() {
    return new Promise(async (resolve, reject) => {
      try {
        this.updateStatus("Generating Points (3)", "blue");

        let parsedJar;
        this.jar._jar.store.getAllCookies(function (err, cookieArray) {
          if (err) throw new Error("Failed to get cookies");
          parsedJar = JSON.stringify(cookieArray, null, 4);
        });

        this.parsedJar = parsedJar;

        const res = await this.request({
          url: `https://www.footlocker.com/api/v3/users/preferences?timestamp=${Date.now()}`,
          method: "PUT",
          headers: {
            accept: "application/json",
            "accept-encoding": "identity",
            "user-agent": this.userAgent,
            "x-csrf-token": this.csrf,
            "x-fl-request-id": this.uuid(),
            "x-flapi-session-id": this.getSingleCookie(parsedJar, "JSESSIONID"),
          },
          json: {
            id: "FLX_SHIRT_SIZE",
            values: ["L_Mens"],
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 10000,
        });

        if ([200, 201, 202, 203, 204].includes(res.statusCode)) {
          resolve("generatePoints4");
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async generatePoints4() {
    return new Promise(async (resolve, reject) => {
      try {
        this.updateStatus("Generating Points (4)", "blue");

        let qtyLeft = this.getQtyLeft();

        let parsedJar;
        this.jar._jar.store.getAllCookies(function (err, cookieArray) {
          if (err) throw new Error("Failed to get cookies");
          parsedJar = JSON.stringify(cookieArray, null, 4);
        });

        this.parsedJar = parsedJar;

        const res = await this.request({
          url: `https://www.footlocker.com/api/v3/users/preferences?timestamp=${Date.now()}`,
          method: "PUT",
          headers: {
            accept: "application/json",
            "accept-encoding": "identity",
            "user-agent": this.userAgent,
            "x-csrf-token": this.csrf,
            "x-fl-request-id": this.uuid(),
            "x-flapi-session-id": this.getSingleCookie(parsedJar, "JSESSIONID"),
          },
          json: {
            id: "FLX_PANT_SIZE",
            values: ["L_Mens"],
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 10000,
        });

        if ([200, 201, 202, 203, 204].includes(res.statusCode)) {
          this.updateStatus("Account Created!", "green", --qtyLeft, true);
          await this.displaySuccess();
          await this.sleep(800);

          resolve("initialize");
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        switch (e.statusCode) {
          case 403:
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          case 429:
            this.updateStatus("Rate Limited", "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
          default:
            this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
            break;
        }
      }
    });
  }

  async generatePoints5() {
    return new Promise(async (resolve, reject) => {
      try {
        this.updateStatus("Generating Points (5)", "blue");

        let qtyLeft = this.getQtyLeft();

        let parsedJar;
        this.jar._jar.store.getAllCookies(function (err, cookieArray) {
          if (err) throw new Error("Failed to get cookies");
          parsedJar = JSON.stringify(cookieArray, null, 4);
        });

        this.parsedJar = parsedJar;

        const res = await this.request({
          url: `https://www.footlocker.com/questionnaire/rpc`,
          method: "POST",
          headers: {
            accept: "application/json",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "sec-ch-ua":
              '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": this.userAgent,
            referer: "https://www.footlocker.com/widgets/t/poll/18390/",
          },
          json: {
            ct_rpc_action: "questionnaire_submit",
            answers: { 1: { selected_answers: ["1"], response_text: null } },
            questionnaire_id: this.csrf,
            questionnaire_type: "poll",
          },
          jar: this.jar,
          followAllRedirects: true,
          timeout: 10000,
        });

        if (
          [200, 201, 202, 203, 204, 301, 302, 303, 304].includes(res.statusCode)
        ) {
        } else {
          throw `Step Requirements Not Met`;
        }
      } catch (e) {
        if (e?.response?.body) {
          if (e.response.body.includes("captcha")) {
            this.updateStatus("Blocked by Captcha", "red");
            await this.sleep(3000);

            resolve("initialize");
          }
          if (e?.statusCode) {
            switch (e.statusCode) {
              case 403:
                this.updateStatus("Blocked by Captcha", "red");
                await this.sleep(3000);
                resolve("initialize");
                break;
              case 429:
                this.updateStatus("Rate Limited", "red");
                await this.sleep(3000);
                resolve("initialize");
                break;
              default:
                this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
                await this.sleep(3000);
                resolve("initialize");
                break;
            }
          } else {
            this.updateStatus(`Generating Failed ${e.statusCode}`, "red");
            await this.sleep(3000);
            resolve("initialize");
          }
        }
      }
    });
  }

  async displaySuccess() {
    if (this.task.accGroup) {
      this.addToGroup("flx", this.task.accGroup, {
        email: this.identity.email,
        password: this.identity.password,
      });
    }

    this.updateDashCreate(
      "New account created",
      "FLX",
      this.identity.email,
      this.identity.password,
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
          title: "Created FLX account",
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
            url: "https://cdn.discordapp.com/attachments/901342456551993385/924705214173438003/footlocker.png",
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
