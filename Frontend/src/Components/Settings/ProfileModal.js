// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import Button from "../Button";
import Select from "../Select";
import InputLabel from "../InputLabel";
import Sender from "../../Sender";
// eslint-disable-next-line
import Screens from "../../Constants/Screens";
// eslint-disable-next-line
import useScreenData from "../../Hooks/useScreenData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { iso2 } from "../Helpers/dialing_map";
import abbrState from "../Helpers/abbrState";
const SettingsSender = Sender(Screens.SETTINGS);

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

const formatDate = expdate => {
  return (
    expdate.replace(/\//g, "").substring(0, 2) +
    (expdate.length > 2 ? "/" : "") +
    expdate.replace(/\//g, "").substring(2, 4)
  );
};

function cc_format(value) {
  var v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  var matches = v.match(/\d{4,16}/g);
  var match = (matches && matches[0]) || "";
  var parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
}

function addDots(len, max) {
  let string = "";
  if (max) {
    for (let i = 0; i < len; i++) {
      if (i === max) break;
      string += "•";
      if ((i + 1) % 4 === 0) string += " ";
    }
  } else {
    for (let i = 0; i < len; i++) {
      string += "•";
    }
  }
  return string;
}

let customStyles = {
  overlay: {
    background: "rgba(29, 27, 38, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

function ProfileModal({ openManageProfile, setManageProfile, profiles }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [city, setCity] = useState("");
  // const [importedProfile, setImportedProfile] = useState("");
  const [shippingDetailsActive, setActiveShipping] = useState(false);

  const [shippingFirstName, setShippingFirstName] = useState("");
  const [shippingLastName, setShippingLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddress2, setStreetAddress2] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");

  const dropdownOptions = [];
  for (const key of Object.keys(profiles)) {
    dropdownOptions.push(key);
  }

  const deleteProfile = profileName => {
    setFirstName("");
    setLastName("");
    setCardNumber("");
    setCardExpiry("");
    setCvv("");
    setShippingFirstName("");
    setShippingLastName("");
    setStreetAddress("");
    setStreetAddress2("");
    setState("");
    setZip("");
    setCountry("");
    setEmail("");
    setPhone("");

    if (!profileName || profileName.length === 0) {
      return toast.error(<div>You must enter or select a profile!</div>, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // eslint-disable-next-line
    const profileData = {
      firstName,
      lastName,
      cardNumber,
      cardExpiry,
      cvv,
      shippingFirstName,
      shippingLastName,
      streetAddress,
      streetAddress2,
      state,
      zip,
      country,
      email,
      phone,
      profileName,
    };
    SettingsSender("onProfileDelete", {
      profileName,
    });
    setProfile("");
    return toast.success(<div>Profile deleted.</div>, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const saveProfile = profileName => {
    if (!profileName || profileName.length === 0) {
      return toast.error(<div>You must enter or select a profile!</div>, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    const profileData = {
      profileName: profileName,
      creationDate: new Date().toISOString(),
      shippingInfo: {
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + " " + lastName,
        email: email,
        addressLineOne: streetAddress,
        addressLineTwo: streetAddress2,
        city: city,
        state: state,
        stateCode: abbrState(state, "abbr"),
        country: country,
        countryCode: iso2(country),
        zipCode: zip,
        phoneNumber: phone?.replace(/\D+/g, ""),
        phoneNumberFormatted: phone,
      },
      billingInfo: {
        sameAsShipping: true,
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + " " + lastName,
        email: email,
        addressLineOne: streetAddress,
        addressLineTwo: streetAddress2,
        city: city,
        state: state,
        stateCode: abbrState(state, "abbr"),
        country: country,
        countryCode: iso2(country),
        zipCode: zip,
        phoneNumber: phone?.replace(/\D+/g, ""),
        phoneNumberFormatted: phone,
        cardDetails: {
          name: firstName + " " + lastName,
          number: cardNumber,
          expMonth: cardExpiry?.split("/")[0],
          expYear: "20" + cardExpiry?.split("/")[1],
          cvv: cvv,
        },
      },
    };

    SettingsSender("onProfileSave", profileData);
    setProfile("");
    return toast.success(<div>Profile saved!</div>, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <>
      <Modal
        isOpen={openManageProfile}
        onRequestClose={() => setManageProfile(false)}
        style={customStyles}
        contentLabel="Example Modal"
        className="reactmodal"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.25 }}
          className="modal"
        >
          <h3
            style={{
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            Profile Information{" "}
            <svg
              onClick={() => setManageProfile(false)}
              style={{
                color: "white",
                marginLeft: "auto",
                cursor: "pointer",
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </h3>

          <div
            style={{
              width: "100%",
              marginTop: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {shippingDetailsActive && (
              <>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    height: "100%",
                    flexWrap: "wrap",
                    marginTop: "12px",
                  }}
                >
                  <InputLabel
                    className="custom"
                    type="text"
                    gap={true}
                    width="48%"
                    style={{ backgroundColor: "#302E3D" }}
                    placeholder="First Name"
                    input={shippingFirstName}
                    setInput={setShippingFirstName}
                  />
                  <InputLabel
                    className="custom"
                    gap={true}
                    type="text"
                    width="48%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="Last Name"
                    input={shippingLastName}
                    setInput={setShippingLastName}
                  />
                  <InputLabel
                    className="custom"
                    gap={true}
                    type="text"
                    width="97.5%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="Street Address"
                    input={streetAddress}
                    setInput={setStreetAddress}
                  />

                  <InputLabel
                    className="custom"
                    gap={true}
                    type="text"
                    width="48%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="Street Address 2"
                    input={streetAddress2}
                    setInput={setStreetAddress2}
                  />
                  <InputLabel
                    className="custom"
                    gap={true}
                    type="text"
                    width="48%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="City"
                    input={city}
                    setInput={setCity}
                  />

                  <InputLabel
                    className="custom"
                    gap={true}
                    type="text"
                    width="25%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="State"
                    input={state}
                    setInput={setState}
                  />

                  <InputLabel
                    className="custom"
                    gap={true}
                    type="number"
                    width="28%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="ZIP"
                    input={zip}
                    setInput={setZip}
                  />

                  <InputLabel
                    className="custom"
                    gap={true}
                    type="text"
                    width="41%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="Country"
                    input={country}
                    setInput={setCountry}
                  />

                  <InputLabel
                    className="custom"
                    type="text"
                    gap={true}
                    width="48%"
                    style={{ backgroundColor: "#302E3D" }}
                    placeholder="Email"
                    input={email}
                    setInput={setEmail}
                  />
                  <InputLabel
                    className="custom"
                    gap={true}
                    type="text"
                    width="48%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="Phone"
                    input={phone}
                    setInput={e => {
                      e = e.replace(/\D/g, "");
                      setPhone(formatPhoneNumber(e));
                    }}
                  />

                  <div style={{ width: "48%", marginLeft: "4px" }}>
                    <Button
                      marginTop={"11px"}
                      width="100%"
                      onClick={() => {
                        setActiveShipping(false);
                      }}
                      height="48px"
                      text="Card Details"
                      backSvg={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 12H5"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 5L5 12L12 19"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      }
                    />
                  </div>

                  <div
                    style={{
                      width: "48%",
                      marginLeft: "8px",
                      marginTop: "4px",
                    }}
                  >
                    <Select
                      placeholder="Select a Profile"
                      className="profiles"
                      options={dropdownOptions}
                      searchActive={true}
                      input={profile}
                      setInput={e => {
                        if (e.length === 0) return;
                        setProfile(e);
                      }}
                    />
                  </div>

                  <p
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "18px",
                      paddingBottom: "12px",
                    }}
                  >
                    {profile}
                  </p>
                </div>

                <div
                  style={{ width: "100%", display: "flex", marginLeft: "4px" }}
                >
                  <div style={{ width: "50%" }}>
                    <Button
                      width="97%"
                      gap={"4px"}
                      marginTop="4px"
                      onClick={() => {
                        deleteProfile(profile);
                      }}
                      height="47px"
                      text="Delete Profile"
                      type="red"
                    />
                  </div>

                  <div style={{ width: "50%" }}>
                    <Button
                      width="96%"
                      marginTop="4px"
                      gap={"6px"}
                      onClick={() => {
                        saveProfile(profile);
                      }}
                      height="47px"
                      text="Save Profile"
                    />
                  </div>
                </div>
              </>
            )}

            {!shippingDetailsActive && (
              <>
                <div
                  className="card"
                  style={{
                    background: "#97DDDD",
                    borderRadius: "12px",
                    width: "350px",
                    height: "220px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px",
                      position: "relative",
                      left: "18px",
                      top: "26px",
                      lineHeight: "14px",
                      color: "#FFFFFF",
                    }}
                  >
                    {firstName} {lastName}
                  </p>

                  <p
                    style={{
                      fontSize: "24px",
                      position: "relative",
                      left: "18px",
                      top: "103px",
                      lineHeight: "14px",
                      color: "#FFFFFF",
                      fontWeight: 500,
                    }}
                  >
                    {addDots(cardNumber.length, 12)}
                    <span style={{ fontSize: "18px" }}>
                      {cardNumber.split(" ")[3]}
                    </span>
                  </p>

                  {cardExpiry.length > 0 && (
                    <>
                      <p
                        style={{
                          fontSize: "13px",
                          position: "relative",
                          left: "18px",
                          top: "145px",
                          lineHeight: "14px",
                          color: "#FFFFFF",
                          fontWeight: 500,
                        }}
                      >
                        <p style={{ fontWeight: 600, color: "#F0F0F0" }}>
                          VALID
                        </p>
                        {cardExpiry}
                      </p>

                      <p
                        style={{
                          fontSize: "18px",
                          position: "relative",
                          left: "75px",
                          top: "117px",
                          lineHeight: "14px",
                          color: "#FFFFFF",
                          fontWeight: 500,
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 600,
                            color: "#F0F0F0",
                            fontSize: "13px",
                          }}
                        >
                          CVV
                        </p>
                        {addDots(cvv.length)}
                      </p>
                    </>
                  )}
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    height: "100%",
                    flexWrap: "wrap",
                    marginTop: "12px",
                  }}
                >
                  <InputLabel
                    className="custom"
                    type="text"
                    gap={true}
                    width="48%"
                    style={{ backgroundColor: "#302E3D" }}
                    placeholder="First Name"
                    input={firstName}
                    setInput={setFirstName}
                  />
                  <InputLabel
                    className="custom"
                    gap={true}
                    type="text"
                    width="48%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="Last Name"
                    input={lastName}
                    setInput={setLastName}
                  />
                  <InputLabel
                    className="custom"
                    gap={true}
                    width="97.5%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="Card Number"
                    input={cc_format(cardNumber)}
                    setInput={e => {
                      e = e.replace(/\D/g, "");
                      setCardNumber(cc_format(e));
                    }}
                  />

                  <InputLabel
                    className="custom"
                    gap={true}
                    width="25%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    maxLength="5"
                    placeholder="MM/YY"
                    input={cardExpiry}
                    setInput={e => {
                      e = e.replace(/\D/g, "");
                      setCardExpiry(formatDate(e));
                    }}
                  />

                  <InputLabel
                    className="custom"
                    gap={true}
                    type="number"
                    width="28%"
                    style={{
                      backgroundColor: "#302E3D",
                    }}
                    placeholder="CVV"
                    input={cvv}
                    setInput={setCvv}
                  />

                  <div style={{ width: "41%", marginLeft: "4px" }}>
                    <Button
                      marginTop={"11px"}
                      width="100%"
                      onClick={() => {
                        setActiveShipping(true);
                      }}
                      height="47px"
                      text="Shipping Details"
                      svg={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12H19"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 5L19 12L12 19"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      }
                    />
                  </div>
                  {/*   <div style={{ width: "100%", position: "relative" }}>
                    <InputLabel
                      className="custom"
                      gap={true}
                      type="text"
                      width="65.5%"
                      style={{
                        backgroundColor: "#302E3D",
                      }}
                      placeholder="Import a Profile"
                      input={importedProfile}
                      setInput={setImportedProfile}
                    />

                    <svg
                      style={{
                        position: "absolute",
                        left: "60%",
                        top: "20px",
                        cursor: "pointer",
                      }}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.83325 8.3335L9.99992 12.5002L14.1666 8.3335"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10 12.5V2.5"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div> */}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </Modal>
    </>
  );
}

export default ProfileModal;
