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

      try {
        await this.createBrowser();
      } catch (e) {
        console.log(e);
        reject({ msg: "Error Initializing" });
      }

      resolve("getSignupPage");
    });
  }

  async getSignupPage() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Signup Page", "blue");

      try {
        await this.page.goto(
          `https://www.sneakersnstuff.com/en/auth/view?op=register`,
        );

        try {
          await this.page.waitForSelector("#firstNameInput", { timeout: 5000 });

          resolve("createAccount");
        } catch (e) {
          resolve("initialize");
        }

        throw `Step Requirements Failed`;
      } catch (error) {
        reject({ msg: "Error Getting SignUp" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");

      try {
        await this.page.click("#firstNameInput");

        await this.page.type("#firstNameInput", this.identity.firstName);

        await this.page.click(
          "#auth > div > article > section > form > div:nth-child(4) > label",
        );

        await this.page.type(
          "#auth > div > article > section > form > div:nth-child(4) > label",
          this.identity.email,
        );

        await this.page.click(
          "#auth > div > article > section > form > div:nth-child(5) > label",
        );

        await this.page.type(
          "#auth > div > article > section > form > div:nth-child(5) > label",
          this.identity.password,
        );

        await this.page.click(
          "#auth > div > article > section > form > div:nth-child(7) > button > span",
        );

        try {
          await this.page.waitForSelector(
            "#auth > div > article > footer > a",
            { timeout: 15000 },
          );

          resolve("finishTask");
        } catch (e) {
          resolve("initialize");
        }
      } catch (error) {
        reject({ msg: "Error Creating Account" });
      }
    });
  }

  async finishTask() {
    return new Promise(async (resolve, reject) => {
      try {
        let qtyLeft = this.getQtyLeft();
        this.updateStatus("Account Created!", "green", --qtyLeft, true);
        await this.displaySuccess();
        await this.sleep(800);

        resolve("initialize");
      } catch (e) {
        reject({ msg: "Error Running Misc." });
      }
    });
  }

  async displaySuccess() {
    this.addToGroup("sns", this.task.accGroup, {
      email: this.identity.email,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "SNS",
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
          title: "Created SNS account",
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
            url: "https://media.discordapp.net/attachments/901342456551993385/907635985158901791/snsimg.png?width=300&height=300",
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
