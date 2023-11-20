const { net, remote, session } = require("electron");
const tough = require("tough-cookie");
const qs = require("qs");
const uuid = require("uuid-v4");
const merge = require("deepmerge");

// This class utilizes electron's net module to make requests look like a browser is making them.

module.exports = class {
  constructor(opts) {
    if (!opts) opts = {};

    this.jar = opts.jar || new tough.CookieJar();

    this.defaultHeaders = {};

    if (process && process.type === "renderer") {
      this.session = remote.session;
    } else {
      this.session = session.fromPartition(`persist:${uuid()}`);
    }

    if (opts.proxy) {
      this.proxyObj = opts.proxy;

      this.setProxy();
    } else if (process.env.mode == "PRODUCTION") {
      this.setProxyIsLocal();
    }
  }

  async setProxy() {
    try {
      const proxyConfig = {
        proxyRules: `${this.proxyObj.ip}:${this.proxyObj.port}`,
        proxyBypassRules: "<local>",
      };

      await this.session.setProxy(proxyConfig);
    } catch (e) {
      console.log(e);
    }
  }

  async setProxyIsLocal() {
    try {
      const proxyConfig = {
        proxyRules: "",
        proxyBypassRules: "<-loopback>",
      };

      await this.session.setProxy(proxyConfig);
    } catch (e) {
      console.log(e);
    }
  }

  async post(opts) {
    return await this._request({
      method: "POST",
      ...opts,
    });
  }

  async patch(opts) {
    return await this._request({
      method: "PATCH",
      ...opts,
    });
  }

  async get(opts) {
    if (typeof opts === "string") {
      return await this._request({
        url: opts,
      });
    } else {
      return await this._request({
        method: "POST",
        ...opts,
      });
    }
  }

  async _request(
    options,
    callback = (err, resp, body) => {
      if (err) throw err;

      return {
        body,
        headers: resp.headers,
        statusCode: resp.statusCode,
        finalUrl: resp.finalUrl,
      };
    },
  ) {
    try {
      return new Promise((resolve, reject) => {
        this.session.webRequest.onBeforeRedirect(({ redirectURL }) => {
          this.finalUrl = redirectURL;
        });

        if (!options.timeout) {
          options.timeout = 30000;
        }

        if (!options.headers) options.headers = {};

        options.jar = this.jar || (this.jar = new tough.CookieJar());

        if (options.qs || options.params || options.query) {
          options.url +=
            "?" +
            encodeURI(
              qs.stringify(options.qs || options.params || options.query),
            );
        }

        if (options.form) {
          options.body = qs.stringify(options.form);
        }

        try {
          if (typeof options.body == "object") {
            options.body = JSON.parse(options.body);
          }
        } catch {}

        if (this.session) options.session = this.session;

        const request = net.request(options);

        if (!options.method) {
          if (options.body || options.form) options.method = "POST";
          else options.method = "GET";
        }

        const { origin } = new URL(options.url);

        if (!options.headers.cookie) {
          this.jar.getCookies(origin, (err, cookies) => {
            if (err) console.log(err);

            let cookiesHeader = "";

            cookies.forEach((cookie) => {
              if (!options?.excludeCookies?.includes(cookie.key)) {
                cookiesHeader += `${cookie.key}=${cookie.value}; `;
              }
            });

            if (options.addToCookieString) {
              cookiesHeader += options.addToCookieString;
            }

            cookiesHeader = cookiesHeader.substring(
              0,
              cookiesHeader.length - 2,
            );

            options.headers["cookie"] = cookiesHeader;
          });
        }

        options.headers = merge(this.defaultHeaders, options.headers);

        for (let header in options.headers) {
          request.setHeader(header, options.headers[header]);
        }

        let body = "";

        request.on("response", (response) => {
          if (this.finalUrl) {
            response.finalUrl = this.finalUrl;
          }
          if (options.jar && response.headers["set-cookie"]) {
            let cookies;

            if (response.headers["set-cookie"] instanceof Array)
              cookies = response.headers["set-cookie"].map(tough.Cookie.parse);
            else cookies = [tough.Cookie.parse(response.headers["set-cookie"])];

            cookies.forEach((cookie) => {
              try {
                let set = this.jar.setCookie(cookie.toString(), origin);
                set.catch(() => {});
              } catch {}
            });
          }

          response.on("data", (chunk) => {
            body += chunk.toString();
          });

          response.on("end", () => {
            if (options.resolveWithFullResponse === false) {
              return resolve(callback(null, null, body));
            } else {
              return resolve(callback(response.error, response, body));
            }
          });
        });

        if (options.body) {
          request.write(options.body);
        }

        request.on("login", (authInfo, callback) => {
          callback(this.proxyObj.user, this.proxyObj.pass);
        });

        request.on("error", (err) => {
          return reject(callback(err, null, null));
        });

        request.end();
      });
    } catch (e) {
      return reject(e);
    }
  }

  getCookieValue(name, url) {
    return this.jar.getCookiesSync(url).filter((_) => _.key == name)[0].value;
  }

  getCookie(name, url) {
    return this.jar.getCookiesSync(url).filter((_) => _.key == name)[0];
  }

  getCookieString() {
    return this.jar.getCookieStringSync();
  }

  setCookie(name, value, url) {
    return this.jar.setCookie(
      new tough.Cookie({ key: name, value }).toString(),
      url,
    );
  }
};
