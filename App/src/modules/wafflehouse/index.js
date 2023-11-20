import Functionality from "../../tasks/Functionality";
import Store from "../../store/Store";

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
          url: "https://www.wafflehouse.com/regulars-club/",
          method: "GET",
          headers: {
            Connection: "keep-alive",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Upgrade-Insecure-Requests": "1",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88 Safari/537.36",
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
          resolve("createAccount");
        }
      } catch (e) {
        reject({ msg: "Error Getting Session" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");
      var newDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      let qtyLeft = this.getQtyLeft();

      try {
        let postData = {
          fn: this.identity.firstName,
          ln: this.identity.lastName,
          em: this.identity.email,
          emcon: this.identity.email,
          bmon: 2,
          bday: newDate.getDay(),
          zip: this.task.zipCode,
          theaction: "regulars-club-two",
        };

        const res = await this.request({
          url: `https://www.wafflehouse.com/doprocess`,
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
            Referer: "https://www.wafflehouse.com/regulars-club/",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          if (res.body == "1") {
            this.updateStatus("Account Created!", "green", --qtyLeft, true);

            await this.displaySuccess();
            await this.sleep(800);

            resolve("initialize");
          } else {
            this.updateStatus("Failed to create.", "red");
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
    this.addToGroup("wafflehouse", this.task.accGroup, {
      email: this.identity.email,
    });

    this.updateDashCreate(
      "New account created",
      "WaffleHouse",
      this.identity.email,
    );

    await this.webhook({
      content: null,
      embeds: [
        {
          title: "Created WaffleHouse account",
          description: `[Open Coupon](https://regularsclub.wafflehouse.com/CouponCode.aspx?t=W&e=${this.identity.email})`,
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
            url: "https://cdn.discordapp.com/attachments/935971708890931230/939332140003385384/unknown.png",
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
