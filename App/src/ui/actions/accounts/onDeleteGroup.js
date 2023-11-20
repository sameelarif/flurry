import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, { site, name }) {
  if (site && name) {
    let accounts = Store.getAccounts();
    delete accounts[site][name];
    UI.update(Screens.ACCOUNTS, accounts);
    Store.setAccounts(accounts);
  }
}
