import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, { name }) {
  let proxies = Store.getProxies();

  const list = proxies.proxyList[name];
  const newList = {};

  for (const key in list) {
    if (list[key]?.statusColor === "red") continue;
    newList[key] = list[key];
  }

  proxies.proxyList[name] = newList;

  UI.update(Screens.PROXY, proxies);
  Store.setProxies(proxies);
}
