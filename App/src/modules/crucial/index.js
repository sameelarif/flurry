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
          url: "https://shop.crucial.com/DRHM/store",
          method: "POST",
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "max-age=0",
            Connection: "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://shop.crucial.com",
            Referer:
              "https://shop.crucial.com/store/crucial/DisplayCreateAccountPage?Locale=en_US",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "user-agent": this.userAgent,
          },
          form: {
            SiteID: "crucial",
            Locale: "en_US",
            ThemeID: "4922169100",
            Form: "com.digitalriver.template.form.CreateLoginForm",
            CallingPageID: "CreateAccountPage",
            CSRFAuthKey: "",
            Env: "BASE",
            ORIG_VALUE_activate: "off",
            activate: "on",
            isRapidCheckoutFromCart: "false",
            isPayPalPaymentMethodSelected: "false",
            action: "DisplayCreateAccountSuccessPage",
            ORIG_VALUE_firstName: "",
            firstName: this.identity.firstName,
            ORIG_VALUE_lastName: "",
            lastName: this.identity.lastName,
            BILLINGcompanyName: "absdscsk",
            ORIG_VALUE_email: "",
            email: this.identity.email,
            ORIG_VALUE_password: "",
            password: this.identity.password,
            ORIG_VALUE_confirmPassword: "",
            confirmPassword: this.identity.password,
            customerType: "040",
            ORIG_VALUE_optIn: "off",
            optIn: this.task.receiveEmailsFromSite ? "on" : "off",
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          this.updateStatus("Account Created!", "green", --qtyLeft, true);
          await this.displaySuccess();
          await this.sleep(800);

          resolve("initialize");
        } else {
          throw `Error Creating Account`;
        }
      } catch (e) {
        await this.displayFail();

        reject({ msg: "Creation Failed" });
      }
    });
  }

  async displaySuccess() {
    this.addToGroup("crucial", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "Crucial",
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
          title: "Created Crucial account",
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
            url: "https://cdn.discordapp.com/attachments/901342456551993385/924706780506886174/crucial.png",
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
