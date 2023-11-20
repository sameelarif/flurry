import { useEffect } from "react";
import PageDetails from "../Components/PageDetails";
import "./Styles/Sites.css";
import { AnimatePresence, motion } from "framer-motion";
import Sitelist from "../Components/Sites/Sitelist";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Button from "../Components/Button";
import Modal from "react-modal";
import Inputlabel from "../Components/InputLabel";
import { Scrollbars } from "react-custom-scrollbars";
import Screens from "./../Constants/Screens";
import useScreenData from "./../Hooks/useScreenData";
import Sender from "./../Sender";

const AccountsSender = Sender(Screens.ACCOUNTS);

const CustomScrollbars = (props) => (
  <Scrollbars
    renderTrackVertical={(props) => (
      <div {...props} className="track-vertical" />
    )}
    renderTrackHorizontal={(props) => (
      <div {...props} className="track-horizontal" />
    )}
    renderThumbHorizontal={(props) => (
      <div {...props} className="thumb-horizontal" />
    )}
    renderThumbVertical={(props) => (
      <div {...props} className="thumb-vertical" />
    )}
    renderView={(props) => <div {...props} className="view" />}
    {...props}
    thumbSize={300}
  />
);

let SiteData = {
  nike: {
    "Default Group": [],
  },
  shopify: {
    "Default Group": [],
  },
  target: {
    "Default Group": [],
  },
  walmart: {
    "Default Group": [],
  },
  n: {
    "Default Group": [],
  },
  sns: {
    "Default Group": [],
  },
  ssense: {
    "Default Group": [],
  },
  outlook: {
    "Default Group": [],
  },
  amazon: {
    "Default Group": [],
  },
  google: {
    "Default Group": [],
  },
  footlocker: {
    "Default Group": [],
  },
  adidas: {
    "Default Group": [],
  },
  bestbuy: {
    "Default Group": [],
  },
  yahoo: {
    "Default Group": [],
  },
  veve: {
    "Default Group": [],
  },
};

let customStyles = {
  overlay: {
    background: "rgba(29, 27, 38, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const Sites = () => {
  const data = useScreenData(`${Screens.ACCOUNTS}-LOAD`, SiteData);
  const [selected, updateSelected] = useState("nike");
  const [name, updateName] = useState("");
  const [proxyText, updateProxyText] = useState("");
  const [openModal, setopenModal] = useState(false);
  const [active, setActive] = useState("Default Group");
  const [accountPrompt, toggleAccountPrompt] = useState(false);
  let Lists = () => {
    return Object.keys(data[selected]).map((el, index) => (
      <div className="px-1" key={index}>
        <div
          onClick={() => {
            if (data[selected][el]) {
              setActive(el);
              updateProxyText(data[selected][el].join("\n"));
            }
          }}
          className={`${active === el ? "active" : ""} listbox`}
        >
          <div className="flex">
            <div className="listheader">{el}</div>

            {!(el === "Default Group") ? (
              <svg
                onClick={() => {
                  AccountsSender("onDeleteGroup", {
                    site: selected,
                    name: el,
                  });
                }}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.75 3.5H2.91667H12.25"
                  stroke="#F43541"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.66663 3.49996V2.33329C4.66663 2.02387 4.78954 1.72713 5.00834 1.50833C5.22713 1.28954 5.52387 1.16663 5.83329 1.16663H8.16663C8.47605 1.16663 8.77279 1.28954 8.99158 1.50833C9.21038 1.72713 9.33329 2.02387 9.33329 2.33329V3.49996M11.0833 3.49996V11.6666C11.0833 11.976 10.9604 12.2728 10.7416 12.4916C10.5228 12.7104 10.226 12.8333 9.91663 12.8333H4.08329C3.77387 12.8333 3.47713 12.7104 3.25833 12.4916C3.03954 12.2728 2.91663 11.976 2.91663 11.6666V3.49996H11.0833Z"
                  stroke="#F43541"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            ) : (
              <></>
            )}
          </div>
          <div className="proxycount">{data[selected][el].length} accounts</div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    let firstGroup = Object.keys(data[selected])[0];

    setActive(firstGroup);

    updateProxyText(data[selected][firstGroup].join("\n"));
  }, [data, selected]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="main sites"
        beforeChildren={true}
      >
        <AnimatePresence>
          {openModal && (
            <Modal
              isOpen={openModal}
              onRequestClose={() => setopenModal(false)}
              style={customStyles}
              contentLabel="Example Modal"
              className="reactmodal"
            >
              <motion.div
                onKeyDown={(e) => {
                  if (e.which === 13) {
                    document.getElementById("createGroup").click();
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeInOut", duration: 0.25 }}
                className="modal"
              >
                <div>
                  <div className="header">New Account Group</div>
                  <Inputlabel
                    label="Group Name"
                    placeholder="Enter Name"
                    input={name}
                    setInput={updateName}
                  />
                  <div className="btn">
                    <Button
                      id="createGroup"
                      text="Create Group"
                      onClick={() => {
                        if (selected) {
                          if (data[selected][name]) {
                            return toast.error(
                              <div>
                                An account group with this name already exists!
                              </div>,
                              {
                                position: "bottom-center",
                                autoClose: 3000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                              },
                            );
                          }

                          AccountsSender("onCreateGroup", {
                            site: selected,
                            name: name,
                          });
                          setopenModal(false);
                        } else {
                          toast.error(<div>No site is selected</div>, {
                            position: "bottom-center",
                            autoClose: 3000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {accountPrompt && (
            <Modal
              isOpen={accountPrompt}
              onRequestClose={() => toggleAccountPrompt(false)}
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
                <div>
                  <div className="header" style={{ fontSize: "24px" }}>
                    Clear Account List
                  </div>

                  <p style={{ fontSize: "16px", color: "white" }}>
                    Are you sure you want to clear this list? This action is
                    irreversible.
                  </p>

                  <div className="btn" style={{ marginTop: "20px" }}>
                    <Button text="Cancel" onClick={() => {}} />
                    <Button
                      type="red"
                      text="Confirm"
                      marginLeft
                      onClick={() => {}}
                    />
                  </div>
                </div>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>

        <div className="sitesleftsection">
          <PageDetails pagename="Sites" controls={true} />
          <Sitelist updateSelected={updateSelected} data={data} />
        </div>
        <div className="border" />
        <div className="sitesrightsection">
          <PageDetails
            pagename={
              <div className="capital">
                {capitalize(selected)}
                <svg
                  style={{ cursor: "pointer" }}
                  onClick={setopenModal}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3.33325V12.6666"
                    stroke="#97DDDD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.33331 8H12.6666"
                    stroke="#97DDDD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            }
            controls={false}
          />

          <div className="listcontainer">
            <div className="lists">
              <CustomScrollbars>
                <Lists selected={selected} data={data} />
              </CustomScrollbars>
            </div>
          </div>
          <div className="header">{Object.keys(data[selected])[active]}</div>
          <textarea
            name="textarea"
            value={proxyText}
            placeholder={`example@[removed]:password\nexample@[removed]:password\nexample@[removed]:password\nexample@[removed]:password\nexample@[removed]:password\n`}
            onChange={(e) => updateProxyText(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div
              className="btn"
              style={{ width: "40%", marginLeft: "auto", display: "flex" }}
            >
              <Button
                onClick={() => toggleAccountPrompt(true)}
                gap="5px"
                type="red"
                text={<div>Clear List</div>}
              />
              <Button
                gap="5px"
                type="yellow"
                text={<div>Export List</div>}
                onClick={() => {
                  if (!active) {
                    return toast.error(<div>Please select a group first</div>, {
                      position: "bottom-center",
                      autoClose: 3000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  }

                  AccountsSender("onExportAccounts", {
                    site: selected,
                    name: active,
                    accountsEntered: proxyText,
                  });
                }}
              />
              <Button
                gap="5px"
                text={<div>Save List</div>}
                onClick={() => {
                  if (!active) {
                    return toast.error(<div>Please select a group first</div>, {
                      position: "bottom-center",
                      autoClose: 3000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  }

                  AccountsSender("onUpdateAccounts", {
                    site: selected,
                    name: active,
                    accountsEntered: proxyText,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const capitalize = (item) => {
  if (item === "sns") return "SNS";
  if (item === "ssense") return "SSENSE";
  if (item === "veve") return "VeVe";
  if (item === "bestbuy") return "BestBuy";
  if (item === "metamask") return "MetaMask";
  if (item === "flx") return "FLX";
  if (item === "krispykreme") return "KrispyKreme";
  return item.charAt(0).toUpperCase() + item.slice(1);
};

export default Sites;
