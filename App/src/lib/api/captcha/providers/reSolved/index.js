import axios from "axios";
import delay from "delay";

import STATUS from "./statuses";

export default class {
  constructor(apiKey) {
    this.apiKey = apiKey;

    this.tasks = new Object();
  }

  static getTask(taskId) {
    return this.tasks[taskId];
  }

  async getV2Token(siteKey, siteUrl, isEnterprise, proxy) {
    const taskId = await this.startV2(siteKey, siteUrl, isEnterprise, proxy);

    let token = await this.getV2(taskId);

    while (!token) {
      console.log("Solving...");

      await delay(3000);

      token = await this.getV2(taskId);
    }

    return token;
  }

  async startV2(siteKey, siteUrl, isEnterprise, proxy) {
    const resp = await axios(
      "https://tasks.resolved.gg/api/v1/recaptcha/new-task",
      {
        method: "POST",
        data: {
          proxy: proxy ? proxy : undefined,
          user_api_key: this.apiKey,
          site_url: siteUrl,
          site_key: siteKey,
          captcha_version: "V2",
          enterprise: isEnterprise,
          "render-params": {},
        },
        responseType: "json",
      },
    );

    const data = resp.data;

    this.tasks[data.data.taskID] = data;

    return data.data.taskID;
  }

  async getV2(taskId) {
    const resp = await axios(
      "https://tasks.resolved.gg/api/v1/get-task-by-id",
      {
        method: "POST",
        data: {
          user_api_key: this.apiKey,
          taskID: taskId,
        },
        responseType: "json",
      },
    );

    const data = resp.data;

    if (data.data.task.status == STATUS.solved)
      return data.data.task.tokenValue;
    else if (data.data.task.status == STATUS.unsolvable)
      throw new Error("Captcha unsolvable");
    else return false;
  }
}

// const task = new reSolved('db666590a33d338d88d83fd2f3e27f');

// task.getV2Token('6LePTyoUAAAAADPttQg1At44EFCygqxZYzgleaKp', 'https://footlocker.queue-it.net/', false, false).then((token) => {
//   console.log(token);
// })
