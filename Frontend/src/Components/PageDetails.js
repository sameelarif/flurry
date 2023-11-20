import ControlBtns from "./ControlBtns";
import "./Styles/PageDetails.css";
const PageDetails = ({ pagename, controls }) => {
  return (
    <div className="pagedetails">
      <div className="pagename">{pagename}</div>
      {!controls ? <ControlBtns /> : ""}
    </div>
  );
};

export default PageDetails;
