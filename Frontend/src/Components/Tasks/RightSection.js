import "./Styles/Rightsection.css";
import Button from "../Button";
import Sender from "./../../Sender";
import Screens from "./../../Constants/Screens";

const TaskSender = Sender(Screens.TASKS);
const capitalize = (item) => {
  if (item === "sns") return "SNS";
  if (item === "ssense") return "SSENSE";
  if (item === "flx") return "FLX";
  if (item === "metamask") return "MetaMask";
  if (item === "krispykreme") return "KrispyKreme";
  return item.charAt(0).toUpperCase() + item.slice(1);
};
const RightSection = ({ editMode, setEditMode, data }) => {
  const PlayIcon = ({ taskId }) => {
    return (
      <svg
        width="15"
        height="14"
        viewBox="0 0 15 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => {
          TaskSender("onStartTask", taskId);
        }}
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
  const StopIcon = ({ taskId }) => {
    return (
      <svg
        className="pause"
        width="13"
        height="14"
        viewBox="0 0 13 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => {
          TaskSender("onStopTask", taskId);
        }}
      >
        <rect
          x="1"
          y="1.93335"
          width="10.1333"
          height="10.1333"
          rx="1"
          stroke="#FFAD4D"
          stroke-width="2"
        />
      </svg>
    );
  };
  const EditIcon = ({ taskId }) => {
    return (
      <svg
        className="edit"
        width="15"
        height="14"
        viewBox="0 0 15 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => {
          setEditMode(taskId);
        }}
      >
        <path
          d="M10.3833 1.75009C10.5365 1.59689 10.7184 1.47535 10.9186 1.39244C11.1188 1.30952 11.3333 1.26685 11.55 1.26685C11.7667 1.26685 11.9812 1.30952 12.1814 1.39244C12.3816 1.47535 12.5635 1.59689 12.7167 1.75009C12.8699 1.9033 12.9914 2.08519 13.0743 2.28537C13.1572 2.48554 13.1999 2.70009 13.1999 2.91676C13.1999 3.13343 13.1572 3.34798 13.0743 3.54816C12.9914 3.74833 12.8699 3.93022 12.7167 4.08343L4.84166 11.9584L1.63333 12.8334L2.50833 9.62509L10.3833 1.75009Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };
  const DeleteIcon = ({ taskId }) => {
    return (
      <svg
        className="stop"
        width="15"
        height="14"
        viewBox="0 0 15 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => {
          TaskSender("onDeleteTask", taskId);
        }}
      >
        <g clip-path="url(#clip0)">
          <path
            d="M2.61667 3.5H3.78334H13.1167"
            stroke="#F43541"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.53333 3.50008V2.33341C5.53333 2.024 5.65624 1.72725 5.87503 1.50846C6.09383 1.28966 6.39057 1.16675 6.69999 1.16675H9.03333C9.34274 1.16675 9.63949 1.28966 9.85828 1.50846C10.0771 1.72725 10.2 2.024 10.2 2.33341V3.50008M11.95 3.50008V11.6667C11.95 11.9762 11.8271 12.2729 11.6083 12.4917C11.3895 12.7105 11.0927 12.8334 10.7833 12.8334H4.94999C4.64057 12.8334 4.34383 12.7105 4.12503 12.4917C3.90624 12.2729 3.78333 11.9762 3.78333 11.6667V3.50008H11.95Z"
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
              transform="translate(0.866669)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  };

  return (
    <div>
      <div className="sectiontop">
        <div className="headergrid">
          <div>Site</div>
          <div>Quantity left</div>
          <div>Status</div>
          <div />
        </div>
        <div className="items">
          {Object.keys(data).length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "middle",
                justifyItems: "center",
                alignSelf: "center",
                height: "100%",
              }}
            >
              <div style={{ marginTop: "30px" }}>
                <svg
                  viewBox="0 0 16 16"
                  width="120"
                  height="120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.24755 1.38105C8.08861 1.31748 7.91128 1.31748 7.75235 1.38105L1.08569 4.04772C0.832593 4.14897 0.666626 4.39411 0.666626 4.66671C0.666626 4.93931 0.832593 5.18445 1.08569 5.28569L7.75235 7.95237C7.91128 8.01591 8.08861 8.01591 8.24755 7.95237L14.9142 5.28569C15.1673 5.18445 15.3333 4.93931 15.3333 4.66671C15.3333 4.39411 15.1673 4.14897 14.9142 4.04772L8.24755 1.38105ZM7.99995 6.61535L3.12835 4.66671L7.99995 2.71806L12.8715 4.66671L7.99995 6.61535Z"
                    fill="white"
                  />
                  <path
                    d="M0.714365 7.75239C0.851105 7.41052 1.23908 7.24425 1.58094 7.38099L8 9.94865L14.4191 7.38099C14.7609 7.24425 15.1489 7.41052 15.2857 7.75239C15.4224 8.09425 15.2561 8.48225 14.9143 8.61899L8.2476 11.2857C8.08866 11.3493 7.91133 11.3493 7.7524 11.2857L1.08575 8.61899C0.743898 8.48225 0.57762 8.09425 0.714365 7.75239Z"
                    fill="white"
                  />
                  <path
                    d="M0.714365 11.0858C0.851105 10.7439 1.23908 10.5776 1.58094 10.7144L8 13.282L14.4191 10.7144C14.7609 10.5776 15.1489 10.7439 15.2857 11.0858C15.4224 11.4276 15.2561 11.8156 14.9143 11.9524L8.2476 14.619C8.08866 14.6826 7.91133 14.6826 7.7524 14.619L1.08575 11.9524C0.743898 11.8156 0.57762 11.4276 0.714365 11.0858Z"
                    fill="white"
                  />
                </svg>
              </div>
              <p
                style={{
                  marginTop: "5px",
                  fontSize: "1.25rem",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Tasks you create will appear here
              </p>
            </div>
          ) : (
            Object.keys(data).map((e, i) => (
              <div
                className={`item ${data[e].id === editMode ? "active" : ""}`}
                key={i}
              >
                <div>{capitalize(data[e].site)}</div>
                <div>{data[e].quantityLeft}</div>
                <div className={data[e].statusColor}>{data[e].status}</div>
                <div className="flex al-ce">
                  {data[e].running ? (
                    <StopIcon taskId={data[e].id} />
                  ) : (
                    <PlayIcon taskId={data[e].id} />
                  )}
                  <EditIcon taskId={data[e].id} />
                  <DeleteIcon taskId={data[e].id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="sectionbottom">
        <Button
          onClick={() => {
            TaskSender("onStartAllTasks");
          }}
          text={
            <div className="flex al-ce jc-ce">
              <svg
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.33331 1L10.6666 7L1.33331 13V1Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <div className="l-100">Start All</div>
            </div>
          }
        />
        <Button
          type="red"
          onClick={() => {
            TaskSender("onStopAllTasks");
          }}
          text={
            <div className="flex al-ce jc-ce">
              <svg
                width="13"
                height="14"
                viewBox="0 0 13 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1.93335"
                  width="10.1333"
                  height="10.1333"
                  rx="1"
                  stroke="white"
                  stroke-width="2"
                />
              </svg>

              <div className="l-100">Stop All</div>
            </div>
          }
        />
        <Button
          onClick={() => {
            TaskSender("onDeleteAllTasks");
          }}
          type="yellow"
          text={
            <div className="flex al-ce jc-ce">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.75 3.5H2.91667H12.25"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.66666 3.50008V2.33341C4.66666 2.024 4.78957 1.72725 5.00837 1.50846C5.22716 1.28966 5.5239 1.16675 5.83332 1.16675H8.16666C8.47608 1.16675 8.77282 1.28966 8.99161 1.50846C9.21041 1.72725 9.33332 2.024 9.33332 2.33341V3.50008M11.0833 3.50008V11.6667C11.0833 11.9762 10.9604 12.2729 10.7416 12.4917C10.5228 12.7105 10.2261 12.8334 9.91666 12.8334H4.08332C3.7739 12.8334 3.47716 12.7105 3.25837 12.4917C3.03957 12.2729 2.91666 11.9762 2.91666 11.6667V3.50008H11.0833Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <div className="l-100">Delete All</div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default RightSection;
