const rp = require("request-promise");
const delay = require("delay");

exports.getNumber = async (service, country, key) => {
  const sms = new fivesim(key);
  const resp = await sms.getNumber(service, country);
};

exports.getCode = async (id, key, retries) => {
  const sms = new fivesim(key);
  const resp = await sms.getCode(id);
};

exports.cancel = async (id, key, retries) => {
  const sms = new fivesim(key);
  const resp = await sms.cancel(id);
};

exports.finalize = async (id, key) => {
  const sms = new fivesim(key);
  const resp = await sms.finalize(id);
};

class fivesim {
  constructor(key) {
    this.session = axios.create({
      timeout: 3000,
      headers: { accept: "application/json", authorization: `Bearer ${key}` },
    });
  }

  async getNumber(country, service) {
    const res = await this.session({
      url: `https://5sim.net/v1/user/buy/activation/${country}/any/${service}`,
      method: "GET",
      validateStatus: false,
    })
      .then(async (response) => {
        if (response.status == 200) {
          data["status"] = "OK";
        } else {
          data["status"] = "ERR";
          data["message"] = `Message from 5sim: ${response.data}`;
        }
      })
      .catch((err) => {
        console.log("Error finalizing order from 5Sim", err);
        data["status"] = "ERR";
        data["message"] = err.toString();
      });

    //   data["id"] = response.data.id;
    //   data["number"] = response.data.phone;
  }

  async getCode(id) {
    const res = await this.session({
      url: `https://5sim.net/v1/user/check/${id}`,
      method: "GET",
      validateStatus: false,
    })
      .then(async (response) => {
        if (response.status == 200) {
          data["status"] = "OK";
        } else {
          data["status"] = "ERR";
          data["message"] = `Message from 5sim: ${response.data}`;
        }
      })
      .catch((err) => {
        console.log("Error finalizing order from 5Sim", err);
        data["status"] = "ERR";
        data["message"] = err.toString();
      });

    // if (
    //   response.data.status == "RECEIVED" &&
    //   response.data.sms.length > 0
    // ) {
    //   data["status"] = "OK";
    //   data["code"] = response.data.sms[0].code;

    //   loop = true;
    // }
  }

  async cancel(id) {
    const res = await this.session({
      url: `https://5sim.net/v1/user/cancel/${id}`,
      method: "GET",
      validateStatus: false,
    });

    return res;
  }

  async finalize(id) {
    const res = await this.session({
      url: `https://5sim.net/v1/user/check/${id}`,
      method: "GET",
      validateStatus: false,
    });

    return res;
  }
}
