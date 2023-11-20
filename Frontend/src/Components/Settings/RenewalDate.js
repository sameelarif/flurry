import Button from "../Button";
import "./Styles/Renewal.css";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { shell } from "electron";

const RenewalDate = ({ data, authData }) => {
  const recurring = authData.plan.recurring;

  let daysLeft = 0;
  let percentage = 0;

  if (authData.subscription) {
    let today = Date.now();
    let timeLeft = authData.subscription.current_period_end - today;
    daysLeft = Math.ceil(timeLeft / (1e3 * 60 * 60 * 24));

    percentage = (
      (timeLeft /
        (authData.subscription.current_period_end -
          authData.subscription.current_period_start)) *
      100
    ).toFixed(2);

    console.log(percentage);
  }

  const formatDate = (ts) =>
    new Date(ts).toLocaleDateString("en-gb", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "utc",
    });

  return (
    <div className="renewal">
      <div className="progress" style={{ width: "7.5rem", height: "7.5rem" }}>
        <CircularProgressbarWithChildren value={recurring ? percentage : 100}>
          <div className="perc">{recurring ? daysLeft : ""}</div>
          <div className="days-left">
            {recurring ? "days left" : "Lifetime"}
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="rightsection">
        <div className="text">Renewal Date</div>
        <div className="date">
          {recurring
            ? formatDate(authData.subscription.current_period_end)
            : "Lifetime"}
        </div>
        <div className="btn" onClick={() => console.log(data.license.dashLink)}>
          <Button
            full={false}
            text="Dashboard"
            onClick={() =>
              shell.openExternal("https://www.[removed]/dashboard", "_blank")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default RenewalDate;
