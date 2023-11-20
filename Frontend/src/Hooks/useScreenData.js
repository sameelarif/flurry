import { useState, useEffect } from "react";

import { ipcRenderer } from "electron";

export default function useScreenData(source, defaultData) {
  const [pageState, updatePageState] = useState(defaultData);

  useEffect(() => {
    ipcRenderer.send(source);

    ipcRenderer.on(source, (e, data) => {
      // console.log("Got data from backend");
      // console.log(data);
      updatePageState(data);
    });

    return () => {
      ipcRenderer.removeAllListeners(source);
    };
  }, [source]);

  return pageState;
}
