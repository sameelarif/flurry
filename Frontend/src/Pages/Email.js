import { useState } from "react";
import PageDetails from "../Components/PageDetails";
import "./Styles/Email.css";
import ProxyItem from "../Components/Email/ProxyItem";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Components/Button";
import Modal from "react-modal";
import useScreenData from "./../Hooks/useScreenData";
import Screens from "./../Constants/Screens";
import InputLabel from "../Components/InputLabel";
import Sender from "./../Sender";
import { toast } from "react-toastify";
import { Scrollbars } from "react-custom-scrollbars";
import VirtualList from "react-tiny-virtual-list-oss";
import AutoSizer from "react-virtualized-auto-sizer";

const CustomScrollbars = props => (
  <Scrollbars
    renderTrackVertical={props => <div {...props} className="track-vertical" />}
    renderTrackHorizontal={props => (
      <div {...props} className="track-horizontal" />
    )}
    renderThumbHorizontal={props => (
      <div {...props} className="thumb-horizontal" />
    )}
    renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
    renderView={props => <div {...props} className="view" />}
    {...props}
    thumbSize={300}
  />
);

const ProxySender = Sender(Screens.PROXY);

let ProxiesData = {
  proxyList: {
    "List 1": {
      "74.5678.456.45:fhejrkfhreikjf:fh389fhierfrtr": {
        proxy: "74.5678.456.4567:fhejrkfhreikjf:fh389fhierfrtr",
        status: "63ms",
        statusColor: "green",
      },
      "74.5678.456.48:fhejrkfhreikjf:fh389fhierfrtr": {
        proxy: "74.5678.456.4567:fhejrkfhreikjf:fh389fhierfrtr",
        status: "61ms",
        statusColor: "green",
      },
      "74.5678.456.49:fhejrkfhreikjf:fh389fhierfrtr": {
        proxy: "74.5678.456.4567:fhejrkfhreikjf:fh389fhierfrtr",
        status: "66ms",
        statusColor: "green",
      },
    },
    "List 2": {
      "74.5678.456.48:fhejrkfhreikjf:fh389fhierfrtr": {
        proxy: "74.5678.456.4567:fhejrkfhreikjf:fh389fhierfrtr",
        status: "61ms",
        statusColor: "green",
      },
      "74.5678.456.49:fhejrkfhreikjf:fh389fhierfrtr": {
        proxy: "74.5678.456.4567:fhejrkfhreikjf:fh389fhierfrtr",
        status: "66ms",
        statusColor: "green",
      },
    },
    "List 3": {
      "74.5678.456.45:fhejrkfhreikjf:fh389fhierfrtr": {
        proxy: "74.5678.456.4567:fhejrkfhreikjf:fh389fhierfrtr",
        status: "63ms",
        statusColor: "green",
      },
      "74.5678.456.48:fhejrkfhreikjf:fh389fhierfrtr": {
        proxy: "74.5678.456.4567:fhejrkfhreikjf:fh389fhierfrtr",
        status: "61ms",
        statusColor: "green",
      },
      "74.5678.456.49:fhejrkfhreikjf:fh389fhierfrtr": {
        proxy: "74.5678.456.4567:fhejrkfhreikjf:fh389fhierfrtr",
        status: "66ms",
        statusColor: "green",
      },
    },
  },
  emailList: {
    "List 1": [
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
    ],
    "List 2": [
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
      "example@gmail.com",
    ],
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

const Email = () => {
  const data = useScreenData(`${Screens.PROXY}-LOAD`, ProxiesData);
  const [testUrl, updateTestUrl] = useState("");
  const [proxyText, updateProxyText] = useState("");
  const [newProxy, updateNewProxy] = useState("");
  const [openModal, setopenModal] = useState(false);
  const [active, setActive] = useState("Default Group");
  const [active2, setActive2] = useState("Default Group");
  const [grpName, setGrpName] = useState("");
  const [emailGroupModal, updateEmailGroupModal] = useState(false);
  const [proxyGroupModal, updateProxyGroupModal] = useState(false);
  const [proxyPrompt, toggleProxyPrompt] = useState(false);
  const [emailPrompt, toggleEmailPrompt] = useState(false);
  /*   document.addEventListener("keypress", (event) => {
    console.log(openModal, emailGroupModal, proxyGroupModal);
    if (event.which === 13 && openModal === true) {
      document.getElementById("saveList").click();
      return;
    }
    if (event.which === 13 && emailGroupModal === true) {
      document.getElementById("saveEmailGroup").click();
      return;
    }
  }); */

  let ProxyLists = () => {
    return Object.keys(data.proxyList).map((el, index) => (
      <div className="px-1" key={index}>
        <div
          onClick={() => {
            if (data.proxyList[el]) setActive(el);
          }}
          className={`${active === el ? "active" : ""} listbox`}
        >
          <div className="flex">
            <div className="listheader">{el}</div>
            {!(el === "Default Group") ? (
              <svg
                onClick={() => {
                  if (active === el) {
                    setActive("");
                  }

                  ProxySender("onDeleteProxyGroup", { name: el });
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
          <div className="proxycount">
            {Object.keys(data.proxyList[el]).length} proxies
          </div>
        </div>
      </div>
    ));
  };

  let EmailLists = () => {
    return Object.keys(data.emailList).map((el, index) => (
      <div className="px-1" key={index}>
        <div
          onClick={() => {
            if (data.emailList[el]) {
              setActive2(el);
              updateProxyText(data.emailList[el].join("\n"));
            }
          }}
          className={`${active2 === el ? "active" : ""} listbox`}
        >
          <div className="flex">
            <div className="listheader">{el}</div>

            {!(el === "Default Group") ? (
              <svg
                onClick={() => {
                  if (active2 === el) {
                    setActive2("");
                    updateProxyText("");
                  }
                  ProxySender("onDeleteEmailGroup", { name: el });
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
          <div className="proxycount">{data.emailList[el].length} emails</div>
        </div>
      </div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      beforeChildren={true}
      transition={{ duration: 0.2 }}
      className="main email"
    >
      {/* Modal to Add proxioes to a  Proxy Group */}
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
              onKeyDown={e => {
                if (e.which === 13) {
                  document.getElementById("saveList").click();
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              className="modal"
            >
              <div>
                <div className="smheader">Add Proxies</div>
                <textarea
                  className="mb-2"
                  value={newProxy}
                  onChange={e => {
                    updateNewProxy(e.target.value);
                  }}
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                />
                <div className="btn">
                  <Button
                    id="saveList"
                    text="Save List"
                    onClick={() => {
                      if (active) {
                        ProxySender("onAddProxiesToGroup", {
                          name: active,
                          proxiesEntered: newProxy,
                        });
                      } else {
                        alert(
                          "Please select the proxy list you want to add to",
                        );
                      }

                      setopenModal(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      {/* Modal to Create Email Group */}
      <AnimatePresence>
        {emailGroupModal && (
          <Modal
            isOpen={emailGroupModal}
            onRequestClose={() => updateEmailGroupModal(false)}
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
              onKeyDown={e => {
                if (e.which === 13) {
                  document.getElementById("saveEmailGroup").click();
                }
              }}
            >
              <div>
                <InputLabel
                  label="Group Name"
                  type="text"
                  placeholder="Enter Group Name"
                  input={grpName}
                  setInput={setGrpName}
                />

                <div className="btn">
                  <Button
                    id="saveEmailGroup"
                    text="Save List"
                    onClick={() => {
                      if (data.emailList[grpName]) {
                        return toast.error(
                          <div>
                            An email group already exists with that name
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
                      } else {
                        ProxySender("onCreateEmailGroup", {
                          name: grpName,
                        });
                      }

                      updateEmailGroupModal(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      {/* Modal to Create Proxy Group */}

      <AnimatePresence>
        {proxyPrompt && (
          <Modal
            isOpen={proxyPrompt}
            onRequestClose={() => toggleProxyPrompt(false)}
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
                  Clear Proxy List
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
                    onClick={() => {
                      ProxySender("onTruncateProxyGroup", { name: active });
                      toggleProxyPrompt(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {emailPrompt && (
          <Modal
            isOpen={emailPrompt}
            onRequestClose={() => toggleEmailPrompt(false)}
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
                  Clear Email List
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
                    onClick={() => {
                      ProxySender("onTruncateEmailGroup", { name: active2 });
                      toggleEmailPrompt(false);
                      updateProxyText("");
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {proxyGroupModal && (
          <Modal
            isOpen={proxyGroupModal}
            onRequestClose={() => updateProxyGroupModal(false)}
            style={customStyles}
            contentLabel="Example Modal"
            className="reactmodal"
          >
            <motion.div
              onKeyDown={e => {
                if (e.which === 13) {
                  document.getElementById("saveProxyGroup").click();
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              className="modal"
            >
              <div>
                <InputLabel
                  label="Group Name"
                  type="text"
                  placeholder="Enter Group Name"
                  input={grpName}
                  setInput={setGrpName}
                />

                <div className="btn">
                  <Button
                    id="saveProxyGroup"
                    text="Save List"
                    onClick={() => {
                      if (data.proxyList[grpName]) {
                        return toast.error(
                          <div>
                            A proxy group already exists with that name
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
                      } else {
                        ProxySender("onCreateProxyGroup", {
                          name: grpName,
                        });
                      }
                      updateProxyGroupModal(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      <div className="emailleftsection">
        <PageDetails
          pagename={
            <div>
              Proxies
              <svg
                onClick={() => {
                  updateProxyGroupModal(true);
                }}
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
          controls={true}
        />
        <div className="listcontainer">
          <div className="lists">
            <CustomScrollbars>
              <ProxyLists />
            </CustomScrollbars>
          </div>
        </div>
        <div className="header flex al-ce">
          {active}{" "}
          <svg
            onClick={() => {
              setopenModal(true);
            }}
            style={{ cursor: "pointer", marginLeft: "1rem" }}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3.33337V12.6667"
              stroke="#97DDDD"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.33337 8H12.6667"
              stroke="#97DDDD"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div
            title="Clear List"
            style={{ cursor: "pointer", marginLeft: "auto" }}
            onClick={() => toggleProxyPrompt(true)}
          >
            <svg
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
          </div>
        </div>
        <div className="proxyheadergrid">
          <div>Proxy</div>
          <div>Status</div>
          <div />
        </div>
        <div className="proxylists">
          {active && data.proxyList[active] && (
            <>
              <AutoSizer className="taskVirtual">
                {({ height, width }) => (
                  <VirtualList
                    className="taskVirtual"
                    width={width}
                    height={height}
                    itemCount={Object.keys(data.proxyList[active]).length}
                    overscanCount={25}
                    itemSize={45}
                    renderItem={({ index, style }) => {
                      const e = Object.keys(data.proxyList[active])[index];
                      return (
                        <>
                          <ProxyItem
                            key={e}
                            style={{ ...style, marginBottom: "5px" }}
                            active={active}
                            testURL={testUrl}
                            proxy={data.proxyList[active][e].proxy}
                            status={data.proxyList[active][e].status}
                            statusColor={data.proxyList[active][e].statusColor}
                          />
                        </>
                      );
                    }}
                  />
                )}
              </AutoSizer>
            </>
          )}
        </div>
        <div className="btns">
          <input
            placeholder="www.google.com"
            value={testUrl}
            onChange={e => updateTestUrl(e.target.value)}
          />

          <Button
            full={true}
            onClick={() => {
              // groupName, siteURL

              ProxySender("onTestAllProxies", {
                groupName: active,
                testURL: testUrl,
              });
            }}
            text={
              <div className="flex al-ce jc-ce">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.33337 2L12.6667 8L3.33337 14V2Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div className="l-100">Test All</div>
              </div>
            }
          />
          <Button
            onClick={() => {
              ProxySender("onDeleteBad", { name: active });
            }}
            full={true}
            type="red"
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
                    d="M4.66669 3.49996V2.33329C4.66669 2.02387 4.7896 1.72713 5.0084 1.50833C5.22719 1.28954 5.52393 1.16663 5.83335 1.16663H8.16669C8.47611 1.16663 8.77285 1.28954 8.99165 1.50833C9.21044 1.72713 9.33335 2.02387 9.33335 2.33329V3.49996M11.0834 3.49996V11.6666C11.0834 11.976 10.9604 12.2728 10.7416 12.4916C10.5229 12.7104 10.2261 12.8333 9.91669 12.8333H4.08335C3.77393 12.8333 3.47719 12.7104 3.2584 12.4916C3.0396 12.2728 2.91669 11.976 2.91669 11.6666V3.49996H11.0834Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <div className="l-100">Delete Bad</div>
              </div>
            }
          />
        </div>
      </div>
      <div className="border" />
      <div className="emailrightsection">
        <PageDetails
          pagename={
            <div>
              Emails
              <span
                onClick={() => {
                  updateEmailGroupModal(true);
                }}
              >
                <svg
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
              </span>
            </div>
          }
        />
        <div className="listcontainer">
          <div className="lists">
            <CustomScrollbars>
              <EmailLists />
            </CustomScrollbars>
          </div>
        </div>
        <div className="header flex al-ce">
          {active2}

          <div
            title="Clear List"
            style={{ cursor: "pointer", marginLeft: "auto" }}
            onClick={() => toggleEmailPrompt(true)}
          >
            <svg
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
          </div>
        </div>
        <textarea
          name="textarea"
          value={proxyText}
          onChange={e => updateProxyText(e.target.value)}
        />
        <div className="btn">
          <Button
            onClick={() => {
              ProxySender("onUpdateEmails", {
                name: active2,
                emails: proxyText,
              });
            }}
            text={<div>Save List</div>}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Email;
