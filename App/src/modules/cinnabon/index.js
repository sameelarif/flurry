import Functionality from "../../tasks/Functionality";

import cheerio from "cheerio";
import tough from "tough-cookie";
import request from "request-promise";

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
      this.updateStatus("Initializing", "blue");

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
          url: "https://www.cinnabon.com/join-club-cinnabon",
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
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          const regex =
            /src="https:\/\/x.c.cinnabon.com\/ats\/show.aspx?(.*)" style/gm;
          let matches = res.body.match(regex);

          if (matches.length > 0) {
            let url = matches[0];
            const myArray = url.split('src="');
            const newArray = myArray[1].split('" height=');
            this.parseUrl = newArray[0].replaceAll("&amp;", "&");

            resolve("parseValues");
          } else {
            reject({ msg: "Session Error" });
          }
        }
      } catch (e) {
        reject({ msg: "Session Error" });
      }
    });
  }

  async getValues() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Values", "blue");

      try {
        const res = await this.request({
          url: this.parseUrl,
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
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          const $ = cheerio.load(res.body);
          ["cr", "fm", "mg", "cn"].forEach((name) => {
            this[name] = $(`input[name="${name}"]`).attr("value");
          });

          resolve("getLocation");
        }
      } catch (e) {
        reject({ msg: "Values Error" });
      }
    });
  }

  async getLocation() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Location", "blue");

      try {
        const res = await this.request({
          url: `https://www.cinnabon.com/Location/Map/Get?brand={A019D0E8-A707-40CC-B647-F3A4670AE0AB}&ZipOrCity={${this.task.zipCode}}`,
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
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          this.storeNumber = JSON.parse(res.body).Locations[0].StoreNumber;

          resolve("createAccount");
        }
      } catch (e) {
        await this.displayFail();
        await this.sleep(3000);

        reject({ msg: "Location Error" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");

      const newDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      try {
        let postData = {
          cr: this.cr,
          fm: this.fm,
          mg: this.mg,
          cn: this.cn,
          s_email: this.identity.email,
          s_firstname: this.identity.firstName,
          s_lastname: this.identity.lastName,
          s_zipcode: this.task.zipCode,
          s_birthday: newDate,
          s_storenumber: this.storeNumber,
          s_agree: "I agree to the ",
          s_agree2: "I agree to marketing comms from Cinnabon and affiliates",
        };

        const res = await this.request({
          url: `https://x.c.cinnabon.com/ats/go.aspx`,
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
            "User-Agent": this.userAgent,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            Referer: `https://x.c.cinnabon.com/ats/show.aspx?cr=${this.cr}}&fm=${this.fm}`,
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          if (res.body.includes("Thanks for signing up.")) {
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
        this.updateStatus("Creation Error", "red");

        await this.displayFail();
        await this.sleep(3000);

        resolve("initialize");
      }
    });
  }

  async displaySuccess() {
    this.addToGroup("cinnabon", this.task.accGroup, {
      email: this.identity.email,
    });

    this.updateDashCreate(
      "New account created",
      "Cinnabon",
      this.identity.email,
    );

    await this.webhook({
      content: null,
      embeds: [
        {
          title: "Created Cinnabon account",
          color: 12773868,
          fields: [
            {
              name: "Email",
              value: `||${this.identity.email}||`,
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
            url: "https://cdn.discordapp.com/attachments/935971708890931230/939332458015490059/unknown.png",
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
