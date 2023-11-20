const delay = require("delay");
const request = require("request-promise");

exports.getNumber = async (service, country, key) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Request the number
      const numberResponse = await request({
        url: `https://api.sms-activate.org/stubs/handler_api.php`,
        method: "POST",
        qs: {
          action: "getNumber",
          api_key: key,
          service: service,
          country: country,
          forward: 0,
        },
        simple: false,
      });

      // Check if there was any response
      if (numberResponse) {
        // Check for various errors in response

        if (errors.includes(numberResponse.toString())) {
          // Parse error code from response and return
          resolve({
            status: "ERR",
            message: numberResponse.toString(),
          });
        } else {
          const parsedNumberResponse = numberResponse.split(":");

          const id = parsedNumberResponse[1].toString();
          const number = parsedNumberResponse[2].toString();

          await delay(2000);

          const statusResponse = await request({
            url: `https://api.sms-activate.org/stubs/handler_api.php`,
            method: "POST",
            qs: {
              api_key: key,
              action: "setStatus",
              id: id,
              status: 1,
            },
            simple: false,
          });

          if (statusResponse) {
            resolve({
              status: "OK",
              message: "Successfully Got Number",
              number: number,
              id: id,
            });
          } else {
            resolve({ status: "ERR", message: "SMS-Activate Error" });
          }
        }
      } else {
        resolve({ status: "ERR", message: "SMS-Activate Error" });
      }
    } catch (e) {
      resolve({ status: "ERR", message: "SMS-Activate Error" });
    }
  });
};

exports.getCode = async (id, key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const startTime = Date.now();

      while (true) {
        await delay(10000);
        if ((Date.now() - startTime) / 1000 < 180) {
          // Request the number
          const codeResponse = await request({
            url: `https://api.sms-activate.org/stubs/handler_api.php`,
            method: "POST",
            qs: {
              action: "getStatus",
              api_key: key,
              id: id,
            },
            simple: false,
          });

          if (codeResponse) {
            if (errors.includes(codeResponse.toString())) {
              // Parse error code from response and return
              resolve({
                status: "ERR",
                message: codeResponse.toString(),
              });
            } else {
              if (codeResponse.includes("STATUS_WAIT_CODE")) {
                console.log("Polling");
              } else {
                const parsedCodeResponse = codeResponse.split(":");
                const code = parsedCodeResponse[1].toString();

                resolve({
                  status: "OK",
                  message: "Successfully Got Code",
                  code: code,
                });
              }
            }
          }
        } else {
          resolve({ status: "ERR", message: "Timed Out" });
        }
      }
    } catch (e) {
      resolve({ status: "ERR", message: "SMS-Activate Error" });
    }
  });
};

exports.cancel = async (id, key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cancelResponse = await request({
        url: `https://api.sms-activate.org/stubs/handler_api.php`,
        method: "POST",
        qs: {
          api_key: key,
          action: "setStatus",
          id: id,
          status: 8,
        },
        simple: false,
      });

      if (cancelResponse) {
        if (errors.includes(cancelResponse.toString())) {
          // Parse error code from response and return
          resolve({
            status: "ERR",
            message: cancelResponse.toString(),
          });
        } else {
          resolve({
            status: "OK",
            message: "Successfully Cancelled Number",
          });
        }
      } else {
        throw "Request Error";
      }
    } catch (e) {
      resolve({ status: "ERR", message: "Request Error" });
    }
  });
};

exports.finalize = async (id, key) => {
  return new Promise(async (resolve, reject) => {
    const finalizeResponse = await request({
      url: `https://api.sms-activate.org/stubs/handler_api.php`,
      method: "POST",
      qs: {
        api_key: key,
        action: "setStatus",
        id: id,
        status: 6,
      },
      simple: false,
    });

    if (finalizeResponse) {
      if (errors.includes(finalizeResponse.toString())) {
        // Parse error code from response and return
        resolve({
          status: "ERR",
          message: finalizeResponse.toString(),
        });
      } else {
        resolve({
          status: "OK",
          message: "Successfully Finalized Number",
        });
      }
    } else {
      throw "Request Error";
    }
  });
};

const errors = [
  "BAD_KEY",
  "ERROR_SQL",
  "NO_BALANCE",
  "NO_NUMBERS",
  "BAD_STATUS",
  "BAD_SERVICE",
  "NO_ACTIVATION",
  "BANNED",
  "NO_ID_RENT",
  "INCORECT_STATUS",
  "CANT_CANCEL",
  "INVALID_PHONE",
  "ALREADY_FINISH",
  "ALREADY_CANCEL",
  "STATUS_CANCEL",
];
