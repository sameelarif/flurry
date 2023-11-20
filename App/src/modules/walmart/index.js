import Functionality from "../../tasks/Functionality";

import tough from "tough-cookie";

export default class extends Functionality {
  constructor(task, id) {
    super(task, id);

    this.setRunning(true);

    if (!this.invalidTask) this.flow();
  }

  initialize() {
    this.getIdentity();
    this.getUserAgent();

    this.jar = new tough.CookieJar();

    this.request = new this.client({
      browser: Math.random() < 0.8 ? "chrome" : "firefox",
      jar: this.jar,
      proxy: this.task.useProxies
        ? this.getProxyObj(this.task.proxyGroup)
        : undefined,
    });
  }

  async flow() {
    while (this.getQtyLeft() > 0 && this.checkStop()) {
      let createAccountState;
      while (!createAccountState && this.getQtyLeft() > 0) {
        if (!this.checkStop()) {
          break;
        } else {
          this.initialize();
        }
        if (!this.checkStop()) {
          break;
        } else {
          createAccountState = await this.createAccount();
        }
      }
    }

    if (!this.checkStop()) {
      this.stopTask();
    } else {
      this.completeTask(this.task.quantity);
    }
  }

  async createAccount() {
    let qtyLeft = this.getQtyLeft();

    this.updateStatus("Creating account", "blue");

    try {
      let res;

      if (this.task.region == "United States") {
        res = await this.request._request(
          {
            method: "POST",
            url: "https://www.walmart.com/account/electrode/api/signup",
            headers: {
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "en-US,en;q=0.9",
              "Content-Type": "application/json",
              Origin: "https://www.walmart.com",
              Referer: "https://www.walmart.com/account/signup",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin",
              "Sec-GPC": "1",
              "User-Agent": this.userAgent,
            },
            body: JSON.stringify({
              personName: {
                firstName: this.identity.firstName,
                lastName: this.identity.lastName,
              },
              email: this.identity.email,
              password: this.identity.password,
              rememberme: true,
              showRememberme: "true",
              emailNotificationAccepted: this.task.receiveEmailFromSite,
              captcha: {
                sensorData: "",
              },
            }),
          },
          this.callback,
        );
      } else {
        res = await this.request._request(
          {
            method: "POST",
            url: "https://www.walmart.ca/api/auth-page/register",
            headers: {
              Accept: "application/json",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "en-US,en;q=0.9",
              "Content-Type": "application/json",
              Origin: "https://www.walmart.ca",
              Referer: "https://www.walmart.ca/create-account",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin",
              "Sec-GPC": "1",
              "User-Agent": this.userAgent,
            },
            body: JSON.stringify({
              email: this.identity.email,
              firstName: this.identity.firstName,
              languagePreference: "English",
              lastName: this.identity.lastName,
              marketingPreference: this.task.receiveEmailFromSite || false,
              password: this.identity.password,
              phoneNumber: "",
              postalCode: "L5V2N6",
              termsAndConditions: true,
            }),
          },
          this.callback,
        );
      }

      if (res.statusCode == 200) {
        this.updateStatus("Account Created!", "green", --qtyLeft, true);

        await this.displaySuccess();
        await this.sleep(1500);

        return true;
      } else if (res.statusCode == 412) {
        this.updateStatus("PX Blocked", "red");
        await this.displayFail();
        await this.sleep(3000);

        return false;
      } else {
        throw `Error Sending Account`;
      }
    } catch (error) {
      this.updateStatus("Creation Failed", "red");
      await this.displayFail();
      await this.sleep(3000);

      return false;
    }
  }

  async displaySuccess() {
    this.addToGroup("walmart", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "Walmart",
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
          title: "Created Walmart account",
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
            url: "https://media.discordapp.net/attachments/901342456551993385/907635984542363708/walmartsvg.png",
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
