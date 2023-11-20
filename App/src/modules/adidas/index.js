import Functionality from "../../tasks/Functionality";

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

  initialize() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Initializing", "blue");
      try {
        this.getIdentity();
        this.getUserAgent();

        this.jar = request.jar();

        this.request = request.defaults({
          followAllRedirects: true,
          resolveWithFullResponse: true,
          proxy: this.task.useProxies
            ? this.getProxy(this.task.proxyGroup)
            : undefined,
          jar: this.jar,
        });

        resolve("getSignUp");
      } catch (e) {
        reject({ msg: "Error Initializing" });
      }
    });
  }

  async getSignUp() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Sign Up", "blue");

      try {
        const res = await this.request({
          url: "https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/MiAccount-Register",
          method: "GET",
          headers: {
            "accept-encoding": "gzip, deflate",
            accept: "*/*",
            connection: "keep-alive",
            origin: "https://www.adidas.com",
            "user-agent": this.userAgent,
          },
          gzip: true,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          this.infoURL = res.body.split('action="')[1].split('"')[0];
          this.secureKey = res.body
            .split('name="dwfrm_mipersonalinfo_securekey" value="')[1]
            .split('"')[0];

          resolve("setIdentity");
        } else {
          this.displayFail();
          this.updateStatus("Get Sign Up Error", "red");
          await this.sleep(3000);
          resolve("initialize");
        }
      } catch (error) {
        this.updateStatus("Get Sign Up Error", "red");
        await this.sleep(3000);
        resolve("initialize");
      }
    });
  }

  async setIdentity() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Identity (1)", "blue");

      try {
        const res = await this.request({
          url: this.infoURL,
          method: "POST",
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/x-www-form-urlencoded",
            connection: "keep-alive",
            origin: "https://www.adidas.com",
            referer:
              "https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/MiAccount-Register",
            "user-agent": this.userAgent,
          },
          form: {
            dwfrm_mipersonalinfo_firstname: this.identity.firstName,
            dwfrm_mipersonalinfo_lastname: this.identity.lastName,
            dwfrm_mipersonalinfo_customer_birthday_dayofmonth:
              this.identity.birthday.day,
            dwfrm_mipersonalinfo_customer_birthday_month:
              this.identity.birthday.month,
            dwfrm_mipersonalinfo_customer_birthday_year:
              this.identity.birthday.year,
            dwfrm_mipersonalinfo_step1: "Next",
            dwfrm_mipersonalinfo_securekey: this.secureKey,
          },
          timeout: 10000,
          gzip: true,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          this.emailURL = res.body.split('action="')[1].split('"')[0];
          this.secureKey = res.body
            .split('name="dwfrm_milogininfo_securekey" value="')[1]
            .split('"')[0];

          resolve("setEmail");
        } else {
          this.displayFail();
          this.updateStatus("Identity 1 Error", "red");
          await this.sleep(3000);
          resolve("initialize");
        }
      } catch (e) {
        this.updateStatus("Identity 1 Error", "red");
        await this.sleep(3000);
        resolve("initialize");
      }
    });
  }

  async setEmail() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Identity (2)", "blue");

      try {
        const res = await this.request({
          url: this.emailURL,
          method: "POST",
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate",
            connection: "keep-alive",
            "content-type": "application/x-www-form-urlencoded",
            origin: "https://www.adidas.com",
            referer: this.infoURL,
            "user-agent": this.userAgent,
          },
          form: {
            dwfrm_milogininfo_email: this.identity.email,
            dwfrm_milogininfo_password: this.identity.password,
            dwfrm_milogininfo_newpasswordconfirm: this.identity.password,
            dwfrm_milogininfo_step2: "Next",
            dwfrm_milogininfo_securekey: this.secureKey,
          },
          gzip: true,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          this.finalURL = res.body.split('action="')[1].split('"')[0];
          this.secureKey = res.body
            .split('name="dwfrm_micommunicinfo_securekey" value="')[1]
            .split('"')[0];

          resolve("createAccount");
        } else {
          this.displayFail();
          this.updateStatus("Identity 2 Error", "red");
          await this.sleep(3000);
          resolve("initialize");
        }
      } catch (e) {
        this.updateStatus("Identity 2 Error", "red");
        await this.sleep(3000);
        resolve("initialize");
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");

      let qtyLeft = this.getQtyLeft();

      try {
        const res = await this.request({
          url: this.finalURL,
          method: "POST",
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate",
            connection: "keep-alive",
            "content-type": "application/x-www-form-urlencoded",
            origin: "https://www.adidas.com",
            referer: this.emailURL,
            "user-agent": this.userAgent,
          },
          form: {
            dwfrm_micommunicinfo_addtoemaillist: true,
            dwfrm_micommunicinfo_agreeterms: true,
            dwfrm_micommunicinfo_step3: "Register",
            dwfrm_micommunicinfo_securekey: this.secureKey,
          },
          gzip: true,
        });

        if (res.statusCode > 199 && res.statusCode < 299) {
          this.updateStatus("Account Created!", "green", --qtyLeft, true);
          await this.displaySuccess();
          await this.sleep(800);

          resolve("initialize");
        } else {
          this.displayFail();
          this.updateStatus("Create Account Error", "red");
          await this.sleep(3000);
          resolve("initialize");
        }
      } catch (e) {
        this.updateStatus("Create Account Error", "red");
        await this.sleep(3000);
        resolve("initialize");
      }
    });
  }

  async displaySuccess() {
    this.addToGroup("adidas", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "Adidas",
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
          title: "Created Adidas account",
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
            url: "https://cdn.discordapp.com/attachments/901342456551993385/907635983909015606/adidaspng.png",
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
