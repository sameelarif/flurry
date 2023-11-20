import "./Styles/LatestActivity.css";
import moment from "moment";
const LatestActivity = ({ ActivityArray }) => {
  const togglePassword = pwdElement => {
    document.getElementById(pwdElement).classList.toggle("blurred");
  };
  return (
    <>
      <div className="headerdiv">
        <div className="header">Latest Activity</div>
      </div>
      <div className="activity">
        <div
          className="headers"
          style={
            ActivityArray.length === 0
              ? { display: "none" }
              : { display: "grid" }
          }
        >
          <p>Type</p>
          <p>Site</p>
          <p>Email</p>
          <p>Password</p>
          <p>Created</p>
        </div>
        {ActivityArray.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ marginTop: "30px" }}>
              <svg
                width="104"
                height="104"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-activity"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <p
              style={{
                marginTop: "20px",
                fontSize: "1.25rem",
                color: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              Looks like you haven't made any accounts yet,
              <p
                style={{
                  color: "#8fd9da",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  marginLeft: "4px",
                }}
                onClick={() => {
                  document.getElementById("/tasks").click();
                }}
              >
                head over to the tasks page
                <svg
                  style={{ display: "inline-block", marginLeft: "2px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8fd9da"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-arrow-right"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </p>
            </p>
          </div>
        ) : (
          <div className="items">
            {ActivityArray.map((e, index) => (
              <div
                className="item"
                key={e.pass}
                onMouseEnter={() => togglePassword(index + e.pass)}
                onMouseLeave={() => togglePassword(index + e.pass)}
              >
                <p className="type">{e.type}</p>
                <p>{e.site}</p>
                <p>{e.email}</p>
                <p class="blurred blurrable" id={index + e.pass}>
                  {e.pass}
                </p>
                <p>{moment(e.date).fromNow()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LatestActivity;
