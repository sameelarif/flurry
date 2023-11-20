import Functionality from "../../tasks/Functionality";

import encryption from "./encryption";
import faker from "faker";
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
      this.getUserAgent();

      this.jar = new tough.CookieJar();

      this.proxy = this.task.useProxies
        ? this.getProxyObj(this.task.proxyGroup)
        : undefined;

      this.proxyString = this.task.useProxies
        ? this.proxyObjToFormatted(this.proxy)
        : null;

      this.session = new this.client({
        jar: this.jar,
        proxy: this.proxy,
      });

      resolve("getSession");
    });
  }

  async getSession() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Session", "blue");

      try {
        const res = await this.session._request({
          url: "https://www.bestbuy.com/identity/global/signin",
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

        if (res.statusCode > 199 && res.statusCode < 299) {
          this.LoginToken = res.body.toString().match(/":"tid%([\s\S]*?)"/)[1];
          this.AlphaTokensArray = res.body
            .toString()
            .match(/"alpha":([\s\S]*?)]/)[1];
          this.AlphaTokensArray = this.AlphaTokensArray.replace("[", "")
            .replace(/"/g, "")
            .split(",");

          resolve("getToken");
        }
      } catch (e) {
        reject({ msg: "Error Getting Session" });
      }
    });
  }

  async getToken() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Tokens", "blue");

      try {
        const res = await this.session._request({
          url: `https://www.bestbuy.com/identity/newAccount?token=tid%${this.LoginToken}`,
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
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            Referer: `https://www.bestbuy.com/identity/signin?token=tid%${this.LoginToken}`,
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          this.emailFieldName = res.body
            .toString()
            .match(/"emailFieldName":"([\s\S]*?)"/)[1];
          this.PasswordHash = res.body
            .toString()
            .match(/"hash":"([\s\S]*?)"/)[1];
          this.reenterHash = res.body
            .toString()
            .match(/"reenterHash":"([\s\S]*?)"/)[1];
          this.Roe = res.body.toString().match(/"Roe":"([\s\S]*?)"/)[1];

          resolve("createAccount");
        }
      } catch (e) {
        reject({ msg: "Error Getting Token" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");
      let qtyLeft = this.getQtyLeft();

      try {
        let postData = {
          firstName: this.identity.firstName,
          lastName: this.identity.lastName,
          phone: faker.phone.phoneNumberFormat().replace(/-/g, ""),
          token: `tid%${this.LoginToken}`,
          memberId: "",
          isRecoveryPhone: false,
          addressLine1: null,
          addressLine2: null,
          city: null,
          state: null,
          zip: null,
          businessName: null,
          businessPhone: null,
          alpha: await encryption.DecryptingAlphaArray(this.AlphaTokensArray),
          Roe: this.Roe,
        };

        postData[this.emailFieldName] = this.identity.email;
        postData[this.PasswordHash] = this.identity.password;
        postData[this.reenterHash] = this.identity.password;

        const res = await this.session._request({
          url: `https://www.bestbuy.com/identity/createAccount`,
          method: "POST",
          headers: {
            Connection: "keep-alive",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "x-grid-b": `{"gCV":"Apple","gCN":"Apple M1","aB":"101.45647822605588","sR":"2880, 1800","sL":"en-US","sF":"d31f160e1d14d2f5a71e8af478b37423113d25f3","sFC":81,"sT":"GMT-0700 (Mountain Standard Time)"}`,
            "sec-ch-ua-mobile": "?0",
            "User-Agent": this.userAgent,
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-grid":
              "1:cia-grid-v1:OlX0Jm0Y29XkdPbNGagabDhXxdgRYqZN7thf3/7UVU8J/U8b3voqbEMEAfYZbMKzwQ67UF/WfCrtXzzIshxA/IO+9BOA5a4iRF+xpbCjhnjhEPtHwk5fXhURuatJ1/VsF87XjowykUXy3djaCsHqbhGV+q/9Nc1qH2JQtwlGNV8p79CH9MWqioEPkr8VWUYglZe6vxnOQIkvEP/l+8C9CcaGPDZer5xPlhg6BLYTCl1BJzrUTny6PihmjjXO0sOlyrfjFpwy8KF4HpFZaHiXEKtaKgcQshASF+9YZN2oPwQPk0Z08kE0ILFk3FdVvxbjDZ5ZH8970eIbQurJ4ueGjEZ6BFcbbVcCcYY9FdCG0qLZxIMGdIl2QTEjPwCkV90J8kjLXAqDIlNrrkSGxXtkVSAMubOYL4nYl/A7OXh8QQD0RVaF0bZR4XUH2TzsYIShpnEA20xKD/CBdr7m2RUBD36B8H2xAlcA9UGhHtuoDqQaYFr/amiMCYfZmYxweIEs49hsl/hinx3o+P+nA1+E6LwwQIoPTXCmwNE4axZWc7RLrc0Bf6fCooomf3k/oDeb7xGibVMT6j63LpLg+g3t7V10ihVTPatSjoQVteGeNrudquRt5oWRDpnOlxu+qFxnr1i2RHPvnpFQb9gmGQ4i9i9CWQATa/D/3bkqyQGGKJ0=",
            "sec-ch-ua-platform": '"Windows"',
            Origin: "https://www.bestbuy.com",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: `https://www.bestbuy.com/identity/newAccount?token=tid%${this.LoginToken}`,
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
          body: JSON.stringify(postData),
          timeout: 10000,
          excludeCookies: ["ZPLANK"],
          addToCookieString: "ZPLANK=+; ",
        });

        if (
          res.statusCode > 199 &&
          res.statusCode < 303 &&
          JSON.parse(res.body).status !== "failure"
        ) {
          this.updateStatus("Account Created!", "green", --qtyLeft, true);

          await this.displaySuccess();
          await this.sleep(800);

          resolve("initialize");
        } else {
          this.updateStatus("Proxy Blocked", "red");
          await this.sleep(3000);
          resolve("initialize");
        }
      } catch (error) {
        await this.displayFail();
        await this.sleep(3000);

        reject({ msg: "Creation Failed" });
      }
    });
  }

  async displaySuccess() {
    this.addToGroup("bestbuy", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "BestBuy",
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
          title: "Created BestBuy account",
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
            {
              name: "Proxy",
              value: `||${this.proxyString || "localhost"}||`,
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
            url: "https://media.discordapp.net/attachments/901342456551993385/907635982994645032/bestbuy.png",
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
