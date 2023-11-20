import UI from "./../ui/UI";

import Screens from "./../ui/constants/screens";
import Defaults from "./../store/_devDefault";
/**
 * Put the task creation/management logic you use here clustering / spawning childprocess as per your applications needs
 * below is an exmaple of how your task would work with the UI api.
 *
 */

class TasksManager {
  constructor(store) {
    this.store = store;
    this.tasks = store.get("tasks") || Defaults.tasks;
    // this.proxy = store.getProxies();
    // this.profiles = store.getProfiles();
  }

  getTasks() {
    return this.tasks;
  }

  render() {
    UI.update(Screens.TASKS, this.getTasks());
  }

  set(tasks) {
    this.tasks = tasks;
  }

  //It is expected that you may need proxy, profile data access directly later in your tasks
  //So they are stored on cache from the config file to make accesses rapid for cases of bulk task creation
  //The cache is updated everytime the user opens the tasks page. (i.e they can not make profile, proxy changes while the task page is open)
  //Note you do not have to manually access this values in most cases as they are accessed and properly utilized already by us on the task creation process.
  cacheEssentials() {
    this.accounts = this.store.get("accounts");
    this.profiles = this.store.get("profiles");
  }
}

export default TasksManager;
