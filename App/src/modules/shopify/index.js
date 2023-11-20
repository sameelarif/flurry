import Functionality from "../../tasks/Functionality";

import request from "request-promise";

export default class extends Functionality {
  constructor(task, id) {
    super(task, id);

    this.setRunning(true);

    if (!this.invalidTask) this.flow();
  }

  initialize() {
    this.getIdentity();
    this.getUserAgent();
    this.parseDomainName(this.task.url);

    this.jar = request.jar();

    this.request = request.defaults({
      followAllRedirects: true,
      resolveWithFullResponse: true,
      proxy: this.task.useProxies
        ? this.getProxy(this.task.proxyGroup)
        : undefined,
      withCredentials: true,
      strictSSL: false,
    });
  }

  async flow() {
    while (this.getQtyLeft() > 0 && this.checkStop()) {
      let getPageState;
      while (!getPageState && this.getQtyLeft() > 0) {
        if (!this.checkStop()) {
          break;
        } else {
          this.initialize();
        }
        if (!this.checkStop()) {
          break;
        } else {
          getPageState = await this.getPage();
        }
      }

      let createAccountState;
      while (!createAccountState && this.getQtyLeft() > 0) {
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

  async getPage() {
    this.updateStatus("Getting Signup Page", "blue");

    try {
      const res = await this.request.get({
        url: `https://${this.task.url}/account/register`,
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9s",
          "accept-encoding": "identity",
          "user-agent": this.userAgent,
        },
      });

      if (res.statusCode == 200) {
        this.recaptchaSitekey = res.body.split('siteKey:"')[1].split('"')[0];
        console.log(this.recaptchaSitekey);

        return true;
      }
    } catch (error) {
      console.log(error);
      this.updateStatus("Creation Failed", "red");
      await this.displayFail();
      await this.sleep(3000);

      return false;
    }
  }

  async createAccount() {
    let qtyLeft = this.getQtyLeft();

    this.updateStatus("Solving V3 Captcha", "blue");

    this.captchaInstance = new this.captcha({
      provider: this.task.captchaProvider,
      retries: 100,
    });

    this.captchaToken = await this.captchaInstance.solve(
      this.id,
      "recaptchathree",
      {
        sitekey: this.recaptchaSitekey,
        action: "verify",
        URL: `https://${this.task.url}/account/register`,
      },
    );

    this.updateStatus("Creating Account", "blue");

    try {
      const res = await this.request.post({
        url: `http://${this.task.url}/account`,
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9s",
          "accept-encoding": "identity",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": this.userAgent,
        },
        form: {
          form_type: "create_customer",
          utf8: "✓",
          "customer[first_name]": this.identity.firstName,
          "customer[last_name]": this.identity.lastName,
          "customer[email]": this.identity.email,
          "customer[password]": this.identity.password,
          "recaptcha-v3-token": this.captchaToken,
        },
      });

      if (res.statusCode == 200) {
        this.updateStatus("Account Created!", "green", --qtyLeft, true);

        await this.displaySuccess();
        await this.sleep(1500);

        return true;
      }
    } catch (error) {
      console.log(error);
      this.updateStatus("Creation Failed", "red");
      await this.displayFail();
      await this.sleep(3000);

      return false;
    }
  }

  async displaySuccess() {
    this.addToGroup("shopify", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      this.siteName,
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
          title: `Created ${this.siteName} account`,
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
            url: "https://cdn.discordapp.com/attachments/901342456551993385/924704602769752084/shopifyicon.png",
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
