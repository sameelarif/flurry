import Store from "./../../../store/Store";

export default function () {
  let tasks = Store.getTasks();

  for (let task of Object.keys(tasks)) {
    if (task.running) {
      //Shut the running task down here first
    }
  }

  tasks = {};
  Store.setTasks(tasks);
  Store.saveTasks(tasks);
}
