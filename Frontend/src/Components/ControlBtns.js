import "./Styles/ControlBtns.css";
import { remote } from "electron";

const ControlBtns = () => {
  return (
    <div className="controlbtns">
      <div
        className="mini"
        onClick={() => {
          remote.BrowserWindow.getFocusedWindow().minimize();
        }}
        style={{
          height: "24px",
          width: "16px",
        }}
      >
        <svg viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.666687 0.999919C0.666687 0.631719 0.965167 0.333252 1.33335 0.333252H10.6667C11.0349 0.333252 11.3334 0.631719 11.3334 0.999919C11.3334 1.36812 11.0349 1.66659 10.6667 1.66659H1.33335C0.965167 1.66659 0.666687 1.36812 0.666687 0.999919Z"
            fill="white"
          />
        </svg>
      </div>
      <div
        className="maxi"
        onClick={() => {
          remote.BrowserWindow.getFocusedWindow().maximize();
        }}
        style={{
          height: "16px",
          width: "16px",
        }}
      >
        <svg
          aria-hidden="true"
          role="img"
          width="16"
          height="16"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </g>
        </svg>
      </div>
      <div
        className="close"
        onClick={() => {
          remote.BrowserWindow.getFocusedWindow().close();
        }}
      >
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.80476 0.862008C1.54441 0.601661 1.1223 0.601661 0.861947 0.862008C0.6016 1.12236 0.6016 1.54447 0.861947 1.80482L5.05729 6.00015L0.861947 10.1954C0.6016 10.4558 0.6016 10.8779 0.861947 11.1383C1.1223 11.3986 1.54441 11.3986 1.80476 11.1383L6.00009 6.94295L10.1953 11.1381C10.4556 11.3985 10.8778 11.3985 11.1381 11.1381C11.3984 10.8778 11.3984 10.4557 11.1381 10.1953L6.94289 6.00015L11.1381 1.80492C11.3984 1.54457 11.3984 1.12246 11.1381 0.862108C10.8778 0.601761 10.4556 0.601761 10.1953 0.862108L6.00009 5.05735L1.80476 0.862008Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default ControlBtns;
