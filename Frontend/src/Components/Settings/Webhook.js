import { useEffect, useState } from "react";
import Button from "../Button";
import InputLabel from "../InputLabel";
import "./Styles/Webhook.css";

import Sender from "./../../Sender";
import Screens from "./../../Constants/Screens";

const SettingsSender = Sender(Screens.SETTINGS);

const Webhook = ({ data }) => {
  const [webhookValue, updateWebhookValue] = useState("");

  useEffect(() => {
    updateWebhookValue(data.webHookUrl || "");
  }, [data.webHookUrl]);

  return (
    <div className="webhook">
      <InputLabel
        label="Webhook"
        className="custom"
        type="text"
        placeholder="Enter Webhook"
        input={webhookValue}
        setInput={updateWebhookValue}
      />
      <div className="flex">
        <Button
          type="black small"
          text="Test"
          onClick={() => {
            SettingsSender("onWebhookSave", webhookValue);
            SettingsSender("onWebhookTest", webhookValue);
          }}
        />
        <Button
          type="primary small m-l"
          text="Save"
          onClick={() => {
            SettingsSender("onWebhookSave", webhookValue);
          }}
        />
      </div>
    </div>
  );
};

export default Webhook;
