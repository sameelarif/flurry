import Chart from "react-apexcharts";
import "./Styles/Graph.css";
import { motion } from "framer-motion";
let timespans = ["Year", "Month", "Week", "Day"];

const Graph = ({ graphData, active, time, setTime }) => {
  let chartName = "";
  switch (active) {
    case "smsUsedGraph": {
      chartName = "SMS Used";
      break;
    }
    case "accCreatedGraph": {
      chartName = "Accounts Created";
      break;
    }
    case "accountsFailedGraph": {
      chartName = "Accounts Failed";
      break;
    }
    default: {
      break;
    }
  }

  const series = [
    {
      name: chartName,
      data: graphData[active][time].values,
    },
  ];
  const options = {
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
    colors: ["#97DDDD"],
    tooltip: {
      theme: "dark",
    },
    grid: {
      show: true,
      borderColor: "#312E42",
      strokeDashArray: 0,
      position: "back",
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      colors: ["#97DDDD"],
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    chart: {
      redrawOnParentResize: true,
      fontFamily: "Roboto",
      fontWeight: 500,
      type: "area",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: graphData[active][time].categories,
      labels: {
        style: {
          fontSize: "1rem",
          fontFamily: "Roboto",
          fontWeight: 500,
          colors: "#494A55",
        },
      },
    },
    yaxis: {
      opposite: false,
      labels: {
        style: {
          fontSize: "1rem",
          fontFamily: "Roboto",
          fontWeight: 500,
          colors: "#494A55",
        },
      },
      tickAmount: 6,
      min: 0,
    },
    legend: {
      horizontalAlign: "left",
    },
  };

  return (
    <motion.div>
      <div className="flex sp-bt headerdiv">
        <div className="header">{chartName}</div>
        <div className="timespan">
          {timespans.map((e, index) => (
            <span
              key={index}
              className={`${
                time.toLowerCase() === e.toLowerCase() ? "active" : ""
              }`}
              onClick={() => {
                setTime(e);
              }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
      <motion.div className="graph">
        <Chart
          options={options}
          series={series}
          type="area"
          width="100%"
          height="100%"
        />
      </motion.div>
    </motion.div>
  );
};

export default Graph;
