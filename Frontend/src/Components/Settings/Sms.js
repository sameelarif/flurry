import Button from "../Button";
import "./Styles/Sms.css";
const Sms = ({ setopenModal }) => {
  return (
    <div className="sms">
      <div className="header">SMS</div>
      <div className="btn" onClick={() => setopenModal(true)}>
        <Button text="Manage API Keys" />
      </div>
    </div>
  );
};

export default Sms;
