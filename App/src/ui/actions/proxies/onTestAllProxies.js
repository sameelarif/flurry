import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

import onTestProxy from "./onTestProxy";

export default function (e, { groupName, testURL }) {
  let proxies = Store.getProxies();

  if (groupName && proxies.proxyList[groupName]) {
    for (let proxy of Object.keys(proxies.proxyList[groupName])) {
      //Add a delay

      setTimeout(() => {
        onTestProxy(e, {
          name: groupName,
          proxy,
          testURL,
        });
      }, 500);
    }
  }
  //Mass test proxies
}
