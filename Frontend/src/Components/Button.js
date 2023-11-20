import React from "react";
import "./Styles/Button.css";
import { motion } from "framer-motion";

/* const spring = {
  type: "spring",
  stiffness: 700,
  damping: 34,
};

const button = {
  hidden: { x: "-100vw" },
  show: {
    x: "0",
  },
}; */

export const Button = ({
  full,
  type,
  text,
  setopenModal,
  onClick,
  marginLeft,
  id,
  gap,
  width,
  height,
  marginTop,
  svg,
  backSvg,
}) => {
  return (
    <motion.button
      onClick={onClick || setopenModal}
      /* transition={spring}
      initial="hidden"
      animate="show" */
      id={id}
      type="button"
      style={{
        width: width,
        margin: gap ? gap : null,
        marginLeft: `${marginLeft ? "15px" : ""}`,
        height: height,
        marginTop: marginTop ? marginTop : null,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${type || "primary"} ${full ? "w-full" : ""} custombtn`}
    >
      {backSvg} {text} {svg}
    </motion.button>
  );
};

export default Button;
