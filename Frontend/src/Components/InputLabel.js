import "./Styles/InputLabel.css";

const InputLabel = ({
  className,
  label,
  type,
  placeholder,
  input,
  setInput,
  style,
  maxLength,
  width,
  gap,
  disabled,
  isTextArea,
}) => {
  console.log(isTextArea);
  return (
    <div
      style={{ width: width, margin: gap ? "4px" : null }}
      className={`inputlabel ${className}`}
    >
      <div className="label">{label}</div>
      {isTextArea === true ? (
        <textarea
          disabled={disabled}
          value={input}
          onChange={e => {
            setInput(e.target.value);
          }}
          style={{ backgroundColor: "#1d1b26" }}
          type={type}
          placeholder={placeholder}
        />
      ) : (
        <input
          disabled={disabled}
          style={style}
          value={input}
          maxLength={maxLength}
          onChange={e => {
            if(e.target.value.length > maxLength) return;
            setInput(e.target.value);
          }}
          type={type}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputLabel;
