import InputLabel from "../InputLabel";
import "./Styles/Captcha.css";
import Button from "../Button";
import { useEffect, useState } from "react";

import Sender from "./../../Sender";
import Screens from "./../../Constants/Screens";

const Captcha = ({ data }) => {
  const [twoCaptcha, updateTwoCaptcha] = useState(
    data.captcha.twoCaptcha || "",
  );
  const [capmonster, updateCapmonster] = useState(
    data.captcha.capmonster || "",
  );
  const [antiCaptcha, updateAntiCaptcha] = useState(
    data.captcha.antiCaptcha || "",
  );
  const [resolved, updateResolved] = useState(data.captcha.resolved || "");

  useEffect(() => {
    updateTwoCaptcha(data.captcha.twoCaptcha || "");
    updateCapmonster(data.captcha.capmonster || "");
    updateAntiCaptcha(data.captcha.antiCaptcha || "");
    updateResolved(data.captcha.resolved || "");
  }, [data.captcha]);

  const SettingsSender = Sender(Screens.SETTINGS);

  return (
    <div className="captcha">
      <div className="header">Captcha</div>
      <InputLabel
        label="2Captcha"
        type="text"
        placeholder="Enter Key"
        input={twoCaptcha}
        setInput={updateTwoCaptcha}
      />
      <InputLabel
        label="CapMonster"
        type="text"
        placeholder="Enter Key"
        input={capmonster}
        setInput={updateCapmonster}
      />
      <InputLabel
        disabled={true}
        label="Anti-Captcha"
        type="text"
        placeholder="Enter Key"
        input={antiCaptcha}
        setInput={updateAntiCaptcha}
      />
      <InputLabel
        label={
          <div>
            Resolved — <span className="blue">beta</span>
          </div>
        }
        type="text"
        placeholder="Enter Key"
        input={resolved}
        setInput={updateResolved}
      />

      <div className="end">
        <div className="btn">
          <Button
            text="Save Settings"
            setopenModal={() => {
              SettingsSender("onCaptchaSave", {
                twoCaptcha,
                capmonster,
                antiCaptcha,
                resolved,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Captcha;
