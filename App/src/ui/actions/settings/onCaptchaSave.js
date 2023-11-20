import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, data) {
  let settings = Store.getSettings();

  settings.captcha = data;
  UI.update(Screens.SETTINGS, settings);
  console.log(data);
  Store.setSettings(settings);
}
