import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, { name, proxiesEntered }) {
  let proxies = Store.getProxies();
  let cleanProxies = proxiesEntered.split("\n").map((k) => k.trim());

  for (let proxy of cleanProxies) {
    proxies.proxyList[name][proxy] = {
      proxy,
      status: "-",
      statusColor: "green",
    };
  }

  UI.update(Screens.PROXY, proxies);
  Store.setProxies(proxies);
}
