// import task from "../actions/Tasks/task";
import Store from "./../../store/Store";

export default {
  onDashboardLoad,
  onSettingsLoad,
  onProxiesLoad,
  onAccountsLoad,
  onTasksLoad,
  loadTasksOptions,
  onAuthLoad,
  onProfilesLoad,
  //   loadTasksOptions,
};

async function onDashboardLoad() {
  return Store.getDashboard();
}

async function onAuthLoad() {
  return Store.getAuth();
}

async function onSettingsLoad() {
  return Store.getSettings();
}

async function onProfilesLoad() {
  return Store.getProfiles();
}

async function onProxiesLoad() {
  return Store.getProxies();
}

async function onAccountsLoad() {
  return Store.getAccounts();
}

async function onTasksLoad() {
  Store.tasks.cacheEssentials();
  return Store.getTasks();
}

async function loadTasksOptions() {
  // let proxies = Object.keys(Store.getProxies());
  // let profiles = Store.getProfiles();
  let accounts = Store.getAccounts();
  let proxies = Store.getProxies();

  // let profileOptions = [];
  // let profileCategories = Object.keys(profiles);
  // for (let categoryNames of profileCategories) {
  //   profileOptions = [
  //     ...profileOptions,
  //     ...Object.keys(profiles[categoryNames].profiles).map(
  //       (k) => `${categoryNames} » ${k}`
  //     ),
  //   ];

  return {
    accounts,
    proxyList: proxies.proxyList,
    emailList: proxies.emailList,
  };
}

//   let taskPage = {
//     proxyOptions: proxies,
//     profileOptions,
//   };

//   return taskPage;
// }
