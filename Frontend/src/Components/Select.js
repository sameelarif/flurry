import "./Styles/Select.css";
import { Select } from "antd";

const { Option } = Select;

const CustomSelect = ({
  placeholder,
  label,
  options,
  input,
  setInput,
  className,
  customBg,
  searchActive,
}) => {
  return (
    <div className={`customselect ${className}`}>
      <div className="label">{label}</div>
      <Select
        className={className}
        value={input}
        showSearch
        onBlur={e => {
          return searchActive ? setInput(e.target.value) : null;
        }}
        onSearch={e => {
          return searchActive ? setInput(e) : null;
        }}
        onSelect={e => {
          console.log(e);
          setInput(e);
        }}
        suffixIcon={null}
        placeholder={placeholder}
      >
        {options.map((e, index) => (
          <Option key={index} value={e}>
            {e}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default CustomSelect;
