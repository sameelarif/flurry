import Functionality from "../../tasks/Functionality";

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

      await this.createBrowser();

      resolve("getSignupPage");
    });
  }

  async getSignupPage() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Sign Up", "blue");

      try {
        await this.page.goto(
          "https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp",
        );

        await this.page.click("#firstName", { timeout: 10000 });

        resolve("submitIdentity");
      } catch (error) {
        this.updateStatus("Get Sign Up Error", "red");
        await this.sleep(3000);
        resolve("initialize");
      }
    });
  }

  async submitIdentity() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Identity", "blue");

      try {
        await this.page.type("#firstName", this.identity.firstName);
        await this.page.type("#lastName", this.identity.lastName);

        let emailPrefix = this.getEmailPrefix();
        await this.page.type("#username", emailPrefix);

        this.identity.email = emailPrefix + "@gmail.com";

        await this.page.type('input[name="Passwd"]', this.identity.password);
        await this.page.type(
          'input[name="ConfirmPasswd"]',
          this.identity.password,
        );

        await this.page.click("#accountDetailsNext > div > button");

        await this.page.waitForSelector("#countryList", { timeout: 10000 });

        resolve("getNumber");
      } catch (e) {
        this.updateStatus("Error Submitting Identity", "red");
        await this.sleep(3000);
        resolve("initialize");
      }
    });
  }

  async getNumber() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting SMS Number", "blue");

      try {
        this.smsInstance = new this.sms(this.task.provider);

        this.smsNumberResponse = await this.smsInstance.getNumber(
          "google",
          this.task.phnRegion,
        );

        if (this.smsNumberResponse?.number) {
          this.smsNumber = this.smsNumberResponse.number.toString();
          resolve("submitNumber");
        } else {
          throw "Step Requirements Failed";
        }
      } catch (e) {
        this.smsInstance.cancel();
        reject({ msg: "Error SMS Number" });
      }
    });
  }

  async submitNumber() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting SMS Number", "blue");

      try {
        await this.page.evaluate((ISO) => {
          document.querySelector(`li[data-value="${ISO}"]`).click();
        }, this.getIso2(this.task.phnRegion).toLowerCase());

        // Get country code e.g. +1
        const countryCode = this.getPhoneCode(this.task.phnRegion, true);

        // Remove it and let Google auto-add it
        let fullNumber = this.smsNumber
          .substring(0, countryCode.length)
          .includes(countryCode)
          ? this.smsNumber.replace(countryCode, "")
          : this.smsNumber;

        await this.page.type("#phoneNumberId", fullNumber);

        await this.page.click('button[type="button"]');

        await this.sleep(1000);

        // Check if alert message element exists under parent element
        const evalExp = await this.page.evaluate(() => {
          return document.querySelector('div[aria-live="assertive"]')
            .childElementCount;
        });

        // 0 means good, 1 means bad
        const phoneInvalid = Boolean(evalExp);

        if (phoneInvalid) {
          this.updateStatus("Phone # Blocked", "red");
          await this.page.reload();

          throw "Phone Blocked";
        }

        await this.page.waitForSelector("#code", { timeout: 10000 });

        resolve("getCode");
      } catch (error) {
        this.updateStatus("Error Submitting SMS", "red");
        await this.sleep(3000);
        this.smsInstance.cancel();
        resolve("getSignupPage");
      }
    });
  }

  async getCode() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting SMS Code", "blue");
      try {
        this.smsCodeResponse = await this.smsInstance.getCode();
        console.log(this.smsCodeResponse);
        if (this.smsCodeResponse.status == "OK") {
          this.smsCode = this.smsCodeResponse.code.toString();
          this.smsInstance.finalize();
          resolve("submitCode");
        } else if (this.smsCodeResponse.status == "ERR") {
          this.smsInstance.cancel();
          reject({ msg: this.smsCodeResponse.response });
        } else {
          this.smsInstance.cancel();
          throw "Step Requirements Failed";
        }
      } catch (e) {
        this.smsInstance.cancel();
        resolve("getNumber");
      }
    });
  }

  async submitCode() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting SMS Code", "blue");
      try {
        await this.page.waitForSelector("#code");

        await this.page.type("#code", this.smsCode);

        await this.page.keyboard.press("Enter");

        resolve("addBirthdate");
      } catch (e) {
        console.log(e);
        this.updateStatus("Error Submitting SMS Code", "red");
        await this.sleep(3000);
        resolve("getSignupPage");
      }
    });
  }

  async addBirthdate() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Birthdate");

      try {
        await this.page.waitForSelector("#month");

        await this.page.select("#month", this.identity.birthday.month);

        await this.page.waitForTimeout(300);

        await this.page.click("#day");
        await this.page.waitForTimeout(30);
        await this.page.keyboard.type(this.identity.birthday.day, {
          delay: 30,
        });

        await this.page.waitForTimeout(300);

        await this.page.click("#year");
        await this.page.waitForTimeout(30);
        await this.page.keyboard.type(this.identity.birthday.year, {
          delay: 30,
        });

        await this.page.select(
          "#gender",
          this.identity.gender == "F" ? "1" : "2",
        );

        await this.page.keyboard.press("Enter");

        resolve("createAccount");
      } catch (error) {
        console.log(error);
        reject({ msg: "Error Setting Birthdate" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");

      try {
        try {
          await this.page.waitForSelector("#headingText", {
            timeout: 2250,
          });

          await this.page.evaluate(
            `document.querySelectorAll('button[type="button"]')[3].click()`,
          );
        } catch {}

        await this.page.waitForTimeout(5000);

        await this.page.evaluate(
          `document.querySelectorAll('button[type="button"]')[3].click()`,
        );

        await this.page.waitForTimeout(5000);

        await this.page.evaluate(
          `document.querySelectorAll('button[type="button"]')[3].click()`,
        );

        await this.page.waitForNavigation();

        await this.finishTask();

        resolve("initialize");
      } catch (error) {
        console.log(error);
        reject({ msg: "Error Creating Account" });
      }
    });
  }

  async finishTask() {
    try {
      let qtyLeft = this.getQtyLeft();
      this.updateStatus("Account Created!", "green", --qtyLeft, true);
      await this.displaySuccess();
      await this.sleep(1500);

      return true;
    } catch (e) {}
  }

  async displaySuccess() {
    this.addToGroup("google", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "Google",
      this.identity.email,
      this.identity.password,
    );

    await this.webhook({
      content: null,
      embeds: [
        {
          title: "Created Google account",
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
              value: `||${this.smsNumber}||`,
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
            url: "https://cdn.discordapp.com/attachments/901342456551993385/924706016866742332/google.png",
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
