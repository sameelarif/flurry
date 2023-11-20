import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, data) {
  let profiles = Store.getProfiles();
  delete profiles[data.profileName];
  Store.setProfiles({});
  UI.update("PROFILES", profiles);
}
