import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

import request from "request-promise";

export default async function (e, { name, proxy, testURL }) {
  let proxies = Store.getProxies();
  proxies.proxyList[name][proxy]["status"] = "Checking proxy";
  proxies.proxyList[name][proxy]["statusColor"] = `blue`;
  UI.update(Screens.PROXY, proxies);
  Store.setProxies(proxies);

  let speed = await testProxy(proxies.proxyList[name][proxy].proxy, testURL);

  if (speed == "Error") {
    let proxies = Store.getProxies();
    proxies.proxyList[name][proxy]["status"] = speed;
    proxies.proxyList[name][proxy]["statusColor"] = `red`;
    UI.update(Screens.PROXY, proxies);
    Store.setProxies(proxies);
  } else {
    let proxies = Store.getProxies();
    proxies.proxyList[name][proxy]["status"] = `${speed}ms`;
    proxies.proxyList[name][proxy]["statusColor"] = `green`;
    UI.update(Screens.PROXY, proxies);
    Store.setProxies(proxies);
  }

  async function testProxy(proxy, testUrl) {
    const start_timestamp = Date.now();
    let returnSpeed;

    proxy = parseProxy(proxy);

    try {
      let res = await request({
        url: testUrl ? testUrl : "http://www.google.com",
        method: "GET",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
        },
        timeout: 10000,
        strictSSL: false,
        withCredentials: true,
        resolveWithFullResponse: true,
        proxy: proxy,
      });

      if (res.statusCode == 200) {
        returnSpeed = Date.now() - start_timestamp;
      }
    } catch (e) {
      returnSpeed = "Error";
    }

    return returnSpeed;
  }

  function parseProxy(proxy) {
    let ip, port, user, pass;

    switch (proxy.match(/:/g).length) {
      case 1:
        [ip, port] = proxy.split(":");
      //return {ip, port}
      case 3:
        [ip, port, user, pass] = proxy.split(":");
      //return {ip, port, user, pass}
    }

    return user && pass
      ? `http://${user}:${pass}@${ip}:${port}`
      : `http://${ip}:${port}`;
  }
}
