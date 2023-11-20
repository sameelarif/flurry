import axios from "axios";
import delay from "delay";

import Store from "../../../../store/Store";

// get key and set it equal to const key

const checkStop = (id) => {
  let tasks = Store.getTasks();
  return tasks[id].running;
};

const recaptchathree = async (id, key, sitekey, action, URL) => {
  let data = {};

  if (!checkStop(id)) {
    return null;
  }

  await axios
    .get("https://api.capmonster.cloud/createTask", {
      data: {
        clientKey: key,
        task: {
          type: "RecaptchaV3TaskProxyless",
          websiteURL: URL,
          websiteKey: sitekey,
          minScore: 0.3,
          pageAction: action,
        },
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.data.errorId == 0) {
        data["status"] = "OK";
        data["id"] = response.data.taskId;
      } else {
        console.log(response.data);
        data["status"] = "ERR";
        data["message"] = `Message from CapMonster: ${response.data}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from CapMonster", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  let capToken;

  while (!capToken && checkStop(id)) {
    const response = await axios.get(
      "https://api.capmonster.cloud/getTaskResult ",
      {
        data: {
          clientKey: key,
          taskId: data.id,
        },
        validateStatus: false,
      },
    );

    console.log(response.data);

    const { solution } = response.data;

    if (solution) {
      capToken = solution.gRecaptchaResponse;
    } else {
      await delay(5000);
    }
  }

  return capToken;
};

const funcaptcha = async (id, key, publickey, surl, URL) => {
  let data = {};

  if (!checkStop(id)) {
    return null;
  }

  await axios
    .get("https://api.capmonster.cloud/createTask", {
      data: {
        clientKey: key,
        task: {
          type: "FunCaptchaTaskProxyless",
          websiteURL: URL,
          websitePublicKey: publickey,
        },
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.data.errorId == 0) {
        data["status"] = "OK";
        data["id"] = response.data.taskId;
      } else {
        console.log(response.data);
        data["status"] = "ERR";
        data["message"] = `Message from CapMonster: ${response.data}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from CapMonster", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  let capToken;

  while (!capToken && checkStop(id)) {
    const response = await axios.get(
      "https://api.capmonster.cloud/getTaskResult ",
      {
        data: {
          clientKey: key,
          taskId: data.id,
        },
        validateStatus: false,
      },
    );

    console.log(response.data);

    const { token, errorId } = response.data;

    if (token) {
      capToken = token;
    } else if (errorId == 1) {
      console.log(response.data.errorDescription);

      return null;
    } else {
      await delay(5000);
    }
  }

  return capToken;
};

const geetest = async (gt, challenge, server, URL, userAgent) => {
  let data = {};

  if (!checkStop(id)) {
    return null;
  }

  await axios
    .get("https://api.capmonster.cloud/createTask", {
      data: {
        clientKey: key,
        task: {
          type: "GeeTestTaskProxyless",
          websiteURL: URL,
          gt: gt,
          challenge: challenge,
          geetestApiServerSubdomain: server,
          userAgent: userAgent,
        },
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.data.errorId == 0) {
        data["status"] = "OK";
        data["id"] = response.data.taskId;
      } else {
        console.log(response.data);
        data["status"] = "ERR";
        data["message"] = `Message from CapMonster: ${response.data}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from CapMonster", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  let capToken;

  while (!capToken && checkStop(id)) {
    const response = await axios.get(
      "https://api.capmonster.cloud/getTaskResult ",
      {
        data: {
          clientKey: key,
          taskId: data.id,
        },
        validateStatus: false,
      },
    );

    console.log(response.data);

    const { token } = response.data;

    if (token) {
      capToken = token;
    } else {
      await delay(5000);
    }
  }

  return capToken;
};

export default {
  recaptchathree,
  funcaptcha,
  geetest,
};
