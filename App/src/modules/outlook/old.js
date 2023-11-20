import Functionality from "../../tasks/Functionality";

import request from "request-promise";

import encryption from "./encryption";

export default class extends Functionality {
  constructor(task, id) {
    super(task, id);

    this.setRunning(true);

    if (!this.invalidTask) this.flow();
  }

  initialize() {
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
  }

  async flow() {
    while (this.getQtyLeft() > 0 && this.checkStop()) {
      let sessionState;
      while (!sessionState && this.getQtyLeft() > 0) {
        if (!this.checkStop()) {
          break;
        } else {
          this.initialize();
        }
        if (!this.checkStop()) {
          break;
        } else {
          sessionState = await this.getSession();
        }
      }

      if (this.task.outlookMode.includes("Phone")) {
        let getPhoneState;
        while (!getPhoneState && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            getPhoneState = await this.getPhone();
          }
        }
      }

      let submitInfoState;
      while (!submitInfoState && this.getQtyLeft() > 0) {
        if (!this.checkStop()) {
          break;
        } else {
          submitInfoState = await this.submitInfo();
        }
      }

      if (this.task.outlookMode == "Phone & Email") {
        let redirect1State;
        while (!redirect1State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            redirect1State = await this.redirect1();
          }
        }

        let redirect2State;
        while (!redirect2State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            redirect2State = await this.redirect2();
          }
        }

        let redirect3State;
        while (!redirect3State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            redirect3State = await this.redirect3();
          }
        }

        let loginState;
        while (!loginState && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            loginState = await this.completeLogin();
          }
        }

        let initAliasState;
        while (!initAliasState && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            initAliasState = await this.initAlias();
          }
        }

        let getPhone2State;
        while (!getPhone2State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            getPhone2State = await this.getPhone2();
          }
        }

        let submitAliasState;
        while (!submitAliasState && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            submitAliasState = await this.submitAlias();
          }
        }

        let aliasRedirect1State;
        while (!aliasRedirect1State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            aliasRedirect1State = await this.aliasRedirect1();
          }
        }

        let aliasRedirect2State;
        while (!aliasRedirect2State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            aliasRedirect2State = await this.aliasRedirect2();
          }
        }

        let aliasRedirect3State;
        while (!aliasRedirect3State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            aliasRedirect3State = await this.aliasRedirect3();
          }
        }

        let aliasPage1State;
        while (!aliasPage1State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            aliasPage1State = await this.aliasPage1();
          }
        }

        let aliasPage2State;
        while (!aliasPage2State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            aliasPage2State = await this.aliasPage2();
          }
        }

        let emailAlias1State;
        while (!emailAlias1State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            emailAlias1State = await this.emailAlias1();
          }
        }

        let emailAlias2State;
        while (!emailAlias2State && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            emailAlias2State = await this.emailAlias2();
          }
        }

        let setPrimaryEmailState;
        while (!setPrimaryEmailState && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            setPrimaryEmailState = await this.setPrimaryEmail();
          }
        }
      }

      if (this.task.xboxSignup) {
        let xboxSignupState;
        while (!xboxSignupState && this.getQtyLeft() > 0) {
          if (!this.checkStop()) {
            break;
          } else {
            xboxSignupState = await this.xboxSignup();
          }
        }
      }

      if (!this.checkStop()) {
        break;
      } else {
        await this.finishTask();
      }
    }

    if (!this.checkStop()) {
      this.stopTask();
    } else {
      this.completeTask(this.task.quantity);
    }
  }

  async getSession() {
    this.updateStatus("Getting Session", "blue");

    try {
      const res = await this.request({
        url: "https://signup.live.com/signup",
        method: "GET",
        headers: {
          authority: "signup.live.com",
          "cache-control": "max-age=0",
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          "sec-ch-ua-mobile": "?0",
          "upgrade-insecure-requests": "1",
          "user-agent": this.userAgent,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "sec-fetch-site": "none",
          "sec-fetch-mode": "navigate",
          "sec-fetch-user": "?1",
          "sec-fetch-dest": "document",
          "accept-language": "en-US,en;q=0.9",
        },
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        this.key = res.body.split('var Key="')[1].split('"')[0];
        this.randomNum = res.body.split('var randomNum="')[1].split('"')[0];
        this.SKI = res.body.split('var SKI="')[1].split('"')[0];
        this.fid = res.body.split("fid=")[1].split("&")[0];
        this.pid = res.body.split('pid":"')[1].split('"')[0];
        this.pageid = res.body.split('signUpPageId":')[1].split(",")[0];
        this.apiId = res.body.split('{"checkAvailableApiId":')[1].split(",")[0];
        this.country = res.body.split('{"country":"')[1].split('"')[0];
        this.scid = res.body.split('"scid":')[1].split(",")[0];
        this.uaid = res.body.split('"uaid":"')[1].split('"')[0];
        this.uiflvr = res.body.split('"uiflvr":')[1].split(",")[0];
        this.tcxt = res.body.split('"tcxt":"')[1].split('"')[0];
        this.tcxt = decodeURIComponent(
          JSON.parse('"' + this.tcxt.replace(/\"/g, '\\"') + '"'),
        );
        this.apiCanary = res.body.split('"apiCanary":"')[1].split('"')[0];
        this.apiCanary = decodeURIComponent(
          JSON.parse('"' + this.apiCanary.replace(/\"/g, '\\"') + '"'),
        );

        return true;
      }

      this.updateStatus("Error Getting Session", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Getting Session", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async getPhone() {
    this.updateStatus("Verifying with SMS", "blue");

    if (this.task.verifyWIthPhnNum) {
      this.smsInstance = new this.sms(this.task.provider);

      const smsResponse = await this.smsInstance.getNumber(
        "outlook",
        this.task.phnRegion,
      );

      if (smsResponse?.status == "ERR") {
        this.updateStatus(`SMS ${smsResponse.message}`, "red");
        await this.sleep(3000);
        this.stopTask();
        this.smsInstance.cancel();
        return false;
      } else {
        this.phone_number = smsResponse.number.toString();
      }
    } else {
      this.updateStatus("Must Enable Phone Verification", "red");
      await this.sleep(3000);
      this.stopTask();
      return false;
    }

    let prefix = this.getPhoneCode(this.task.phnRegion);

    try {
      const res = await this.request({
        url: "https://signup.live.com/API/Proofs/SendOtt?lic=1",
        method: "POST",
        headers: {
          authority: "signup.live.com",
          "x-ms-apiversion": "2",
          uaid: this.uaid,
          "sec-ch-ua-mobile": "?0",
          "user-agent": this.userAgent,
          canary: this.apiCanary,
          "Content-Type": "application/json",
          hpgid: "200650",
          accept: "application/json",
          tcxt: this.tcxt,
          "x-requested-with": "XMLHttpRequest",
          uiflvr: "1001",
          scid: "100118",
          "x-ms-apitransport": "xhr",
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          origin: "https://signup.live.com",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://signup.live.com/?lic=1",
          "accept-language": "en-US,en;q=0.9",
        },
        body: JSON.stringify({
          uaid: this.uaid,
          action: "SignUp",
          proofId: this.phone_number.replace(`+${prefix}`, "").replace("+", ""),
          proofCountryIso: this.smsInstance.getIso2(this.task.phnRegion),
          autoVerification: false,
          channel: "SMS",
          uiflvr: 1001,
          scid: 100118,
          hpgid: 200650,
        }),
        resolveWithFullResponse: true,
      });

      this.updateStatus("Waiting for SMS Code", "blue");

      const smsResponse = await this.smsInstance.getCode();

      if (res.statusCode == 200 && smsResponse?.status == "OK") {
        this.apiCanary = JSON.parse(res.body)["apiCanary"];
        this.apiCanary = this.apiCanary.replace("'", "");
        this.tcxt = JSON.parse(res.body)["telemetryContext"].replace("'", "");

        this.code = smsResponse.code;

        return true;
      }

      if (smsResponse?.status == "ERR") {
        this.updateStatus(`SMS ${smsResponse.message}`, "red");
        this.smsInstance.cancel();
        console.log("Attempted to cancel");
        await this.sleep(3000);
        return false;
      }

      this.updateStatus("Error Verifying with SMS", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Verifying with SMS", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async submitInfo() {
    this.updateStatus("Submitting Info", "blue");

    try {
      let encryptedPassword = encryption.Encrypt(
        this.identity.password,
        this.randomNum,
      );

      const res = await this.request({
        url: "https://signup.live.com/API/CreateAccount?lic=1",
        method: "POST",
        headers: {
          authority: "signup.live.com",
          "x-ms-apiversion": "2",
          uaid: this.uaid,
          "sec-ch-ua-mobile": "?0",
          "user-agent": this.userAgent,
          canary: this.apiCanary,
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          hpgid: "200641",
          accept: "application/json",
          tcxt: this.tcxt,
          "x-requested-with": "XMLHttpRequest",
          uiflvr: "1001",
          scid: "100118",
          "x-ms-apitransport": "xhr",
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          origin: "https://signup.live.com",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://signup.live.com/?lic=1",
          "accept-language": "en-US,en;q=0.9",
        },
        body: JSON.stringify({
          RequestTimeStamp: new Date().toISOString(),
          MemberName: this.task.outlookMode.includes("Phone")
            ? "+" + this.phone_number
            : this.identity.email,
          VerificationCode: this.code,
          CheckAvailStateMap: [
            (this.task.outlookMode.includes("Phone")
              ? "+" + this.phone_number
              : this.identity.email) + ":undefined",
          ],
          EvictionWarningShown: [],
          UpgradeFlowToken: {},
          FirstName: this.identity.firstName,
          LastName: this.identity.lastName,
          MemberNameChangeCount: 1,
          MemberNameAvailableCount: 1,
          MemberNameUnavailableCount: 0,
          CipherValue: encryptedPassword,
          SKI: this.SKI,
          BirthDate: "16:11:1999",
          Country: this.getIso2(this.task.region),
          AltEmail: null,
          IsOptOutEmailDefault: false,
          IsOptOutEmailShown: true,
          LW: true,
          SiteId: "68692",
          IsRDM: 0,
          WReply: null,
          ReturnUrl: null,
          SignupReturnUrl: null,
          uiflvr: 1001,
          uaid: this.uaid,
          SuggestedAccountType: "EASI",
          SuggestionType: "Prefer",
          HType: "enforcement",
          HSol: this.captchaToken,
          HFId: this.fid,
          encAttemptToken: this.submitCaptcha ? this.encAttemptToken : "",
          dfpRequestId: this.submitCaptcha ? this.dfpRequestId : "",
          scid: 100118,
          hpgid: 200641,
        }),
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        const data = JSON.parse(res.body);

        const pk = "B7D8911C-5CC8-A9A3-35B0-554ACEE604DA";
        const surl = "https://client-api.arkoselabs.com";

        if (data.error) {
          if (data.error.field == "hip") {
            this.updateStatus("SMS Challenge Received", "red");
          } else if (data.error.field == "hipEnforcement") {
            this.updateStatus("Captcha Received", "red");

            this.submitCaptcha = true;

            const captchaData = JSON.parse(data.error.data);

            this.encAttemptToken = captchaData.encAttemptToken;

            this.dfpRequestId = captchaData.dfpRequestId;

            this.captchaInstance = new this.captcha({
              provider: "twoCaptcha",
              retries: 100,
            });

            while (!this.captchaToken) {
              this.updateStatus("Solving captcha", "blue");

              this.captchaToken = await this.captchaInstance.solve(
                this.id,
                "funcaptcha",
                {
                  publickey: pk,
                  surl,
                  URL: "https://signup.live.com/signup",
                },
              );

              if (!this.captchaToken) {
                this.updateStatus("Error solving captcha", "red");

                await this.sleep(3000);
              }
            }

            console.log(this.captchaToken);
          } else {
            this.updateStatus(`Error: ${data.error.code}`, "red");
          }

          await this.sleep(3000);

          // await this.flow();

          return false;
        } else {
          this.slt = data.slt;
          this.purl = decodeURIComponent(
            JSON.parse('"' + data.redirectUrl.replace(/\"/g, '\\"') + '"'),
          );

          this.updateStatus("Account Created", "green");

          await this.sleep(3000);

          return true;
        }
      }

      this.updateStatus("Error Submitting Info", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Submitting Info", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async redirect1() {
    this.updateStatus("Handling Redirects (1)", "blue");

    try {
      const res = await this.request({
        url: this.purl,
        method: "POST",
        headers: {
          "Cache-Control": "max-age=0",
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          "sec-ch-ua-mobile": "?0",
          "Upgrade-Insecure-Requests": "1",
          Origin: "https://signup.live.com",
          "Content-Type": "application/x-www-form-urlencoded",
          "user-agent": this.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Dest": "document",
          Referer: "https://signup.live.com/",
          "Accept-Language": "en-US,en;q=0.9",
        },
        body: `slt=${this.slt}`,
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        this.ppft = res.body.split("sFT:'")[1].split("'")[0];
        this.url = res.body.split("urlPost:'")[1].split("'")[0];

        return true;
      }

      this.updateStatus("Error Handling Redirects (1)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Handling Redirects (1)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async redirect2() {
    this.updateStatus("Handling Redirects (2)", "blue");

    try {
      const res = await this.request({
        url: this.url,
        method: "POST",
        headers: {
          Connection: "keep-alive",
          Connection: "keep-alive",
          "Cache-Control": "max-age=0",
          "sec-ch-ua":
            '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "Upgrade-Insecure-Requests": "1",
          Origin: "https://login.live.com",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-User": "?1",
          "Sec-Fetch-Dest": "document",
          Referer: this.url,
          "Accept-Language": "en-US,en;q=0.9",
          dnt: "1",
        },
        body:
          "LoginOptions=1&type=28&ctx=&hpgrequestid=&PPFT=" +
          this.ppft +
          "&i2=&i17=0&i18=&i19=27594",
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        this.NAP = res.body.split('id="NAP" value="')[1].split('"')[0];
        this.Anon = res.body.split('id="ANON" value="')[1].split('"')[0];
        this.t = res.body.split('id="t" value="')[1].split('"')[0];

        return true;
      }

      this.updateStatus("Error Handling Redirects (2)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Handling Redirects (2)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async redirect3() {
    this.updateStatus("Handling Redirects (3)", "blue");

    try {
      const res = await this.request({
        url: "https://account.microsoft.com/?lang=en-US&wa=wsignin1.0",
        method: "POST",
        headers: {
          authority: "www.microsoft.com",
          "cache-control": "max-age=0",
          "sec-ch-ua":
            '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "upgrade-insecure-requests": "1",
          origin: "https://login.live.com",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": this.userAgent,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "sec-fetch-site": "cross-site",
          "sec-fetch-mode": "navigate",
          "sec-fetch-dest": "document",
          referer: "https://login.live.com/",
          "accept-language": "en-US,en;q=0.9",
          dnt: "1",
        },
        body:
          "NAPExp=Tue%2C%2B23-Nov-2021%2B03%3A03%3A26%2BGMT&NAP=" +
          this.NAP +
          "&ANON=" +
          this.Anon +
          "&ANONExp=Thu%2C%2B03-Mar-2022%2B03%3A03%3A26%2BGMT&t=" +
          this.t,
        resolveWithFullResponse: true,
        followAllRedirects: true,
      });

      if (res.statusCode == 200) {
        this.NAP = res.body.split('id="NAP" value="')[1].split('"')[0];
        this.Anon = res.body.split('id="ANON" value="')[1].split('"')[0];
        this.t = res.body.split('id="t" value="')[1].split('"')[0];
        this.pprid = res.body.split('id="pprid" value="')[1].split('"')[0];

        return true;
      }

      this.updateStatus("Error Handling Redirects (3)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Handling Redirects (3)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async completeLogin() {
    this.updateStatus("Completing Login", "blue");

    try {
      const res = await this.request({
        url: "https://account.microsoft.com/auth/complete-signin?ru=https%3A%2F%2Faccount.microsoft.com%2F%3Flang%3Den-US%26wa%3Dwsignin1.0%26refd%3Dlogin.live.com&wa=wsignin1.0",
        method: "POST",
        headers: {
          authority: "www.microsoft.com",
          "cache-control": "max-age=0",
          "sec-ch-ua":
            '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "upgrade-insecure-requests": "1",
          origin: "https://login.live.com",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": this.userAgent,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "sec-fetch-site": "cross-site",
          "sec-fetch-mode": "navigate",
          "sec-fetch-dest": "document",
          referer: "https://login.live.com/",
          "accept-language": "en-US,en;q=0.9",
          dnt: "1",
        },
        body:
          "pprid=" +
          this.pprid +
          "&NAP=" +
          this.NAP +
          "&ANON=" +
          this.Anon +
          "&t=" +
          this.t,
        resolveWithFullResponse: true,
        followAllRedirects: true,
      });

      if (res.statusCode == 200) {
        return true;
      }

      this.updateStatus("Error Completing Login", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Completing Login", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async initAlias() {
    this.updateStatus("Initializing Aliases", "blue");

    try {
      const res = await this.request({
        url: "https://account.live.com/names/manage?mkt=en-US&refd=account.microsoft.com&refp=profile&client_flight=shhelp",
        method: "GET",
        headers: {
          authority: "account.live.com",
          "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="92"',
          "sec-ch-ua-mobile": "?0",
          "upgrade-insecure-requests": "1",
          "user-agent": this.userAgent,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "sec-fetch-site": "cross-site",
          "sec-fetch-mode": "navigate",
          "sec-fetch-user": "?1",
          "sec-fetch-dest": "document",
          referer: "https://account.microsoft.com/",
          "accept-language": "en-US,en;q=0.9",
        },
        resolveWithFullResponse: true,
        followAllRedirects: true,
      });

      if (res.statusCode == 200) {
        this.nexturl = res.body.split("urlPost:'")[1].split("'")[0];
        this.sft = res.body.split("sFT:'")[1].split("'")[0];
        this.mobilenum = res.body.split('"data":"')[1].split('"')[0];
        this.proofIde = res.body.split('"data":"')[1].split('"')[0];
        this.ref = res.url;
        this.login = this.phone_number;

        return true;
      }

      this.updateStatus("Error Verifying with SMS (Alias)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Verifying with SMS (Alias)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async getPhone2() {
    this.updateStatus("Adding Phone Alias", "blue");

    try {
      const res = await this.request({
        url: "https://login.live.com/GetOneTimeCode.srf?mkt=en-US&lcid=1033&id=38936",
        method: "POST",
        headers: {
          Connection: "keep-alive",
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          "sec-ch-ua-mobile": "?0",
          "User-Agent": this.userAgent,
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "*/*",
          Origin: "https://login.live.com",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: this.ref,
          "Accept-Language": "en-US,en;q=0.9",
        },
        body:
          "login=" +
          this.login +
          "&flowtoken=" +
          this.sft +
          "&purpose=eOTT_OneTimePassword&channel=SMS&MobileNumE=" +
          this.mobilenum +
          "&UIMode=11&ProofConfirmation=" +
          this.phone_number.substring(this.phone_number.length - 4),
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        return true;
      }

      this.updateStatus("Error Verifying with SMS (Alias)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Verifying with SMS (Alias)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async submitAlias() {
    this.updateStatus("Verifying with SMS (Alias)", "blue");

    try {
      const smsResponse = await this.smsInstance.getCode();

      this.code = smsResponse.code;

      const res = await this.request({
        url: this.nexturl,
        method: "POST",
        headers: {
          Connection: "keep-alive",
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          "sec-ch-ua-mobile": "?0",
          "User-Agent": this.userAgent,
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "*/*",
          Origin: "https://login.live.com",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: this.ref,
          "Accept-Language": "en-US,en;q=0.9",
        },
        body:
          "type=18&GeneralVerify=false&request=&mfaLastPollStart=0&mfaLastPollEnd=0&SentProofIDE=" +
          this.proofIde +
          "&ProofConfirmation=" +
          this.phone_number.substring(this.phone_number.length - 4) +
          "&otc=" +
          this.code +
          "&AddTD=true&login=" +
          this.login +
          "&PPFT=" +
          this.sft +
          "&hpgrequestid=&sacxt=0&hideSmsInMfaProofs=false&i2=&i17=0&i18=&i19=1205235",
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        this.url = res.body.split('id="fmHF" action="')[1].split('"')[0];
        this.saved_url = this.url;
        this.ipt = res.body.split('id="ipt" value="')[1].split('"')[0];
        this.pprid = res.body.split('id="pprid" value="')[1].split('"')[0];
        this.uaid = res.body.split('id="uaid" value="')[1].split('"')[0];

        this.smsInstance.finalize();

        return true;
      }

      this.updateStatus("Error Verifying with SMS (Alias)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Verifying with SMS (Alias)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async aliasRedirect1() {
    this.updateStatus("Handling Alias Redirects (1)", "blue");

    try {
      const res = await this.request({
        url: this.url,
        method: "POST",
        headers: {
          authority: "account.live.com",
          "cache-control": "max-age=0",
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          "sec-ch-ua-mobile": "?0",
          "upgrade-insecure-requests": "1",
          origin: "https://login.live.com",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": this.userAgent,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "sec-fetch-site": "same-site",
          "sec-fetch-mode": "navigate",
          "sec-fetch-dest": "document",
          referer: "https://login.live.com/",
          "accept-language": "en-US,en;q=0.9",
        },
        followAllRedirects: true,
        body:
          "client_flight=shhelp&ipt=" +
          this.ipt +
          "&network_type=4G&pprid=" +
          this.pprid +
          "&uaid=" +
          this.uaid,
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        this.nexturl = res.body
          .split('finishSuccess":{"url":"')[1]
          .split('"')[0];
        this.eipt = res.body.split('"eipt":"')[1].split('"')[0];
        this.eipt = decodeURIComponent(
          JSON.parse('"' + this.eipt.replace(/\"/g, '\\"') + '"'),
        );
        this.tcxt = res.body.split('"tcxt":"')[1].split('"')[0];
        this.tcxt = decodeURIComponent(
          JSON.parse('"' + this.tcxt.replace(/\"/g, '\\"') + '"'),
        );
        this.apiCanary = res.body.split('"apiCanary":"')[1].split('"')[0];
        this.apiCanary = decodeURIComponent(
          JSON.parse('"' + this.apiCanary.replace(/\"/g, '\\"') + '"'),
        );

        return true;
      }

      this.updateStatus("Error Handling Alias Redirects (1)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Handling Alias Redirects (1)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async aliasRedirect2() {
    this.updateStatus("Handling Alias Redirects (2)", "blue");

    try {
      const res = await this.request({
        url:
          "https://account.live.com/API/ReportClientEvent" +
          this.saved_url.split("upsell")[1],
        method: "POST",
        headers: {
          Host: "account.live.com",
          "Content-Length": "409",
          "X-Ms-Apiversion": "2",
          Uaid: this.uaid,
          Wlprefeript: "1",
          Eipt: this.eipt,
          Canary: this.apiCanary,
          Tcxt: this.tcxt,
          "X-Requested-With": "XMLHttpRequest",
          "X-Ms-Apitransport": "xhr",
          "Sec-Ch-Ua": '" Not A;Brand";v="99", "Chromium";v="92"',
          "Sec-Ch-Ua-Mobile": "?0",
          "User-Agent": this.userAgent,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Hpgid: "200968",
          Accept: "application/json",
          Uiflvr: "1001",
          Scid: "100168",
          Origin: "https://account.live.com",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: this.saved_url,
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "en-US,en;q=0.9",
        },
        followAllRedirects: true,
        body:
          '{"pageApiId":"Account_AuthenticatorUpsellInterruptPage_Client","clientDetails":[],"country":"","userAction":"","source":"PageView","clientTelemetryData":{"category":"PageView","pageName":"Account_AuthenticatorUpsellInterruptPage","eventInfo":{"timestamp":1629476957487,"enforcementSessionToken":null}},"cxhFunctionRes":null,"uiflvr":1001,"uaid":"' +
          this.uaid +
          '","scid":100168,"hpgid":200968}',
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        this.apiCanary = JSON.parse(res.body)["apiCanary"];
        this.apiCanary = this.apiCanary.replace("'", "");
        this.tcxt = JSON.parse(res.body)["telemetryContext"].replace("'", "");

        return true;
      }

      this.updateStatus("Error Handling Alias Redirects (2)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Handling Alias Redirects (2)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async aliasRedirect3() {
    this.updateStatus("Handling Alias Redirects (3)", "blue");

    try {
      const res = await this.request({
        url: this.nexturl,
        method: "GET",
        headers: {
          Host: "login.live.com",
          "Sec-Ch-Ua": '" Not A;Brand";v="99", "Chromium";v="92"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent": this.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-User": "?1",
          "Sec-Fetch-Dest": "document",
          Referer: "https://account.live.com/",
          "Accept-Language": "en-US,en;q=0.9",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "close",
        },
        followAllRedirects: true,
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        this.url = res.body.split('id="fmHF" action="')[1].split('"')[0];
        this.NAPExp = res.body.split('id="NAPExp" value="')[1].split('"')[0];
        this.pprid = res.body.split('id="pprid" value="')[1].split('"')[0];
        this.NAP = res.body.split('id="NAP" value="')[1].split('"')[0];
        this.ANON = res.body.split('id="ANON" value="')[1].split('"')[0];
        this.ANONExp = res.body.split('id="ANONExp" value="')[1].split('"')[0];
        this.t = res.body.split('id="t" value="')[1].split('"')[0];

        return true;
      }

      this.updateStatus("Error Handling Alias Redirects (3)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Handling Alias Redirects (3)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async aliasPage1() {
    this.updateStatus("Getting Alias Page (1)", "blue");

    try {
      const res = await this.request({
        url: this.url,
        method: "POST",
        headers: {
          "Cache-Control": "max-age=0",
          "Sec-Ch-Ua": '" Not A;Brand";v="99", "Chromium";v="92"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Upgrade-Insecure-Requests": "1",
          Origin: "https://login.live.com",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Dest": "document",
          Referer: "https://login.live.com/",
          "Accept-Language": "en-US,en;q=0.9",
        },
        form: {
          NAPExp: this.NAPExp,
          pprid: this.pprid,
          NAP: this.NAP,
          ANON: this.ANON,
          ANONExp: this.ANONExp,
          t: this.t,
        },
        resolveWithFullResponse: true,
        followAllRedirects: true,
      });

      console.log(res.statusCode);

      if (res.statusCode == 200) {
        return true;
      }

      this.updateStatus("Error Getting Alias Page (1)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Getting Alias Page (1)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async aliasPage2() {
    this.updateStatus("Getting Alias Page (2)", "blue");

    try {
      const res = await this.request({
        url: "https://account.live.com/AddAssocId",
        method: "GET",
        headers: {
          authority: "account.live.com",
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          "sec-ch-ua-mobile": "?0",
          "upgrade-insecure-requests": "1",
          "user-agent": this.userAgent,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "navigate",
          "sec-fetch-user": "?1",
          "sec-fetch-dest": "document",
          referer:
            "https://account.live.com/names/manage?mkt=en-US&refd=account.microsoft.com&refp=profile&client_flight=shhelp&uaid=" +
            this.uaid,
          "accept-language": "en-US,en;q=0.9",
        },
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        this.Canary = res.body.split('name="canary" value="')[1].split('"')[0];

        return true;
      }

      this.updateStatus("Error Getting Alias Page (2)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Getting Alias Page (2)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async emailAlias1() {
    this.updateStatus("Adding Email Alias (1)", "blue");

    try {
      const res = await this.request({
        uri: "https://account.live.com/AddAssocId?ru=&cru=&fl=",
        method: "POST",
        headers: {
          "Cache-Control": "max-age=0",
          "Sec-Ch-Ua": '" Not A;Brand";v="99", "Chromium";v="92"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Upgrade-Insecure-Requests": "1",
          Origin: "https://account.live.com",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-User": "?1",
          "Sec-Fetch-Dest": "document",
          Referer: "https://account.live.com/AddAssocId?uaid=" + this.uaid,
          "Accept-Language": "en-US,en;q=0.9",
        },
        followAllRedirects: true,
        body:
          "canary=" +
          this.Canary +
          "&PostOption=NONE&SingleDomain=outlook.com&UpSell=&AddAssocIdOptions=LIVE&AssociatedIdLive=" +
          this.identity.email.split("@")[0],
        resolveWithFullResponse: true,
      });

      if (
        res.statusCode == 200 &&
        !res.body.includes(
          "This email address is already taken. Please try another.",
        )
      ) {
        return true;
      }

      this.updateStatus("Error Email Adding Alias", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Email Adding Alias", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async emailAlias2() {
    this.updateStatus("Adding Email Alias (2)", "blue");

    try {
      const res = await this.request({
        uri: "https://account.live.com/AddAssocId?ru=&cru=&fl=",
        method: "POST",
        headers: {
          "Cache-Control": "max-age=0",
          "Sec-Ch-Ua": '" Not A;Brand";v="99", "Chromium";v="92"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Upgrade-Insecure-Requests": "1",
          Origin: "https://account.live.com",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-User": "?1",
          "Sec-Fetch-Dest": "document",
          Referer: "https://account.live.com/AddAssocId?uaid=" + this.uaid,
          "Accept-Language": "en-US,en;q=0.9",
        },
        followAllRedirects: true,
        body:
          "canary=" +
          this.Canary +
          "&PostOption=NONE&SingleDomain=outlook.com&UpSell=&AddAssocIdOptions=LIVE&AssociatedIdLive=" +
          this.identity.email.split("@")[0] +
          this.getRandomStr(2),
        resolveWithFullResponse: true,
      });

      if (
        res.statusCode == 200 &&
        !res.body.includes(
          "This email address is already taken. Please try another.",
        )
      ) {
        return true;
      }

      this.updateStatus("Error Email Adding Alias", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Email Adding Alias", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async setPrimaryEmail() {
    this.updateStatus("Setting Primary Email", "blue");

    try {
      const res = await this.request({
        uri: "https://account.live.com/API/MakePrimary",
        method: "POST",
        headers: {
          "X-Ms-Apiversion": "2",
          Uaid: this.uaid,
          "Sec-Ch-Ua-Mobile": "?0",
          "User-Agent": this.userAgent,
          Canary: this.apiCanary,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Hpgid: "200176",
          Accept: "application/json",
          Tcxt: this.tcxt,
          "X-Requested-With": "XMLHttpRequest",
          Uiflvr: "1001",
          Scid: "100141",
          "X-Ms-Apitransport": "xhr",
          "Sec-Ch-Ua": '" Not A;Brand";v="99", "Chromium";v="92"',
          Origin: "https://account.live.com",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: this.alias_value,
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "en-US,en;q=0.9",
        },
        resolveWithFullResponse: true,
        body:
          '{"aliasName":"' +
          this.identity.email +
          '","emailChecked":true,"removeOldPrimary":false,"uiflvr":1001,"uaid":"' +
          this.uaid +
          '","scid":100141,"hpgid":200176}',
      });

      if (res.statusCode == 200) {
        return true;
      }

      this.updateStatus("Error Setting Primary Email", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Setting Primary Email", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async refreshLogin1() {
    this.updateStatus("Refreshing Login (1)", "blue");

    try {
      const res = await this.request({
        url: "https://outlook.com/owa/?nlp=1",
        method: "GET",
        headers: {
          "sec-ch-ua":
            '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
          "sec-ch-ua-mobile": "?0",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent": this.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          dnt: "1",
          "Sec-Fetch-Site": "cross-site",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-User": "?1",
          "Sec-Fetch-Dest": "document",
          Referer: "https://account.microsoft.com/",
          "Accept-Language": "en-US,en;q=0.9",
        },
        resolveWithFullResponse: true,
      });

      console.log(res);

      if (res.statusCode == 200) {
        this.NAPExp = res.body.split('id="NAPExp" value="')[1].split('"')[0];
        this.url = res.body.split('id="fmHF" action="')[1].split('"')[0];
        this.NAP = res.body.split('id="NAP" value="')[1].split('"')[0];
        this.ANONExp = res.body.split('id="ANONExp" value="')[1].split('"')[0];
        this.ANON = res.body.split('id="ANON" value="')[1].split('"')[0];
        this.pprid = res.body.split('id="pprid" value="')[1].split('"')[0];
        this.t = res.body.split('id="t" value="')[1].split('"')[0];

        return true;
      }

      this.updateStatus("Error Refreshing Login (1)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Refreshing Login (1)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async refreshLogin2() {
    this.updateStatus("Refreshing Login (2)", "blue");

    try {
      const res = await this.request({
        url: this.url,
        method: "POST",
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "max-age=0",
          "Sec-Ch-Ua": '"Chromium";v="95", ";Not A Brand";v="99"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Upgrade-Insecure-Requests": "1",
          Origin: "https://login.live.com",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Dest": "document",
          Referer: "https://login.live.com/",
          "Accept-Language": "en-US,en;q=0.9",
        },
        form: {
          NAPExp: this.NAPExp,
          ANONExp: this.ANONExp,
          wbids: "0",
          pprid: this.pprid,
          wbid: "MSFT",
          NAP: this.NAP,
          ANON: this.ANON,
          t: this.t,
        },
        followAllRedirects: true,
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        return true;
      }

      this.updateStatus("Error Refreshing Login (2)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Refreshing Login (2)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async setSafeSenders1() {
    this.updateStatus("Adding Safe Senders (1)", "blue");

    let emails = '"' + this.getCatchall("gmail.com") + '"';
    this.postData =
      '{"__type":"SetMailboxJunkEmailConfigurationRequest:#Exchange","Header":{"__type":"JsonRequestHeaders:#Exchange","RequestServerVersion":"V2018_01_08","TimeZoneContext":{"__type":"TimeZoneContext:#Exchange","TimeZoneDefinition":{"__type":"TimeZoneDefinitionType:#Exchange","Id":"Pakistan Standard Time"}}},"Options":{"TrustedSendersAndDomains":[' +
      emails +
      '],"TrustedRecipientsAndDomains":[],"BlockedSendersAndDomains":[],"Enabled":true,"TrustedListsOnly":false,"ContactsTrusted":false}}';

    try {
      const res = await this.request({
        url: "https://outlook.live.com/owa/0/service.svc?action=SetMailboxJunkEmailConfiguration&app=Mail&n=73",
        method: "POST",
        headers: {
          Host: "outlook.live.com",
          "Content-Length": "0",
          "Sec-Ch-Ua": '"Chromium";v="95", ";Not A Brand";v="99"',
          "X-Req-Source": "Mail",
          "X-Owa-Canary": this.value,
          "Sec-Ch-Ua-Mobile": "?0",
          "User-Agent": this.userAgent,
          "X-Owa-Urlpostdata": "%7B%7D",
          Action: "SetMailboxJunkEmailConfiguration",
          "x-owa-urlpostdata": this.postData,
          "Content-Type": "application/json; charset=utf-8",
          "Sec-Ch-Ua-Platform": '"Windows"',
          Accept: "*/*",
          Origin: "https://outlook.live.com",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: "https://outlook.live.com/",
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "en-US,en;q=0.9",
        },
        followAllRedirects: true,
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        let parsedJar = JSON.parse(JSON.stringify(this.jar));
        for (let i = 0; i < parsedJar._jar.cookies.length; i++) {
          if (parsedJar._jar.cookies[i].key.includes("X-OWA-CANARY")) {
            this.value = parsedJar._jar.cookies[i].value;
            break;
          }
        }

        return true;
      }

      this.updateStatus("Error Adding Safe Senders (1)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Adding Safe Senders (1)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async setSafeSenders2() {
    this.updateStatus("Adding Safe Senders (2)", "blue");

    try {
      const res = await this.request({
        url: "https://outlook.live.com/owa/0/service.svc?action=SetMailboxJunkEmailConfiguration&app=Mail&n=73",
        method: "POST",
        headers: {
          Host: "outlook.live.com",
          "Content-Length": "0",
          "Sec-Ch-Ua": '"Chromium";v="95", ";Not A Brand";v="99"',
          "X-Req-Source": "Mail",
          "X-Owa-Canary": this.value,
          "Sec-Ch-Ua-Mobile": "?0",
          "User-Agent": this.userAgent,
          "X-Owa-Urlpostdata": "%7B%7D",
          Action: "SetMailboxJunkEmailConfiguration",
          "x-owa-urlpostdata": this.postData,
          "Content-Type": "application/json; charset=utf-8",
          "Sec-Ch-Ua-Platform": '"Windows"',
          Accept: "*/*",
          Origin: "https://outlook.live.com",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: "https://outlook.live.com/",
          "Accept-Language": "en-US,en;q=0.9",
        },
        followAllRedirects: true,
        resolveWithFullResponse: true,
      });

      if (res.statusCode == 200) {
        let parsedJar = JSON.parse(JSON.stringify(this.jar));
        for (let i = 0; i < parsedJar._jar.cookies.length; i++) {
          if (parsedJar._jar.cookies[i].key.includes("X-OWA-CANARY")) {
            this.value = parsedJar._jar.cookies[i].value;
            break;
          }
        }

        return true;
      }

      this.updateStatus("Error Adding Safe Senders (2)", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Adding Safe Senders (2)", "red");
      await this.sleep(3000);

      return false;
    }
  }

  async xboxSignup() {
    this.updateStatus("Completing Xbox Signup", "blue");

    try {
      const res = await this.request({
        url: "https://account.xbox.com/en-us/xbox/account/api/v1/accountscreation/CreateXboxLiveAccount",
        method: "POST",
        headers: {
          __RequestVerificationToken:
            "cabiQ1pUWZV-1a8uVf9wXpOyMzcEXl2Tch3zjaiqZHK5mrWAaGO6altaCwqZXB8PtI2kN3EiCMvj1MrhvGl7pWk2kc81",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Host: "account.xbox.com",
          Origin: "https://account.xbox.com",
          Referer:
            "https://account.xbox.com/en-us/accountcreation?returnUrl=https%3a%2f%2fwww.xbox.com%2fen-US%2f&ru=https%3a%2f%2fwww.xbox.com%2fen-US%2f&rtc=1&csrf=cabiQ1pUWZV-1a8uVf9wXpOyMzcEXl2Tch3zjaiqZHK5mrWAaGO6altaCwqZXB8PtI2kN3EiCMvj1MrhvGl7pWk2kc81&wa=wsignin1.0",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Sec-GPC": "1",
          "User-Agent": this.userAgent,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: "partnerOptInChoice=true&msftOptInChoice=true&isChild=true&returnUrl=https%3A%2F%2Fwww.xbox.com%2Fen-US%2F",
      });

      if (res.statusCode == 200) {
        return true;
      }

      this.updateStatus("Error Completing Xbox Signup", "red");
      await this.sleep(3000);
      return false;
    } catch (error) {
      console.log(error);
      this.updateStatus("Error Completing Xbox Signup", "red");
      await this.sleep(3000);

      return false;
    }
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
