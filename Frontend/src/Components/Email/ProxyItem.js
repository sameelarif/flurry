import "./Styles/ProxyItem.css";

import Sender from "./../../Sender";
import Screens from "../../Constants/Screens";
const ProxySender = Sender(Screens.PROXY);

const PlayIcon = ({ active, proxy, testUrl }) => {
  return (
    <svg
      onClick={() => {
        ProxySender("onTestProxy", {
          name: active,
          proxy: proxy,
          testUrl: testUrl,
        });
      }}
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <path
          d="M2.33331 1L11.6666 7L2.33331 13V1Z"
          stroke="#97DDDD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="14"
            height="14"
            fill="white"
            transform="translate(0.466675)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const StopIcon = ({ active, proxy }) => {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: "1rem" }}
      onClick={() => {
        ProxySender("onDeleteProxy", {
          name: active,
          proxy,
        });
      }}
    >
      <g clip-path="url(#clip0)">
        <path
          d="M2.6167 3.5H3.78337H13.1167"
          stroke="#F43541"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5.53339 3.49996V2.33329C5.53339 2.02387 5.6563 1.72713 5.8751 1.50833C6.09389 1.28954 6.39063 1.16663 6.70005 1.16663H9.03339C9.34281 1.16663 9.63955 1.28954 9.85834 1.50833C10.0771 1.72713 10.2001 2.02387 10.2001 2.33329V3.49996M11.9501 3.49996V11.6666C11.9501 11.976 11.8271 12.2728 11.6083 12.4916C11.3896 12.7104 11.0928 12.8333 10.7834 12.8333H4.95005C4.64063 12.8333 4.34389 12.7104 4.12509 12.4916C3.9063 12.2728 3.78339 11.976 3.78339 11.6666V3.49996H11.9501Z"
          stroke="#F43541"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="14"
            height="14"
            fill="white"
            transform="translate(0.866699)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const ProxyItem = ({ active, proxy, status, statusColor, testURL, style }) => {
  return (
    <div className="proxyitem" style={style}>
      <div
        style={{
          maxWidth: "300px",
          width: "300px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {proxy}
      </div>
      <div className={statusColor}>{status}</div>
      <div className="btns">
        <PlayIcon active={active} testUrl={testURL} proxy={proxy} />
        <StopIcon active={active} proxy={proxy} />
      </div>
    </div>
  );
};

export default ProxyItem;
