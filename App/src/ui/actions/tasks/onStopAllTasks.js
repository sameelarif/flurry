import Store from "./../../../store/Store";

import onStopTask from "./onStopTask";

export default function (e) {
  let tasks = Store.getTasks();

  Object.entries(tasks).forEach(function (taskEntry) {
    let [taskId, taskObj] = taskEntry;

    if (taskObj.running) {
      onStopTask(e, taskId);
    }
  });
}
