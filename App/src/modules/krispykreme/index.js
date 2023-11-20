import Functionality from "../../tasks/Functionality";

import request from "request-promise";
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

  async initialize() {
    return new Promise(async (resolve, reject) => {
      this.getIdentity();

      this.jar = new tough.CookieJar();

      this.request = request.defaults({
        proxy: this.task.useProxies
          ? this.getProxy(this.task.proxyGroup)
          : undefined,
        withCredentials: true,
        strictSSL: false,
        resolveWithFullResponse: true,
        followAllRedirects: true,
      });

      resolve("getSession");
    });
  }

  async getSession() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Session", "blue");

      try {
        const res = await this.request({
          url: "https://www.krispykreme.com",
          method: "GET",
          headers: {
            Connection: "keep-alive",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": this.userAgent,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          resolve("parseRegisterValues");
        }
      } catch (e) {
        reject({ msg: "Error Getting Session" });
      }
    });
  }

  async parseRegisterValues() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Collecting Data", "blue");

      try {
        const res = await this.request({
          url: `https://www.krispykreme.com/account/create-account`,
          method: "GET",
          headers: {
            Connection: "keep-alive",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": this.userAgent,
            Accept: "*/*",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            referer: "https://www.krispykreme.com/account/create-account",
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          const $ = cheerio.load(res.body);
          this.csrfToken = $(`input[name="__CMSCsrfToken"]`).attr("value");
          this.viewState = $(`input[name="__VIEWSTATE"]`).attr("value");
          this.viewStateGenerator = $(
            `input[name="__VIEWSTATEGENERATOR"]`,
          ).attr("value");
          this.eventValidation = $(`input[name="__EVENTVALIDATION"]`).attr(
            "value",
          );
          resolve("createAccount");
        }
      } catch (e) {
        await this.displayFail();
        await this.sleep(3000);

        reject({ msg: "Creation Failed" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Solving V3 Captcha", "blue");
      this.captchaInstance = new this.captcha({
        provider: this.task.captchaProvider,
        retries: 100,
      });

      this.captchaToken = await this.captchaInstance.solve(
        this.id,
        "recaptchathree",
        {
          sitekey: "6Lc4iwIaAAAAAHpijD7fQ_rJIdWZtvpodAsPt8AA",
          action: "verify",
          URL: `https://www.krispykreme.com/account/create-account`,
        },
      );

      if (!this.captchaToken) {
        this.updateStatus("Error solving captcha", "red");

        await this.sleep(3000);
        resolve("createAccount");
      }

      this.updateStatus("Creating Account", "blue");
      var newDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      try {
        let postData = {
          __CMSCsrfToken: this.csrfToken,
          __EVENTTARGET: "",
          __EVENTARGUMENT: "",
          __VIEWSTATE: this.viewState,
          lng: "en-US",
          __VIEWSTATEGENERATOR: this.viewStateGenerator,
          __EVENTVALIDATION: this.eventValidation,
          ctl00$plcMain$txtFirstName: this.identity.firstName,
          ctl00$plcMain$txtLastName: this.identity.lastName,
          ctl00$plcMain$ddlBirthdayMM: newDate.getMonth(),
          ctl00$plcMain$ddlBirthdayDD: newDate.getDate(),
          ctl00$plcMain$txtZipCode: this.identity.zipCode,
          ctl00$plcMain$ucPhoneNumber$txt1st:
            this.identity.phoneNumber.substring(0, 3),
          ctl00$plcMain$ucPhoneNumber$txt2nd:
            this.identity.phoneNumber.substring(3, 6),
          ctl00$plcMain$ucPhoneNumber$txt3rd:
            this.identity.phoneNumber.substring(6, 10),
          ctl00$plcMain$txtEmail: this.identity.email,
          ctl00$plcMain$txtPassword: this.identity.password,
          "g-recaptcha-response": this.captchaToken,
          ctl00$plcMain$cbTermsOfUse: "on",
        };

        const res = await this.request({
          url: `https://www.krispykreme.com/account/create-account`,
          method: "POST",
          form: postData,

          headers: {
            Connection: "keep-alive",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Upgrade-Insecure-Requests": "1",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            Referer: `https://www.krispykreme.com/account/create-account`,
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
          transform: function (body, response, resolveWithFullResponse) {
            return {
              headers: response.headers,
              data: body,
              finalUrl: response.request.uri.href, // contains final URL
            };
          },
        });

        if (res.statusCode == 200) {
          if (res.finalUrl == "https://www.krispykreme.com/home") {
            await this.displaySuccess();
            await this.sleep(800);

            resolve("initialize");
          } else {
            this.updateStatus("Proxy Blocked", "red");
            await this.sleep(3000);
            resolve("initialize");
          }
        }
      } catch (e) {
        await this.displayFail();
        await this.sleep(3000);

        reject({ msg: "Creation Failed" });
      }
    });
  }

  async displaySuccess() {
    this.addToGroup("krispykreme", this.task.accGroup, {
      email: this.identity.email,
    });

    this.updateDashCreate(
      "New account created",
      "Krispy Kreme",
      this.identity.email,
    );

    await this.webhook({
      content: null,
      embeds: [
        {
          title: "Created Krispy Kreme account",
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
            {
              name: "Proxy",
              value: `||${this.identity.password || "localhost"}||`,
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
            url: "https://cdn.discordapp.com/attachments/935971708890931230/939333090508148786/unknown.png",
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
