import "./Styles/Key.css";
import Button from "../Button";

import Screens from "../../Constants/Screens";
import Sender from "../../Sender";
const SettingsSender = Sender(Screens.SETTINGS);
const Key = ({ lickey }) => {
  return (
    <div className="key">
      <div className="smheader">License Key</div>
      <div className="flex">
        <div className="lickey">{lickey}</div>
        <div
          className="copy"
          onClick={() => {
            navigator.clipboard.writeText(lickey);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
              stroke="#97DDDD"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.33337 9.99998H2.66671C2.31309 9.99998 1.97395 9.8595 1.7239 9.60946C1.47385 9.35941 1.33337 9.02027 1.33337 8.66665V2.66665C1.33337 2.31302 1.47385 1.97389 1.7239 1.72384C1.97395 1.47379 2.31309 1.33331 2.66671 1.33331H8.66671C9.02033 1.33331 9.35947 1.47379 9.60952 1.72384C9.85956 1.97389 10 2.31302 10 2.66665V3.33331"
              stroke="#97DDDD"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <Button
        type="red"
        text="Deactivate"
        onClick={() => {
          console.log("Sending deactivate");
          SettingsSender("onDeactivate", lickey);
        }}
      />
    </div>
  );
};

export default Key;
