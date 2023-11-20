import Store from "./../../../store/Store";

export default function (e, id) {
  console.log(id);

  let tasks = Store.getTasks();

  if (tasks[id].running) {
    //Stop the task
  }

  delete tasks[id];
  Store.setTasks(tasks);
  Store.saveTasks(tasks);
}
