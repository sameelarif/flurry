const axios = require("axios");
const delay = require("delay");

exports.getNumber = async (service, country, key) => {
  let data = {};

  await axios
    .get(`https://onlinesim.ru/api/getNum.php`, {
      headers: {
        accept: "application/json",
      },
      params: {
        apikey: key,
        service: service,
        country: country,
        number: true,
      },
      validateStatus: false,
    })
    .then(async (response) => {
      if (response.status == 200 && response.data.tzid) {
        data["status"] = "OK";
        data["id"] = response.data.tzid;
        data["number"] = response.data.number;
      } else {
        data["status"] = "ERR";
        data["message"] = `Message from OnlineSim: ${response.data.response}`;
      }
    })
    .catch((err) => {
      console.log("Error requesting number from OnlineSim", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  return data;
};

exports.getCode = async (id, key) => {
  return new Promise(async (resolve, reject) => {
    let data = {};

    let startTime = Date.now();

    while (!data.code) {
      if ((Date.now() - startTime) / 1000 < 90) {
        await delay(8000);

        axios
          .get(`https://onlinesim.ru/api/getState.php`, {
            headers: {
              accept: "application/json",
            },
            params: {
              apikey: key,
              tzid: id,
              message_to_code: 1,
            },
            validateStatus: false,
          })
          .then(async (response) => {
            console.log(response.data);
            if (response.status == 200) {
              if (response?.data[0]?.response == "TZ_NUM_ANSWER") {
                data["status"] = "OK";
                data["code"] = response.data[0].msg;

                resolve(data);
                return;
              } else if (response?.data[0]?.response == "TZ_NUM_WAIT") {
                await delay(3000);
              } else {
                data["status"] = "ERR";
                data["message"] = `Message from OnlineSim: ${
                  response?.data?.response || response?.data[0]?.response
                }`;

                resolve(data);
                return;
              }
            } else {
              data["status"] = "ERR";
              data[
                "message"
              ] = `Message from OnlineSim: ${response.data.response}`;

              resolve(data);
              return;
            }

            this.cancel(id, key, 1);
          })
          .catch((err) => {
            console.log("Error requesting code from OnlineSim", err);
            data["status"] = "ERR";
            data["message"] = err.toString();

            resolve(data);

            this.cancel(id, key, 1);

            return;
          });
      } else {
        resolve({ status: "ERR", message: "Timed Out" });
        return;
      }
    }
  });
};

exports.finalize = async (id, key, ban = 0) => {
  let data = {};

  axios
    .get(`https://onlinesim.ru/api/setOperationOk.php`, {
      headers: {
        accept: "application/json",
      },
      params: {
        apikey: key,
        tzid: id,
        ban,
      },
      validateStatus: false,
    })
    .then(async (response) => {
      console.log(response.data);
      if (response.status == 200) {
        data["status"] = "OK";
      } else {
        data["status"] = "ERR";
        data["message"] = `Message from OnlineSim: ${response.data.response}`;
      }
    })
    .catch((err) => {
      console.log("Error finalizing order from OnlineSim", err);
      data["status"] = "ERR";
      data["message"] = err.toString();
    });

  return data;
};

// Same thing as finalize
exports.cancel = this.finalize;
