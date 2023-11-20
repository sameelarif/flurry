import TopSection from "../Components/Dash/TopSection";
import PageDetails from "../Components/PageDetails";
import Graph from "../Components/Dash/Graph";
import "./Styles/Dash.css";
import LatestActivity from "../Components/Dash/LatestActivity";
import { motion } from "framer-motion";
import useScreenData from "./../Hooks/useScreenData";
import Screens from "./../Constants/Screens";
import { useState } from "react";

let DashData = {
  accountsFailed: 0,
  accountsCreated: 0,
  smsUsed: 0,
  accountsFailedGraph: {
    year: {
      categories: ["2020", "2021", "2022", "2023"],
      values: [0, 0, 0, 0],
    },
    month: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    week: {
      categories: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      values: [0, 0, 0, 0, 0, 0, 0],
    },
    day: {
      categories: [
        "12:00 AM",
        "01:00 AM",
        "02:00 AM",
        "03:00 AM",
        "04:00 AM",
        "05:00 AM",
        "06:00 AM",
        "07:00 AM",
        "08:00 AM",
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
        "06:00 PM",
        "07:00 PM",
        "08:00 PM",
        "09:00 PM",
        "10:00 PM",
        "11:00 PM",
      ],
      values: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  },
  accCreatedGraph: {
    year: {
      categories: ["2020", "2021", "2022", "2023"],
      values: [0, 0, 0, 0],
    },
    month: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    week: {
      categories: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      values: [0, 0, 0, 0, 0, 0, 0],
    },
    day: {
      categories: [
        "12:00 AM",
        "01:00 AM",
        "02:00 AM",
        "03:00 AM",
        "04:00 AM",
        "05:00 AM",
        "06:00 AM",
        "07:00 AM",
        "08:00 AM",
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
        "06:00 PM",
        "07:00 PM",
        "08:00 PM",
        "09:00 PM",
        "10:00 PM",
        "11:00 PM",
      ],
      values: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  },
  smsUsedGraph: {
    year: {
      categories: ["2020", "2021", "2022", "2023"],
      values: [0, 0, 0, 0],
    },
    month: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    week: {
      categories: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      values: [0, 0, 0, 0, 0, 0, 0],
    },
    day: {
      categories: [
        "12:00 AM",
        "01:00 AM",
        "02:00 AM",
        "03:00 AM",
        "04:00 AM",
        "05:00 AM",
        "06:00 AM",
        "07:00 AM",
        "08:00 AM",
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
        "06:00 PM",
        "07:00 PM",
        "08:00 PM",
        "09:00 PM",
        "10:00 PM",
        "11:00 PM",
      ],
      values: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  },
  latestActivity: [],
};

const Dash = () => {
  const data = useScreenData(`${Screens.DASH}-LOAD`, DashData);
  const [active, setActive] = useState("accCreatedGraph");
  const [time, setTime] = useState("week");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      beforeChildren={true}
      transition={{ duration: 0.2 }}
      className="main"
    >
      <PageDetails pagename="Dashboard" />
      <TopSection
        time={time}
        active={active}
        setActive={setActive}
        failed={`${data.accountsFailed}`}
        accounts={data.accountsCreated}
        sms={data.smsUsed}
      />
      <Graph
        graphData={data}
        active={active}
        time={time.toLowerCase()}
        setTime={setTime}
      />
      <LatestActivity ActivityArray={data.latestActivity} />
    </motion.div>
  );
};

export default Dash;
