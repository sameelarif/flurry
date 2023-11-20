import Store from "./../../../store/Store";

import onStartTask from "./onStartTask";

export default function (e) {
  let tasks = Store.getTasks();

  for (let task of Object.keys(tasks)) {
    if (!task.running) {
      console.log("Started task " + task);
      onStartTask(e, task);
    }
  }
}
