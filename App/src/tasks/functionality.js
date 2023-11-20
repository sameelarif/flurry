// Base Connection
import Store from "../store/Store";
import { app } from "electron";

// Helper Connection
import dialingMap from "../lib/api/sms/maps/dialing_map";
import select from "../lib/tools/Select";
import webhook from "../lib/tools/Webhook";

// API/Library Connection
import captcha from "../lib/api/captcha";
import client from "../lib/tools/Net";
import devices from "../lib/db/devices.json";
import eventBus from "../lib/tools/Events_Bus";
import SMS from "../lib/api/sms";

import fs from "fs";
import path from "path";
import inbox from "inbox";
import axios from "axios";
import faker from "faker";
import moment from "moment";
import dotenv from "dotenv";
import proxyChain from "proxy-chain";
import chromePaths from "chrome-paths";
import puppeteer from "puppeteer-extra";
import { simpleParser } from "mailparser";
import { createCursor } from "ghost-cursor";

// Enviormental Connection
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const isDevelopment = process.env.mode === "DEVELOPMENT" ? true : false;

let email;

export default class {
  /**
   * Set task values
   * @param {object} task Task options object
   * @param {string} id Task UUID
   */
  constructor(task, id) {
    this.task = task;
    this.id = id;

    this.validateTask();

    console.log(task);

    // Helper Links
    this.select = select;
    this.webhook = webhook;

    // API/Library Links
    this.sms = SMS;
    this.client = client;
    this.captcha = captcha;

    this.discordId = Store.getDiscordId();

    if (this.getSMSKey("imap") && this.getSMSKey("imap") !== "null") {
      const [server, email, password] = this.getSMSKey("imap").split(":");

      this.emailServer = server;
      this.imapAuth = { user: email, pass: password };
    }

    eventBus.on(`stopTask_${id}`, () => {
      if (this.browser) {
        this.browser.close();
      }
    });
  }

  /**
   * Ensure task options won't cause errors
   */
  validateTask() {
    let err;

    if (this.task.useProxies && ["None", ""].includes(this.task.proxyGroup)) {
      this.updateStatus("Select Proxy Group", "red");

      err = true;
    } else if (
      this.task.verifyWIthPhnNum &&
      (this.task.phnRegion == "" || this.task.provider == "")
    ) {
      this.updateStatus("Select Phone Region", "red");

      err = true;
    } else if (
      !["google", "outlook", "yahoo"].includes(this.task.site.toLowerCase()) &&
      !this.task.customEmails &&
      this.task.catchall.trim() == ""
    ) {
      this.updateStatus("Enter Catchall", "red");

      err = true;
    } else if (
      this.task.customEails &&
      ["None", ""].includes(this.task.emailGroup)
    ) {
      this.updateStatus("Select Email Group", "red");

      err = true;
    } else if (this.task.accGroup == "") {
      this.updateStatus("Select Account Group", "red");

      err = true;
    }

    if (err) {
      this.invalidTask = true;
    }
  }

  /**
   * Get object of all tasks
   */
  getUITask() {
    return Store.getTasks();
  }

  /**
   * Set if task is running or now
   * @param {boolean} status Whether task is running or not
   */
  setRunning(status) {
    let tasks = this.getUITask();
    tasks[this.id].running = status;
    Store.setTasks(tasks);
  }

  /**
   * Set new quantity of task
   * @param {number} qty Quantity
   */
  setQty(qty) {
    let tasks = this.getUITask();
    tasks[this.id].quantity = qty;
    Store.setTasks(tasks);
    Store.saveTasks(tasks);
  }

  /**
   * Get cookie from jar by name
   * @param {string} allCookies JSON string of all cookies
   * @param {string} cookie Name of cookie to get
   */
  getSingleCookie(allCookies, cookie) {
    let single;
    let parsedAllCookies = JSON.parse(allCookies);
    parsedAllCookies.forEach((c) => {
      if (c["key"] == cookie) {
        single = c.value;
      }
    });
    return single;
  }

  /**
   * Get random device data for task
   */
  getDevice() {
    this.device = this.choose(devices);
  }

  /**
   * Get identity information for task
   */
  getIdentity() {
    let month, day, year;
    if (this.task.birth) {
      const birthDate = new Date(this.task.birth._d);

      month = birthDate.getMonth().toString();
      day = birthDate.getDay().toString();
      year = birthDate.getFullYear().toString();
    } else {
      month = this.getRandomInt(1, 12).toString();
      day = this.getRandomInt(1, 29).toString();
      year = this.getRandomInt(1965, 2002).toString();
    }

    this.identity = {
      password: this.getPassword(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: this.choose(["M", "F"]),
      birthday: {
        monthFormatted: month < 10 ? `0${month}` : month,
        dayFormatted: day < 10 ? `0${day}` : day,
        month,
        day,
        year,
      },
    };

    if (this.task.customEmails && this.task.emailGroup !== "None") {
      if (this.checkEmailGroupLength(this.task.emailGroup) > 0) {
        this.identity.email = this.getCustomEmail(this.task.emailGroup);
      } else {
        this.updateStatus("No Emails Left", "red");
        this.setRunning(false);
      }
    } else {
      this.identity.email = this.getCatchall(this.task.catchall);
    }

    email = this.identity.email;
  }

  /**
   * Convert cookie jar to string
   */
  logCookies() {
    return new Promise((res) => {
      this.jar._jar.store.getAllCookies(function (err, cookieArray) {
        if (err) throw new Error("Failed to get cookies");
        res(cookieArray.map((cookie) => cookie.toString()).join(", "));
      });
    });
  }

  /**
   * Get user agent from user agent list
   */
  getUserAgent(type = "desktop") {
    this.userAgent = this.select.ua(type);
  }

  /**
   * Convert domain to site name
   * google.com -> Google
   * @param {string} site Site domain
   */
  parseDomainName(site) {
    this.siteName = (site.charAt(0).toUpperCase() + site.slice(1)).split(
      ".",
    )[0];
  }

  /**
   *@param {string} card Credit card number to format
   */
  formatCardNumber(card) {
    function getSlices(digits, pattern) {
      if (pattern.length === 0) {
        return digits.length ? [digits] : [];
      }

      if (digits.length === 0) {
        return [];
      }

      const size = pattern.shift();
      const part = digits.substring(0, size);

      if (part.length < size) {
        return [part];
      }

      return [part].concat(getSlices(digits.substring(size), pattern));
    }

    const clean = card.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = clean.match(/\d{4,19}/g);
    const match = (matches && matches[0]) || "";
    const parts = getSlices(match, pattern.split(" "));

    if (parts.length) {
      return parts.join(" ");
    }

    return card;
  }

  /**
   * Get SMS provider API key
   * @param {string} provider SMS provider name
   */
  getSMSKey(provider) {
    let settings = Store.getSettings();
    return settings.sms[provider];
  }

  /**
   * Convert country name to ISO2 code
   * @param {string} country Country name
   */
  getIso2(country) {
    return dialingMap.iso2(country);
  }

  /**
   * Convert country name to phone code
   * @param {string} country Country name (full name)
   * @param {string} withPlus Whether  to prefix code by `+` or not
   */
  getPhoneCode(country, withPlus = false) {
    let code = dialingMap.map(country);

    if (withPlus) {
      code = `+${code}`;
    }

    return code;
  }

  /**
   * Initialize browser
   */
  async createBrowser() {
    let opts = {
      headless: false,
      executablePath: chromePaths.chrome,
      args: [
        "--use-mobile-user-agent",
        "ignore-certificate-errors",
        "--disable-blink-features=AutomationControlled",
        "--unlimited-storage",
        "--lang=en-US,en;q=0.9",
        "--disable-features=site-per-process",
        "--window-position=10000,10000",
      ],
      ignoreDefaultArgs: ["--enable-automation"],
    };

    if (this.task.useProxies) {
      const formattedProxy = this.getProxy(this.task.proxyGroup);
      const newProxyUrl = await proxyChain.anonymizeProxy(formattedProxy);

      opts.args.push(`--proxy-server=${newProxyUrl}`);
    }

    const browserSizes = [
      {
        width: 1366,
        height: 768,
        probability: 43.05,
      },
      {
        width: 1536,
        height: 864,
        probability: 7.92,
      },
      {
        width: 1440,
        height: 900,
        probability: 7.23,
      },
      {
        width: 1280,
        height: 720,
        probability: 4.46,
      },
    ];

    let viewport = (function () {
      for (let size of browserSizes) {
        if (Math.random() * 100 < size.probability) {
          delete size.probability;
          return size;
        }
      }
    })() || {
      // If nothing was chosen
      width: 1366,
      height: 768,
    };

    opts.args.push(`--window-size=${viewport.width},${viewport.height}`);

    // opts.args.push("--window-size=500,900")

    this.browser = await puppeteer.launch(opts);
    this.page = await this.browser.newPage();
    this.cursor = createCursor(this.page);

    // this.page.setIgnoreHTTPSErrors(true);

    await this.page.setViewport({
      height: viewport.height,
      width: viewport.width,
    });
  }
  /**
   * Function to change task status on frontend
   * ```js
   * this.updateStatus("Account created!", "green", --qtyLeft, true);
   * ```
   * @param {string} status Message to display
   * @param {string} color Color to display message in
   * @param {number} qtyLeft New quantity to set
   * @param {boolean} save Whether to save tasks again
   */
  updateStatus(status, color, qtyLeft, save = false) {
    console.log(`[${new Date().toISOString()}] ${status}`);

    let tasks = this.getUITask();
    tasks[this.id].statusColor = color;
    tasks[this.id].status = status;

    if (qtyLeft >= 0) tasks[this.id].quantityLeft = qtyLeft;

    Store.setTasks(tasks);

    if (save) {
      Store.saveTasks(tasks);
    }
  }

  /**
   * Stop task function
   */
  stopTask() {
    eventBus.emit(`stopTask_${this.id}`);

    let tasks = this.getUITask();
    tasks[this.id].status = "Stopped";
    tasks[this.id].running = false;

    Store.setTasks(tasks);
    Store.saveTasks(tasks);
  }

  /**
   * Set status to all tasks completed
   * @param {string} q Total quantity
   */
  completeTask(q) {
    let tasks = this.getUITask();

    this.updateStatus(`${q}/${q} Complete`, "green");

    tasks[this.id].running = false;

    Store.setTasks(tasks);
    Store.saveTasks(tasks);
  }

  /**
   * Check if task is stopped
   */
  checkStop() {
    let tasks = this.getUITask();
    return tasks[this.id].running;
  }

  /**
   * Get quantity remaining on task
   */
  getQtyLeft() {
    return this.getUITask()[this.id].quantityLeft;
  }

  /**
   * Update latest activity with account
   * @param {string} type Activity type to display
   * @param {string} site Site of account created
   * @param {string} email Email of account
   * @param {string} password Password of account
   * @param {boolean} sms Set to `true` if sms is enabled
   */
  updateDashCreate(type, site, email, password, sms) {
    let dashboard = Store.getDashboard();

    if (dashboard.latestActivity.length >= 50) {
      dashboard.latestActivity.pop();
    }

    dashboard.latestActivity.unshift({
      type: type,
      site: site,
      email: email,
      pass: password,
      date: Date.now(),
    });

    ++dashboard.accountsCreated;

    this.increment(site.toLowerCase());

    if (sms) {
      dashboard.smsUsed++;
      dashboard = this.updateCalendarSMS(dashboard);

      this.increment("smsUsed");
    }

    dashboard = this.updateCalendarCreate(dashboard);

    Store.setDashboard(dashboard);
  }

  /**
   * Update MongoDB database with newly created account
   * @param {string} site Site of account created
   */
  async increment(site) {
    try {
      await axios({
        url: `https://[removed]/api/v1/add/${site}`,
        params: {
          userId: this.discordId,
        },
        headers: {
          Authorization: "2af0957d-ef56-4255-a080-9d8f93b15000",
        },
        method: "POST",
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Update calendar with new account created
   * @param {object} dashboard Dashboard object
   */
  updateCalendarCreate(dashboard) {
    let hour = moment().format("hh:00 A");
    let day = moment().format("dddd");
    let month = moment().format("MMM");
    let year = moment().format("yyyy");

    let hourIndex = dashboard.accCreatedGraph.day.categories.indexOf(hour);
    let dayIndex = dashboard.accCreatedGraph.week.categories.indexOf(day);
    let monthIndex = dashboard.accCreatedGraph.month.categories.indexOf(month);
    let yearIndex = dashboard.accCreatedGraph.year.categories.indexOf(year);

    dashboard.accCreatedGraph.day.values[hourIndex]++;
    dashboard.accCreatedGraph.week.values[dayIndex]++;
    dashboard.accCreatedGraph.month.values[monthIndex]++;
    dashboard.accCreatedGraph.year.values[yearIndex]++;

    return dashboard;
  }

  /**
   * Update calendar with new sms used
   * @param {object} dashboard Dashboard object
   */
  updateCalendarSMS(dashboard) {
    let hour = moment().format("hh:00 A");
    let day = moment().format("dddd");
    let month = moment().format("MMM");
    let year = moment().format("yyyy");

    let hourIndex = dashboard.smsUsedGraph.day.categories.indexOf(hour);
    let dayIndex = dashboard.smsUsedGraph.week.categories.indexOf(day);
    let monthIndex = dashboard.smsUsedGraph.month.categories.indexOf(month);
    let yearIndex = dashboard.smsUsedGraph.year.categories.indexOf(year);

    dashboard.smsUsedGraph.day.values[hourIndex]++;
    dashboard.smsUsedGraph.week.values[dayIndex]++;
    dashboard.smsUsedGraph.month.values[monthIndex]++;
    dashboard.smsUsedGraph.year.values[yearIndex]++;

    return dashboard;
  }

  /**
   * Update dashboard with account failed
   * @param {boolean} sms
   */
  updateDashFail(sms) {
    let dashboard = Store.getDashboard();
    ++dashboard.accountsFailed;

    this.increment("failed");

    if (sms) {
      dashboard.smsUsed++;
      dashboard = this.updateCalendarSMS(dashboard);

      this.increment("smsUsed");
    }

    dashboard = this.updateCalendarFail(dashboard);

    Store.setDashboard(dashboard);
  }

  /**
   * Update calendar with new account failed
   * @param {object} dashboard Dashboard object
   */
  updateCalendarFail(dashboard) {
    let hour = moment().format("hh:00 A");
    let day = moment().format("dddd");
    let month = moment().format("MMM");
    let year = moment().format("yyyy");

    let hourIndex = dashboard.accountsFailedGraph.day.categories.indexOf(hour);
    let dayIndex = dashboard.accountsFailedGraph.week.categories.indexOf(day);
    let monthIndex =
      dashboard.accountsFailedGraph.month.categories.indexOf(month);
    let yearIndex = dashboard.accountsFailedGraph.year.categories.indexOf(year);

    dashboard.accountsFailedGraph.day.values[hourIndex]++;
    dashboard.accountsFailedGraph.week.values[dayIndex]++;
    dashboard.accountsFailedGraph.month.values[monthIndex]++;
    dashboard.accountsFailedGraph.year.values[yearIndex]++;

    return dashboard;
  }

  /**
   * Get OTP code from email box
   * @param {string} site Site to get OTP code from
   */
  async getOTP(site) {
    return new Promise((resolve, reject) => {
      try {
        const client = inbox.createConnection(false, this.emailServer, {
          secureConnection: true,
          auth: this.imapAuth,
        });

        client.connect();

        client.on("connect", function () {
          client.openMailbox("INBOX", async function (error, info) {
            if (error) throw error;

            client.on("new", async function (message) {
              console.log(message.to);
              if (
                message?.to[0]?.address?.toLowerCase() &&
                message?.to[0]?.address?.toLowerCase() == email.toLowerCase()
              ) {
                const messageStream = client.createMessageStream(message.UID);

                let parsed = await simpleParser(messageStream);

                let html = parsed.html;

                switch (site) {
                  case "amazon":
                    if (parsed.subject.includes("your new Amazon")) {
                      resolve(html.match(/(?<=otp">)(.*)(?=<\/p)/)[0].trim());
                    }
                    break;
                  case "footlocker":
                    if (parsed.subject.includes("Confirm your FLX")) {
                      resolve(html.split("activationToken=")[1].split("&")[0]);
                    }
                    break;
                  case "veve":
                    if (parsed.subject.includes("VE-VE")) {
                      resolve(
                        html
                          .match(/(?<="color:#0ecef1">)(.*)(?=<\/h2>)/)[0]
                          .trim(),
                      );
                    }
                    break;
                  default:
                    reject(`Unknown Site: ${site}`);
                    break;
                }

                client.close();

                client.on("close", function () {});
              }
            });
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   Get random proxy string from list
   * @param {string} listName Name of proxy list to use
  */
  getProxy(listName) {
    const proxyListObj = Store.getProxies().proxyList[listName];

    let proxyList = [];

    for (let p in proxyListObj) {
      proxyList.push(p);
    }

    let proxy = this.select.proxy(proxyList);

    let formattedProxy =
      proxy.user && proxy.pass
        ? `http://${proxy.user}:${proxy.pass}@${proxy.ip}:${proxy.port}`
        : `http://${proxy.ip}:${proxy.port}`;

    return formattedProxy;
  }

  /**
   Convert proxy object to string
   * @param {object} proxy Proxy object
  */
  proxyObjToFormatted(proxy) {
    return proxy.user && proxy.pass
      ? `http://${proxy.user}:${proxy.pass}@${proxy.ip}:${proxy.port}`
      : `http://${proxy.ip}:${proxy.port}`;
  }

  /**
   Get random proxy object
   * @param {string} listName Name of proxy list to use
  */
  getProxyObj(listName) {
    const proxyListObj = Store.getProxies().proxyList[listName];

    let proxyList = [];

    for (let p in proxyListObj) {
      proxyList.push(p);
    }

    this.proxyObj = this.select.proxy(proxyList);

    return this.proxyObj;
  }

  /**
   * Callback function for requests
   * @param {object} err Error to return (if any)
   * @param {object} resp Request response
   * @param {object} body Response body
   */
  callback(err, resp, body) {
    if (err) throw err;

    return {
      body,
      headers: resp.headers,
      statusCode: resp.statusCode,
    };
  }

  /**
   * Get random custom email from list
   * @param {string} listName Name of email list
   */
  getCustomEmail(listName) {
    const emailListObj = Store.getEmails();
    return emailListObj.emailList[listName][0];
  }

  /**
   * Write text to file
   * @param {string} text File contents
   * @param {string} type File type (e.g., `txt`, `html`, `json`)
   */
  writeLog(text, type) {
    fs.writeFileSync(`log.${type}`, text);
  }

  /**
   * Get length of email list
   * @param {string} listName Name of email lit to check
   */
  checkEmailGroupLength(listName) {
    const emailListObj = Store.getEmails();
    return emailListObj.emailList[listName].length;
  }

  /**
   * Delete email from email list
   * @param {string} listName Name of email lit to check
   * @param {string} email Email to remove from list
   */
  deleteUsedCustomEmail(listName, email) {
    const emailListObj = Store.getEmails();
    const index = emailListObj.emailList[listName].indexOf(email);
    emailListObj.emailList[listName].splice(index, 1);
    Store.setEmails(emailListObj);
  }

  /**
   * Add account to account group
   * ```js
   * this.addToGroup("nike", "Default Group", {
   *   email: "support@[removed]",
   *   password: "f1urryg3n",
   * });
   * ```
   * @param {string} site Site to add account to
   * @param {string} groupName Name of group to add account to
   * @param {object} account Account credentials
   */
  addToGroup(site, groupName, account) {
    if (groupName == "None") return;

    let accountList = Store.getAccounts();
    accountList[site][groupName].push(`${account?.email}:${account?.password}`);
    Store.setAccounts(accountList);
  }

  /**
   * Pause script for `ms` (must be awaited)
   * @param {number} ms Milliseconds to sleep for
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Choose random item from array
   * @param {array} choices Array to choose from
   */
  choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

  /**
   * Get random catchall email
   * @param {string} catchall Catchall domain without `@`
   */
  getCatchall(catchall) {
    return (
      `${faker.name.firstName()}${faker.name.lastName()}` +
      this.getRandomInt(1, 13000).toString() +
      `@${catchall}`
    )
      .toLowerCase()
      .replace(`'`, "");
  }

  /**
   * Get random email without catchall
   */
  getEmailPrefix() {
    return (
      `${faker.name.firstName()}${faker.name.lastName()}` +
      this.getRandomInt(1, 99999).toString()
    )
      .toLowerCase()
      .replace(`'`, "")
      .replace("@", "");
  }

  /**
   * Get random secure password
   */
  getPassword() {
    let pwdChars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let pwdLen = 10;
    let randPassword = Array(pwdLen)
      .fill(pwdChars)
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join("");

    return randPassword + "$1";
  }

  /**
   * Generate random UUID (v4)
   */
  uuid() {
    let ret = "",
      value;
    for (let i = 0; i < 32; i++) {
      value = (Math.random() * 16) | 0;
      if (i > 4 && i < 21 && !(i % 4)) {
        ret += "-";
      }
      ret += (i === 12 ? 4 : i === 16 ? (value & 3) | 8 : value).toString(16);
    }
    return ret;
  }

  /**
   * Get last item of array
   * @param {array} array Array to get last item of
   */
  getLastItem(array) {
    return array[array.length - 1];
  }

  /**
   * Get random integer between (and inclusive of) two values
   * @param {number} min Minimum value of number
   * @param {number} max Maximum value of number
   */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Get random string
   * @param {number} l Length of string
   * @param {number} mode I have no clue what this does but leave it blank
   */
  getRandomStr(l = 1, mode = "111") {
    if (mode === "000") return "";
    const r = (n) => Math.floor(Math.random() * n);
    const m = [...mode]
      .map((v, i) => parseInt(v, 10) * (i + 1))
      .filter(Boolean)
      .map((v) => v - 1);
    return [...new Array(l)].reduce(
      (a) =>
        a +
        String.fromCharCode(
          [48 + r(10), 65 + r(26), 97 + r(26)][m[r(m.length)]],
        ),
      "",
    );
  }

  /**
   * Convert string to boolean
   * @param {string} string String to convert
   */
  stringToBoolean(string) {
    string === "false" ? false : !!string;
  }
}
