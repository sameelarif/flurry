import Functionality from "../../tasks/Functionality";

import clm from "country-locale-map";

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
      this.getUserAgent();

      // Close Existing Browser
      if (this.browser) {
        this.browser.close();
      }

      try {
        await this.createBrowser();
      } catch (e) {
        console.log(e);
        reject({ msg: "Error Initializing" });
      }

      resolve("getSignUp");
    });
  }

  async getSignUp() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Sign Up", "blue");

      const ISO = this.getIso2(this.task.region);

      try {
        try {
          // Request the Sign up Page
          this.page.goto(
            ISO == "US"
              ? "https://www.nike.com/login"
              : `https://www.nike.com/${ISO}/login`,
            {
              waitUntil: "networkidle0",
            },
          );
        } catch (e) {
          reject({ msg: "Error Getting Sign Up" });
        }

        // try {
        //   await this.page.waitForSelector('button[data-var="acceptBtn1"]', {
        //     timeout: 2000,
        //   });
        //   await this.page.click(`button[data-var="acceptBtn1"]`);
        //   await this.page.waitForTimeout(1000);
        // } catch {}

        // await this.page.waitForSelector('input[type="email"]', {
        //   timeout: 40000,
        // });

        // try {
        //   await this.page.waitForSelector(
        //     'div[class="hf-geomismatch-btn-container"]',
        //     {
        //       timeout: 1000,
        //     },
        //   );

        //   if (
        //     (await this.page.$x(
        //       'div[class="hf-geomismatch-btn-container"]',
        //     )) !== null
        //   ) {
        //     await this.page.click('div[class="hf-geomismatch-btn-container"]');
        //   }
        // } catch {}

        // await this.cursor.click('input[type="email"]');
        // await this.cursor.click('input[type="password"]');
        // await this.cursor.click('input[type="email"]');

        resolve("createAccount");
      } catch (e) {
        this.updateStatus("Error Getting Sign Up", "red");
        await this.sleep(3000);
        resolve("initialize");
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");

      await this.sleep(3000);

      let qtyLeft = this.getQtyLeft();

      this.visitorId = this.uuid();

      try {
        await this.page.setBypassCSP(true);
        this.locale = clm.getLocaleByAlpha2(this.getIso2(this.task.region));

        // await this.page.setRequestInterception(true);

        /* javascript-obfuscator:disable */
        await this.page.evaluate(
          (data) => {
            const res = fetch(
              `https://unite.nike.com/access/users/v1?appVersion=912&experienceVersion=912&uxid=com.nike.commerce.nikedotcom.web&locale=${data.locale}&backendEnvironment=identity&browser=Google%20Inc.&os=undefined&mobile=false&native=false&visit=1&visitor=${data.visitorId}&language=en&uxId=com.nike.commerce.nikedotcom.web`,
              {
                headers: {
                  accept: "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json",
                  "sec-ch-ua":
                    '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": '"Windows"',
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-site",
                },

                referrerPolicy: "strict-origin-when-cross-origin",
                body: JSON.stringify({
                  country: data.ISO,
                  emailOnly: false,
                  firstName: data.identity.firstName,
                  gender: data.identity.gender,
                  lastName: data.identity.lastName,
                  locale: data.locale,
                  password: data.identity.password,
                  receiveEmail: data.receiveEmail,
                  registrationSiteId: "nikedotcom",
                  welcomeEmailTemplate: "",
                  emailAddress: data.identity.email,
                  ssn: null,
                  username: data.identity.email,
                  account: {
                    email: data.identity.email,
                    passwordSettings: {
                      password: data.identity.password,
                      passwordConfirm: data.identity.password,
                    },
                  },
                  dateOfBirth: `${data.identity.birthday.year}-${data.identity.birthday.monthFormatted}-${data.identity.birthday.dayFormatted}`,
                }),
                method: "POST",
                mode: "cors",
                credentials: "include",
              },
            );

            return res;
          },
          {
            identity: this.identity,
            locale: this.locale,
            ISO: this.getIso2(this.task.region),
            receiveEmails: this.task.receiveEmails,
            visitorId: this.visitorId,
          },
        );
        /* javascript-obfuscator:enable */

        if (!this.task.verifyWIthPhnNum) {
          this.updateStatus("Account Created!", "green", --qtyLeft, true);
          await this.displaySuccess(false);
          await this.sleep(800);

          resolve("initialize");
        } else {
          resolve("login");
        }
      } catch (e) {
        if (e.message.toLowerCase().includes("failed to fetch")) {
          this.updateStatus("Proxy Banned", "red");
        } else {
          console.log(e);
          this.updateStatus("Error Creating Account", "red");
        }

        await this.displayFail();
        await this.sleep(3000);

        resolve("initialize");
      }
    });
  }

  async login() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Logging In", "blue");

      this.page.on("request", async (request) => {
        if (request._headers["authorization"]) {
          if (request._headers["authorization"].startsWith("Bearer")) {
            this.accessToken = request._headers["authorization"].substring(
              7,
              request._headers["authorization"].length,
            );
          }
        }
      });

      try {
        await this.cursor.click('input[type="email"]');
        await this.page.keyboard.type(this.identity.email, { delay: 30 });

        if (Math.random() > 0.5) {
          await this.cursor.click('input[type="password"]');
        } else {
          await this.page.keyboard.press("Tab");
        }

        await this.page.keyboard.type(this.identity.password, { delay: 30 });

        if (Math.random() > 0.5) {
          await this.page.keyboard.press("Enter");
        } else {
          await this.page.click(
            'div[class="nike-unite-submit-button loginSubmit nike-unite-component"]',
          );
        }

        let ISO = this.getIso2(this.task.region);
        let holdProgress = true;
        let pgurl =
          ISO == "US" ? "https://www.nike.com/" : `https://www.nike.com/${ISO}`;

        while (holdProgress) {
          await this.page.waitForTimeout(300);

          try {
            if (
              (await this.page.$(`div[class="nike-unite-error-close"]`)) !==
              null
            ) {
              this.updateStatus("Error Creating Account", "red");

              await this.displayFail();
              await this.sleep(3000);

              return resolve("initialize");
            }
          } catch {}

          try {
            if (
              (await this.page.$(
                'div[class="nike-unite-error-message errorMessage nike-unite-component"]',
              )) !== null
            ) {
              this.updateStatus("Error Creating Account", "red");

              await this.displayFail();
              await this.sleep(3000);

              return resolve("initialize");
            }
          } catch {}

          if (this.page.url() == pgurl.toLowerCase()) holdProgress = false;
        }

        resolve("getNumber");
      } catch (e) {
        this.updateStatus("Error Creating Account", "red");

        await this.displayFail();
        await this.sleep(3000);

        resolve("initialize");
      }
    });
  }

  async getNumber() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting SMS Number", "blue");

      this.smsSession = new this.sms(this.task.provider);

      try {
        await this.cursor.click(
          "#gen-nav-commerce-header-v2 > div.pre-l-header-container > header > div > div.pre-l-wrapper.mauto-sm.d-sm-flx",
        );
        await this.cursor.click(
          "#gen-nav-commerce-header-v2 > div.pre-l-header-container > header > div > div.pre-l-wrapper.mauto-sm.d-sm-flx",
        );
      } catch (e) {
        console.log(e);
      }

      try {
        this.smsNumberResponse = await this.smsSession.getNumber(
          "nike",
          this.task.phnRegion,
        );

        if (this.smsNumberResponse.status === "OK") {
          this.phoneNumber = this.smsNumberResponse.number
            .toString()
            .replace("+", "");

          resolve("setNumber");
        } else {
          this.updateStatus(`SMS ${this.smsNumberResponse.message}`, "red");
          await this.displayFail();
          await this.sleep(3000);

          resolve("initialize");
        }
      } catch (e) {
        this.smsSession.cancel();
        reject({ msg: "Error Getting SMS Number" });
      }
    });
  }

  async setNumber() {
    this.updateStatus("Submitting SMS Number", "blue");

    return new Promise(async (resolve, reject) => {
      try {
        await this.page.setBypassCSP(true);

        let fullNumber = `${this.getPhoneCode(this.task.phnRegion)}${
          this.phoneNumber
        }`;

        await this.page.evaluate(
          async (number, visitor, region, accessToken) => {
            let appVersion, experienceVersion;

            try {
              appVersion = nike.unite.version.app;
              experienceVersion = nike.unite.version.experiences;
            } catch (error) {
              appVersion = "912";
              experienceVersion = "912";
            }

            /* javascript-obfuscator:disable */
            await fetch(
              `https://unite.nike.com/sendCode?appVersion=${appVersion}&experienceVersion=${experienceVersion}&uxid=com.nike.commerce.nikedotcom.web&locale=en_US&backendEnvironment=identity&browser=Google%20Inc.&os=undefined&mobile=false&native=false&visit=1&visitor=${visitor}&phone=${number}&country=${region}`,
              {
                headers: {
                  accept: "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  authorization: `Bearer ${accessToken}`,
                  "content-type": "application/json",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-site",
                  "sec-gpc": "1",
                },
                referrer: "https://www.nike.com/",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: "{}",
                method: "POST",
                mode: "cors",
                credentials: "include",
              },
            );
          },
          fullNumber,
          this.visitorId,
          this.getIso2(this.task.region),
          this.accessToken,
        );
        /* javascript-obfuscator:enable */

        resolve("getCode");
      } catch (error) {
        console.log(error);
        this.updateStatus("Error Submitting Number", "red");
        await this.displayFail();
        await this.sleep(3000);

        resolve("initialize");
      }
    });
  }

  async getCode() {
    this.updateStatus("Getting SMS Code", "blue");
    return new Promise(async (resolve, reject) => {
      try {
        this.codeResponse = await this.smsSession.getCode();

        if (this.codeResponse.status === "OK") {
          resolve("setCode");
        } else {
          this.smsSession.cancel();
          this.updateStatus(`No Code Received`, "red");
          // Still output if not verified
          await this.displayFail();
          await this.sleep(3000);

          resolve("initialize");
        }
      } catch (e) {
        this.updateStatus("Error Getting Code", "red");
        await this.sleep(3000);
        this.smsSession.cancel();
        resolve("initialize");
      }
    });
  }

  async setCode() {
    this.updateStatus("Submitting SMS Code", "blue");
    return new Promise(async (resolve, reject) => {
      let qtyLeft = this.getQtyLeft();

      try {
        await this.page.evaluate(
          async (code, visitor, accessToken) => {
            let appVersion, experienceVersion;

            try {
              appVersion = nike.unite.version.app;
              experienceVersion = nike.unite.version.experiences;
            } catch (error) {
              appVersion = "912";
              experienceVersion = "912";
            }

            /* javascript-obfuscator:disable */
            await fetch(
              `https://unite.nike.com/verifyCode?appVersion=${appVersion}&experienceVersion=${experienceVersion}&uxid=com.nike.commerce.nikedotcom.web&locale=en_US&backendEnvironment=identity&browser=Google%20Inc.&os=undefined&mobile=false&native=false&visit=1&visitor=${visitor}&code=${code.code}`,
              {
                headers: {
                  accept: "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  authorization: `Bearer ${accessToken}`,
                  "content-type": "application/json",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-site",
                  "sec-gpc": "1",
                },
                referrer: "https://www.nike.com/",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: "{}",
                method: "POST",
                mode: "cors",
                credentials: "include",
              },
            );
          },
          this.codeResponse.code,
          this.visitorId,
          this.accessToken,
        );
        /* javascript-obfuscator:enable */

        this.smsSession.finalize();

        this.updateStatus("Account Created!", "green", --qtyLeft, true);

        await this.browser.close();

        await this.displaySuccess(true);
        await this.sleep(800);

        resolve("initialize");
      } catch (e) {
        this.updateStatus("Error Submitting Code", "red");
        this.smsSession.cancel();
        await this.displayFail();
        await this.sleep(3000);

        resolve("initialize");
      }
    });
  }

  async displaySuccess(usedSMS = false) {
    this.addToGroup("nike", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "Nike",
      this.identity.email,
      this.identity.password,
      usedSMS,
    );

    if (
      this.task.customEmails &&
      this.checkEmailGroupLength(this.task.emailGroup) > 0
    ) {
      this.deleteUsedCustomEmail(this.task.emailGroup, this.identity.email);
    }

    this.webhook({
      content: null,
      embeds: [
        {
          title: "Created Nike account",
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
              name: "Phone Number",
              value: this.phoneNumber ? `||${this.phoneNumber}||` : "None",
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
            url: "https://media.discordapp.net/attachments/901342456551993385/907635984848527380/fdennike.png",
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
