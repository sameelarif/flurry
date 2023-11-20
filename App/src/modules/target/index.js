import Functionality from "../../tasks/Functionality";
import Store from "../../store/Store";

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

      // Close Existing Browser
      if (this.browser) {
        this.browser.close();
      }

      try {
        await this.createBrowser();
      } catch (e) {
        reject({ msg: "Error Initializing" });
      }

      resolve("getForm");
    });
  }

  // init && get form
  // create account
  // set profile (optional)
  // verify sms (optional)

  async getForm() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Signup Page", "blue");

      try {
        await this.page.goto(
          `https://gsp.target.com/gsp/authentications/v1/auth_codes?client_id=ecom-web-1.0.0&state=${Date.now()}&redirect_uri=https%3A%2F%2Fwww.target.com%2F&assurance_level=M&acr=create_session_create_account`,
        );

        try {
          await this.page.waitForSelector("#username", {
            timeout: 30000,
          });
        } catch (e) {
          reject({ msg: "Error Getting Signup Page" });
        }

        resolve("createAccount");
      } catch (error) {
        reject({ msg: "Error Getting Signup Page" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      if (this.task.verifyWIthPhnNum) {
        this.updateStatus("Getting Phone Number", "blue");

        this.smsInstance = new this.sms(this.task.provider);

        const smsResponse = await this.smsInstance.getNumber(
          "target",
          this.task.phnRegion,
        );

        if (smsResponse?.status == "ERR") {
          this.updateStatus(`SMS ${smsResponse.message}`, "red");
          await this.sleep(3000);
          this.stopTask();
          this.smsInstance.cancel();

          reject({ msg: "Account Creation Failed" });
        } else {
          this.phone_number = smsResponse.number.toString();
        }
      }

      this.updateStatus("Creating account", "blue");

      try {
        await this.page.waitForSelector("#username", {
          timeout: 30000,
        });

        await this.page.type("#username", this.identity.email);

        await this.page.type("#firstname", this.identity.firstName);

        await this.page.type("#lastname", this.identity.lastName);

        // await this.page.type("#phone", this.phone_number);

        await this.page.type("#password", this.identity.password);

        await this.page.click("#createAccount");

        try {
          await this.sleep(2000);

          const alert = await this.page.$$('div[data-test="authAlertDisplay"]');

          if (alert.length) {
            await this.displayFail();
            await this.sleep(3000);
            this.updateStatus("Error Creating Account", "red");

            await this.browser.close();

            resolve("initialize");

            return;
          }
        } catch {}

        if (this.task.verifyWIthPhnNum) {
          await this.page.click('input[placeholder="Enter your code"]');

          this.updateStatus("Waiting for SMS Code", "blue");

          const codeResponse = await this.smsInstance.getCode();

          if (codeResponse?.status == "ERR") {
            this.updateStatus(`SMS ${codeResponse.message}`, "red");
            this.smsInstance.cancel();
            console.log("Attempted to cancel");
            await this.sleep(3000);
            reject({ msg: "Phone Verification Failed" });
          }

          this.code = codeResponse.code;

          this.updateStatus("Submitting Code", "blue");

          await this.page.type('input[type="tel"]', this.code);

          await this.page.click("#verify");
        }

        await this.page.waitForSelector("#circle-join-free", {
          timeout: 30000,
        });

        await this.page.click("#circle-join-free");

        resolve(this.task.setProfileInfo ? "addInfo" : "finishTask");
      } catch (e) {
        console.log(e);
        await this.displayFail();
        await this.browser.close();

        this.updateStatus("Error Creating Account", "red");

        await this.sleep(3000);

        resolve("initialize");
      }
    });
  }

  async addInfo() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Setting Profile Information", "blue");

      const { shippingInfo, billingInfo } = Store.getProfiles()["Test"];
      console.log(billingInfo);
      try {
        await this.page.goto("https://www.target.com/account/payments/new");

        await this.page.waitForSelector("#cardNumber");

        await this.page.type(
          "#cardNumber",
          billingInfo.cardDetails.number.replace(/\s/g, ""),
        );

        await this.page.type(
          "#expiration",
          `${
            billingInfo.cardDetails.expMonth
          }${billingInfo.cardDetails.expYear.slice(-2)}`,
        );

        await this.page.type("#cardName", billingInfo.cardDetails.name);

        await this.page.click("#ToggleDefaultPayment");

        await this.page.click('button[data-test="addNewAddressButton"]');

        await this.page.type("#first_name", billingInfo.firstName);

        await this.page.type("#last_name", billingInfo.lastName);

        await this.page.type("#address_line1", billingInfo.addressLineOne);

        await this.page.keyboard.press("Tab");
        await this.page.keyboard.press("Tab");

        await this.page.selectOption("#country", billingInfo.countryCode);

        await this.page.type("#zip_code", billingInfo.zipCode);

        await this.page.type("#city", billingInfo.city);

        await this.page.selectOption("#state", billingInfo.stateCode);

        await this.page.type("#phone_number", billingInfo.phoneNumber);

        if (Math.random() > 0.5) await this.page.keyboard.press("Enter");
        else await this.page.click('button[type="submit"]');

        this.updateStatus("Submitting Profile Information", "blue");
        await this.page.waitForNavigation();

        resolve("finishTask");
      } catch (error) {
        console.log(error);
        reject({ msg: "Error Submitting Profile" });
      }
    });
  }

  async finishTask() {
    return new Promise(async (resolve, reject) => {
      let qtyLeft = this.getQtyLeft();

      this.updateStatus("Account created!", "green", --qtyLeft, true);
      await this.sleep(3000);

      this.accessToken = "N/A";

      try {
        const cookies = await this.page._client.send("Network.getAllCookies");

        this.accessToken = cookies.cookies.filter(
          (_) => _.name == "accessToken",
        )[0].value;
      } catch (e) {
        console.log(e);
      }

      await this.displaySuccess();
      await this.sleep(1500);

      resolve("initialize");
    });
  }

  async displaySuccess() {
    this.addToGroup("target", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "Target",
      this.identity.email,
      this.identity.password,
      this.task.verifyWIthPhnNum,
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
          title: "Created Target account",
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
              name: "Copy Access Token",
              value: `[Click here](https://[removed]/?text=${this.accessToken})`,
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
            url: "https://cdn.discordapp.com/attachments/901342456551993385/907635983648981013/targetpngcor.png",
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
