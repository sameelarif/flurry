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
        resolve("getNumber");
      } catch (e) {
        reject({ msg: "Session Error" });
      }
    });
  }

  async getNumber() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Number", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Get SMS Number Error" });
      }
    });
  }

  async setNumber() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting SMS Number", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Sub SMS Number" });
      }
    });
  }

  async getCode() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting SMS Code", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Get SMS Code Error" });
      }
    });
  }

  async setCode() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting SMS Code", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Sub SMS Code Error" });
      }
    });
  }

  async setIdentity() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Identity", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Sub Identity Error" });
      }
    });
  }

  async redirect1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Handle Redir 1 Error" });
      }
    });
  }

  async redirect2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (2)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Handle Redir 2 Error" });
      }
    });
  }

  async redirect3() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (3)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Handle Redir 3 Error" });
      }
    });
  }

  async initialLogin() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Logging In", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Login Error" });
      }
    });
  }

  async initialAlias() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Initializing Alias", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Initialize Ali Error" });
      }
    });
  }

  async getNumber2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting SMS Number", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Get SMS Number Error" });
      }
    });
  }

  async setNumber2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting SMS Number", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Sub SMS Number Error" });
      }
    });
  }

  async getCode2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting SMS Code", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Get SMS Code Error" });
      }
    });
  }

  async setAlias() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Alias", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Sub Ali Error" });
      }
    });
  }

  async aliasRedirect1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Handle Ali 1 Redir Error" });
      }
    });
  }

  async aliasRedirect2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (2)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Handle Ali 2 Redir Error" });
      }
    });
  }

  async aliasRedirect3() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Handling Redirects (3)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Handle Ali 3 Redir Error" });
      }
    });
  }

  async setAliasIdentity1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Alias (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Sub Ali 1 Error" });
      }
    });
  }

  async setAliasIdentity2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Submitting Alias (2)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Sub Ali 2 Error" });
      }
    });
  }

  async setPrimaryEmail() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Switching Primary Email", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Primary Email Error" });
      }
    });
  }

  async enableForwarding1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Forwarding (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Forwarding 1 Error" });
      }
    });
  }

  async enableForwarding2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Forwarding (2)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Forwarding 2 Error" });
      }
    });
  }

  async refreshLogin1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Refreshing Login (1)", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Refresh Login 1 Error" });
      }
    });
  }

  async refreshLogin2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Refreshing Login (2)", "blue");

      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Refresh Login 2 Error" });
      }
    });
  }

  async setSafeSenders1() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Senders (1)", "blue");

      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Senders 1 Error" });
      }
    });
  }

  async setSafeSenders2() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Senders (2)", "blue");

      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Senders 2 Error" });
      }
    });
  }

  async enableXbox() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Enabling Xbox", "blue");
      try {
        resolve("");
      } catch (e) {
        reject({ msg: "Xbox Err" });
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
