import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, { name }) {
  let proxies = Store.getProxies();

  delete proxies.proxyList[name];
  UI.update(Screens.PROXY, proxies);
  Store.setProxies(proxies);
}
