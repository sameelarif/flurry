import "antd/dist/antd.css";
import { Switch } from "antd";
import "./Styles/Switch.css";
const CustomSwitch = ({ label, highlight, setHighlight }) => {
  return (
    <div
      className="flex al-ce mb-17 pointer"
      onClick={() => setHighlight(!highlight)}
    >
      <Switch checked={highlight} />
      <span className={`highlight ${highlight ? "checked" : ""}`}>{label}</span>
    </div>
  );
};

export default CustomSwitch;
