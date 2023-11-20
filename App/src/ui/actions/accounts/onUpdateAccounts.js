import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, { site, name, accountsEntered }) {
  if (site && name) {
    let cleanAccounts = accountsEntered.split("\n").map((k) => k.trim());
    let accounts = Store.getAccounts();
    accounts[site][name] = cleanAccounts;
    UI.update(Screens.ACCOUNTS, accounts);
    Store.setAccounts(accounts);
  }

  //   accounts[site][name] = [];
  //   UI.update(Screens.ACCOUNTS, accounts);
  //   Store.setAccounts(accounts);
  //   let settings = Store.getAccounts();
  //   settings.captcha = data;
  //   UI.update(Screens.SETTINGS, settings);
  //   console.log(data);
  //   Store.setSettings(settings);
}
