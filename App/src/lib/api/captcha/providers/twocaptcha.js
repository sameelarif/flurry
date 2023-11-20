import axios from "axios";
import delay from "delay";

import Store from "../../../../store/Store";

// get key and set it equal to const key

const checkStop = (id) => {
  let tasks = Store.getTasks();
  return tasks[id].running;
};

const recaptchatwo = async (id, key, sitekey, URL) => {
  if (!checkStop(id)) {
    return null;
  }

  let data = {};

  await axios
    .get(`http://2captcha.com/in.php`, {
      params: {
        key: key,
        method: "userrecaptcha",
        googlekey: sitekey,
        pageurl: URL,
        json: 1,
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.data.status == 1) {
        data["status"] = "OK";
        data["id"] = response.data.request;
      } else {
        data["status"] = "ERR";
        data["message"] = `Message from 2Captcha: ${response.data}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from 2Captcha", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  return data;
};

const recaptchathree = async (id, key, sitekey, action, URL) => {
  console.log(id, key, sitekey, action, URL);
  let data = {};

  if (!checkStop(id)) {
    return null;
  }

  await axios
    .get(`http://2captcha.com/in.php`, {
      params: {
        key: key,
        method: "userrecaptcha",
        version: "v3",
        action: action,
        googlekey: sitekey,
        pageurl: URL,
        json: 1,
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.data.status == 1) {
        data["status"] = "OK";
        data["id"] = response.data.request;
      } else {
        console.log(response.data);
        data["status"] = "ERR";
        data["message"] = `Message from 2Captcha: ${response.data}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from 2Captcha", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  let capToken;

  while (!capToken && checkStop(id)) {
    const response = await axios.get("http://2captcha.com/res.php", {
      params: {
        key: key,
        action: "get",
        id: data.id,
        json: 1,
      },
      validateStatus: false,
    });

    console.log(response.data);

    const { status, request } = response.data;

    if (status == 1) {
      capToken = request;
    } else if (request.includes("ERROR")) {
      return null;
    } else {
      await delay(5000);
    }
  }

  return capToken;
};

const funcaptcha = async (id, key, publickey, surl, URL) => {
  console.log(id, key, publickey, surl, URL);
  let data = {};

  if (!checkStop(id)) {
    return null;
  }

  await axios
    .get(`http://2captcha.com/in.php`, {
      params: {
        key: key,
        method: "funcaptcha",
        publickey: publickey,
        surl: surl,
        pageurl: URL,
        json: 1,
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.data.status == 1) {
        data["status"] = "OK";
        data["id"] = response.data.request;
      } else {
        console.log(response.data);
        data["status"] = "ERR";
        data["message"] = `Message from 2Captcha: ${response.data}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from 2Captcha", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  let capToken;

  while (!capToken && checkStop(id)) {
    const response = await axios.get("http://2captcha.com/res.php", {
      params: {
        key: key,
        action: "get",
        id: data.id,
        json: 1,
      },
      validateStatus: false,
    });

    console.log(response.data);

    const { status, request } = response.data;

    if (status == 1) {
      capToken = request;
    } else if (request.includes("ERROR")) {
      return null;
    } else {
      await delay(5000);
    }
  }

  return capToken;
};

const geetest = async (gt, challenge, server, URL) => {
  let data = {};

  await axios
    .get(`http://2captcha.com/in.php`, {
      params: {
        key: key,
        method: "geetest",
        gt: gt,
        challenge: challenge,
        api_server: server,
        pageurl: URL,
        json: 1,
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.data.status == 1) {
        data["status"] = "OK";
        data["id"] = response.data.request;
      } else {
        data["status"] = "ERR";
        data["message"] = `Message from 2Captcha: ${response.data}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from 2Captcha", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  return data;
};

export default {
  recaptchatwo,
  recaptchathree,
  funcaptcha,
  geetest,
};
