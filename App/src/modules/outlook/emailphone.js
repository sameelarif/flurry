import Functionality from "../../tasks/Functionality";

import request from "request-promise";

import encryption from "./encryption";

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
      this.updateStatus("", "blue");
      try {
        this.task.catchall = "outlook.com";

        this.getIdentity();
        this.getUserAgent();

        this.jar = request.jar();
        this.request = request.defaults({
          proxy: this.task.useProxies
            ? this.getProxy(this.task.proxyGroup)
            : undefined,
          withCredentials: true,
          strictSSL: false,
          jar: this.jar,
          timeout: 10000,
        });

        resolve("");
      } catch (e) {
        reject({ msg: "Error Initializing" });
      }
    });
  }

  async getSession() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Session", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async getNumber() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Number", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setNumber() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting SMS Number", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async getCode() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting SMS Code", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setIdentity() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Identity", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async redirect1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async redirect2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (2)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async redirect3() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (3)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async initialLogin() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Logging In", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async initialAlias() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Initializing Alias", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async getNumber2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting SMS Number", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setNumber2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting SMS Number", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async getCode2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting SMS Code", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setAlias() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Alias", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async aliasRedirect1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async aliasRedirect2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (2)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async aliasRedirect3() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (3)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setAliasIdentity1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Alias (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setAliasIdentity2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Alias (2)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setPrimaryEmail() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Switching Primary Email", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async enableForwarding1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Forwarding (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async enableForwarding2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Forwarding (2)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async refreshLogin1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Refreshing Login (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async refreshLogin2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Refreshing Login (2)", "blue");

      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setSafeSenders1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Senders (1)", "blue");

      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async setSafeSenders2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Senders (2)", "blue");

      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
      }
    });
  }

  async enableXbox() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Xbox", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "" });
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
    } catch (e) {
      console.log(e);
    }
  }

  async displaySuccess() {
    this.addToGroup("outlook", this.task.accGroup, {
      email:
        this.task.outlookMode == "Phone"
          ? this.phone_number
          : `${this.identity.email}`,
      password: this.identity.password,
    });

    this.updateDashCreate(
      "New account created",
      "Outlook",
      this.task.outlookMode == "Phone"
        ? this.phone_number
        : `${this.identity.email}`,
      this.identity.password,
      this.task.verifyWIthPhnNum,
    );

    if (
      this.task.customEmails &&
      this.checkEmailGroupLength(this.task.emailGroup) > 0 &&
      this.task.outlookMode !== "Phone"
    ) {
      this.deleteUsedCustomEmail(this.task.emailGroup, this.identity.email);
    }

    await this.webhook({
      content: null,
      embeds: [
        {
          title: "Created Outlook account",
          description: `[Copy account credentials](https://[removed]/?text=${encodeURI(
            this.identity.email,
          )}:${encodeURI(this.identity.password)})`,
          color: 12773868,
          fields: [
            {
              name: this.task.outlookMode == "Phone" ? "Phone" : "Email",
              value: `||${
                this.task.outlookMode == "Phone"
                  ? this.phone_number
                  : this.identity.email
              }||`,
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
            url: "https://media.discordapp.net/attachments/901342456551993385/907635983397318666/outlooksvg.png",
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
