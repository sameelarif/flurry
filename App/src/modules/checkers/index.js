import Functionality from "../../tasks/Functionality";
import Store from "../../store/Store";

import cheerio from "cheerio";
import request from "request-promise";
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

  async initialize() {
    return new Promise(async (resolve, reject) => {
      this.getIdentity();

      this.jar = new tough.CookieJar();

      this.request = request.defaults({
        proxy: this.task.useProxies
          ? this.getProxy(this.task.proxyGroup)
          : undefined,
        withCredentials: true,
        strictSSL: false,
        resolveWithFullResponse: true,
        followAllRedirects: true,
      });

      resolve("getSession");
    });
  }

  async getSession() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Getting Session", "blue");

      try {
        const res = await this.request({
          url: "https://www.checkers.com/rewards/",
          method: "GET",
          headers: {
            Connection: "keep-alive",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Upgrade-Insecure-Requests": "1",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          const regex =
            /<a href="(.*)" target="_blank" class="btn btn-primary">Sign Up<\/a>/gm;
          let matches = res.body.match(regex);

          if (matches.length > 0) {
            let url = matches[0];
            const myArray = url.split('a href="');
            const newArray = myArray[1].split(
              '" target="_blank" class="btn btn-primary">Sign Up</a>',
            );
            this.registerUrl = newArray[0];

            resolve("parseRegisterValues");
          } else {
            reject({ msg: "Failed to parse." });
          }
        }
      } catch (e) {
        reject({ msg: "Error Getting Session" });
      }
    });
  }

  async parseRegisterValues() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Parsing Register Values", "blue");
      try {
        const res = await this.request({
          url: this.registerUrl,
          method: "GET",
          headers: {
            Connection: "keep-alive",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Upgrade-Insecure-Requests": "1",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          const $ = cheerio.load(res.body);

          // this.weirdFields = [];
          // $("input[type='hidden']").each(function (index, element) {
          //   this.weirdFields.push($(element).attr('name'));
          // });

          this.weirdFields = $("input[type='hidden']")
            .toArray()
            .map((element) => $(element).attr("name"));

          this.salutationField = $('select[id="salutation"]').attr("name");
          this.firstNameField = $('input[id="firstName"]').attr("name");
          this.lastNameField = $('input[id="lastName"]').attr("name");
          this.zipCodeField = $('input[id="postalCode"]').attr("name");
          this.phoneNumberField = $('input[id="mobilePhone"]').attr("name");
          this.birthMonthField = $('input[id="dateOfBirthMonth"]').attr("name");
          this.birthDayField = $('input[id="dateOfBirthDay"]').attr("name");
          this.usernameField = $('input[id="username"]').attr("name");
          this.emailField = $('input[id="email"]').attr("name");
          this.passwordField = $('input[id="password"]').attr("name");
          this.confirmPasswordField = $('input[id="confirmPassword"]').attr(
            "name",
          );
          this.accpetTermsField = $('input[id="acceptTerms"]').attr("name");
          this.optInField = $('input[id="optIn"]').attr("name");
          this.submitField = $(
            'button[class="btn btn-default reverseEnrollRegistrationFieldsSubmitButton"]',
          ).attr("name");

          resolve("createAccount");
        }
      } catch (e) {
        console.log(e);

        await this.displayFail();
        await this.sleep(3000);

        reject({ msg: "Parsing Values Failed" });
      }
    });
  }

  async createAccount() {
    return new Promise(async (resolve, reject) => {
      this.updateStatus("Creating Account", "blue");

      try {
        let postData = {};
        postData[this.salutationField] = "Mr.";
        postData[this.firstNameField] = this.identity.firstName;
        postData[this.lastNameField] = this.identity.lastName;
        postData[this.zipCodeField] = this.task.zipCode;
        postData[this.phoneNumberField] = this.identity.phoneNumber;
        postData[this.birthMonthField] = this.identity.birthday.month;
        postData[this.birthDayField] = this.identity.birthday.day;
        postData[this.emailField] = this.identity.email;
        postData[this.usernameField] = this.identity.email.split("@")[0];
        postData[this.passwordField] = this.identity.password;
        postData[this.confirmPasswordField] = this.identity.password;
        postData[this.accpetTermsField] = "true";
        postData[this.optInField] = "true";
        postData[this.submitField] = "";

        this.weirdFields.forEach((element) => {
          postData[element] = "true";
        });

        const res = await this.request({
          url: this.registerUrl,
          method: "POST",
          form: postData,
          headers: {
            Connection: "keep-alive",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua":
              '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Upgrade-Insecure-Requests": "1",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            Referer: this.registerUrl,
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });

        if (res.statusCode == 200) {
          if (res.body.includes("Click here to go to your account.")) {
            await this.displaySuccess();
            await this.sleep(800);

            resolve("initialize");
          } else {
            this.updateStatus("Proxy Blocked", "red");
            await this.sleep(3000);
            resolve("initialize");
          }
        }
      } catch (e) {
        await this.displayFail();
        await this.sleep(3000);

        reject({ msg: "Creation Failed" });
      }
    });
  }

  async displaySuccess() {
    this.addToGroup("checkers", this.task.accGroup, {
      email: this.identity.email,
    });

    this.updateDashCreate(
      "New account created",
      "checkers",
      this.identity.email,
    );

    await this.webhook({
      content: null,
      embeds: [
        {
          title: "Created Checkers account",
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
              name: "Proxy",
              value: `||${this.identity.password || "localhost"}||`,
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
            url: "https://cdn.discordapp.com/attachments/935971708890931230/939333439885307914/unknown.png",
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
