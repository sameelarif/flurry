const axios = require("axios").default;

// get key and set it equal to const key

exports.recaptchatwo = async (service, country) => {
  let data = {};

  await axios
    .get(`https://api.anti-captcha.com/createTask`, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${key}`,
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.status == 200 && response.data.id) {
        data["status"] = "OK";
        data["id"] = response.data.id;
        data["number"] = response.data.phone;
      } else {
        data["status"] = "ERR";
        data["message"] = `Message from 5sim: ${response.data}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from 5Sim", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  return data;
};
