import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

export default function (e, data) {
  let profiles = Store.getProfiles();
  console.log(profiles);
  profiles[data.profileName] = data;
  Store.setProfiles(profiles);
  UI.update("PROFILES", profiles);
}
