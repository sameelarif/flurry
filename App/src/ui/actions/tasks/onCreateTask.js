import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";
import task from "./task";
import { v4 as uuidv4 } from "uuid";
import { copyFileSync } from "original-fs";

export default function (e, data, editMode) {
  let tasks = Store.getTasks();

  console.log(data);

  if (!editMode) {
    let uId = uuidv4();
    tasks[uId] = {
      ...data,
      id: uId,
      quantityLeft: data.quantity,
      status: "Idle",
      statusColor: "blue",
      running: false,
    };
  } else {
    tasks[editMode] = Object.assign(tasks[editMode], data, {
      quantityLeft: data.quantity,
    });
  }

  Store.setTasks(tasks);
  Store.saveTasks(tasks);
}
