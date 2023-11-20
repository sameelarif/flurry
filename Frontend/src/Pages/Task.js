import PageDetails from "../Components/PageDetails";
import LeftSection from "../Components/Tasks/LeftSection";
import RightSection from "../Components/Tasks/RightSection";
import "./Styles/Task.css";
import { useState } from "react";
import { motion } from "framer-motion";
import useScreenData from "./../Hooks/useScreenData";
import Screens from "./../Constants/Screens";
import visibleData from "../data";
let TaskData = {};

const Task = () => {
  const [editMode, setEditMode] = useState(null);
  const data = useScreenData(`${Screens.TASKS}-LOAD`, TaskData);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="main task"
      beforeChildren={true}
    >
      <PageDetails pagename="Tasks" />
      <div className="grid">
        <LeftSection
          visibleData={visibleData}
          globalData={data}
          setEditMode={setEditMode}
          editMode={editMode}
        />
        <RightSection
          editMode={editMode}
          setEditMode={setEditMode}
          data={data}
        />
      </div>
    </motion.div>
  );
};

export default Task;
