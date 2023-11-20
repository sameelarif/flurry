import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, { name, emails }) {
  let proxies = Store.getProxies();

  let cleanEmails = emails
    .split("\n")
    .map((k) => k.trim())
    .filter((k) => k != "");

  proxies.emailList[name] = cleanEmails;

  UI.update(Screens.PROXY, proxies);
  Store.setProxies(proxies);
}
