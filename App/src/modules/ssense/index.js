import Functionality from "../../tasks/Functionality";

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

      resolve("createAccount");
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");

      let qtyLeft = this.getQtyLeft();

      try {
        const res = await this.session._request({
          url: "https://www.ssense.com/en-us/account/register",
          method: "POST",
          headers: {
            accept: "application/json",
            "accept-encoding": "identity",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=utf-8",
            origin: "https://www.ssense.com",
            referer: "https://www.ssense.com/en-us/account/login",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "user-agent": this.userAgent,
          },
          form: {
            email: this.identity.email,
            password: this.identity.password,
            confirmpassword: this.identity.password,
            gender: "",
            source: "SSENSE_EN_SIGNUP",
          },
          timeout: 10000,
        });

        switch (res.statusCode) {
          case 200:
            this.updateStatus("Account Created!", "green", --qtyLeft, true);
            await this.displaySuccess();
            await this.sleep(800);

            resolve("initialize");
            break;
          case 403:
            reject({ msg: "IP Blocked" });
            break;
          default:
            throw `Error Creating Account`;
        }
      } catch (e) {
        await this.displayFail();
        reject({ msg: "Error Creating Account" });
      }
    });
  }

  async displaySuccess() {
    this.addToGroup("ssense", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "SSENSE",
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
          title: "Created SSENSE account",
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
            url: "https://cdn.discordapp.com/attachments/901342456551993385/924836437529083904/ssensepng.png",
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
