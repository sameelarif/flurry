import { ipcRenderer } from "electron";

// eslint-disable-next-line import/no-anonymous-default-export
export default function(screen) {
  return (actionName, data, mode) => {
    ipcRenderer.send(`${screen}-${actionName}`, data, mode);
  };
}
