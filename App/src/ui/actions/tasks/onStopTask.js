import Store from "./../../../store/Store";

import eventBus from "../../../lib/tools/Events_Bus";

export default function (e, id) {
  console.log(`Stop button clicked for task ${id}`);

  eventBus.emit(`stopTask_${id}`);

  let tasks = Store.getTasks();

  if (tasks[id].running) {
    tasks[id].running = false;
    tasks[id].status = "Stopped";
    tasks[id].statusColor = "red";
    Store.setTasks(tasks);
    Store.saveTasks(tasks);
  }
}
