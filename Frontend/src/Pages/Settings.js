import PageDetails from "../Components/PageDetails";
import UserDetails from "../Components/Settings/UserDetails";
import RenewalDate from "../Components/Settings/RenewalDate";
import { useEffect, useState } from "react";
import Key from "../Components/Settings/Key";
import Webhook from "../Components/Settings/Webhook";
import Captcha from "../Components/Settings/Captcha";
import "./Styles/Settings.css";
import Sms from "../Components/Settings/Sms";
import ProfileModal from "../Components/Settings/ProfileModal";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "react-modal";
import Button from "../Components/Button";
import Inputlabel from "../Components/InputLabel";
import Screens from "./../Constants/Screens";
import useScreenData from "./../Hooks/useScreenData";

import Sender from "./../Sender";
import { shell } from "electron";
const SettingsSender = Sender(Screens.SETTINGS);

let SettingsData = {
  user: {
    userImg:
      "https://profilepicture7.com/bao/bao_nanshengdongman/1/418219554.jpg",
    username: "UserName",
    discriminator: "#1111",
  },
  license: {
    daysLeft: 10,
    renewalDate: "22 Dec 2021",
    dashLink: "www.google.com",
    key: "xxxx-xxxx-xxxx-xxxx",
  },
  captcha: {
    webhook: "",
    twoCaptcha: "",
    capmonster: "",
    aycdAccessToken: "",
    aycdApiKey: "",
  },
  sms: {
    smsactivate: "",
    onlineSim: "",
    fivesim: "",
    imap: "",
    yomiesms: "",
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

const profiles = {};

const Settings = () => {
  const data = useScreenData(`${Screens.SETTINGS}-LOAD`, SettingsData);
  const profileData = useScreenData(`PROFILES-LOAD`, profiles);
  const authData = useScreenData(`${Screens.AUTH}-LOAD`, {
    key: "",
    subscription: {
      current_period_end: "",
    },
    plan: {
      recurring: null,
    },
    user: {
      discord: {
        username: "",
        discriminator: "",
      },
      photo_url: "",
      discriminator: "",
      username: "",
      avatar: "",
    },
  });

  const [smsactivate, updateSmsactivate] = useState("");
  const [onlinesim, updateOnlinesim] = useState("");
  const [fivesim, updatefivesim] = useState("");
  const [imap, updateimap] = useState("");
  const [yomiesms, updateyomiesms] = useState("");
  const [openModal, setopenModal] = useState(false);
  const [openClearStorage, setClearStorage] = useState(false);
  const [openManageProfile, setManageProfile] = useState(false);
  useEffect(() => {
    if (openModal === false) {
      updateSmsactivate(data.sms.smsactivate);
      updateOnlinesim(data.sms.onlinesim);
      updatefivesim(data.sms.fivesim);
      updateimap(data.sms.imap);
      updateyomiesms(data.sms.yomiesms);
    }
  }, [openModal, data.sms]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      beforeChildren={true}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="main settings"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              className="modal"
            >
              <div>
                <div className="header">SMS</div>
                <Inputlabel
                  label={
                    <div className="flex al-ce">
                      SMS-Activate
                      <svg
                        onClick={() => {
                          shell.openExternal(
                            "https://sms-activate.org/?ref=1036286",
                          );
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M10 2H14V6"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.66669 9.33333L14 2"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  }
                  placeholder="Enter Key"
                  input={smsactivate}
                  setInput={updateSmsactivate}
                />
                <Inputlabel
                  label={
                    <div className="flex al-ce">
                      OnlineSim
                      <svg
                        onClick={() => {
                          shell.openExternal(
                            "https://onlinesim.ru/?ref=2195341",
                          );
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M10 2H14V6"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.66669 9.33333L14 2"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  }
                  placeholder="Enter Key"
                  input={onlinesim}
                  setInput={updateOnlinesim}
                />
                <Inputlabel
                  disabled={true}
                  label={
                    <div className="flex al-ce">
                      5Sim
                      <svg
                        onClick={() => {
                          shell.openExternal("https://5sim.net/");
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M10 2H14V6"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.66669 9.33333L14 2"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  }
                  placeholder="Enter Key"
                  input={fivesim}
                  setInput={updatefivesim}
                />
                <Inputlabel
                  isTextArea={true}
                  label={
                    <div className="flex al-ce">
                      Yomie
                      <svg
                        onClick={() => {
                          shell.openExternal("https://discord.gg/pshpj4frW8");
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M10 2H14V6"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.66669 9.33333L14 2"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  }
                  placeholder="Enter Numbers"
                  input={yomiesms}
                  setInput={updateyomiesms}
                />
                <Inputlabel
                  label={
                    <div className="flex al-ce">
                      IMAP
                      <svg
                        onClick={() => {
                          shell.openExternal("https://mail.google.com/");
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M10 2H14V6"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.66669 9.33333L14 2"
                          stroke="#97DDDD"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  }
                  placeholder="Enter Credentials (server:email:password)"
                  input={imap}
                  setInput={updateimap}
                />

                <div className="btn">
                  <Button
                    text="Save Settings"
                    onClick={() => {
                      SettingsSender("onSMSSave", {
                        smsactivate,
                        onlinesim,
                        fivesim,
                        imap,
                        yomiesms,
                      });

                      setopenModal(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openClearStorage && (
          <Modal
            isOpen={openClearStorage}
            onRequestClose={() => setClearStorage(false)}
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
                  Clear Storage Confirmation
                </div>

                <p style={{ fontSize: "16px", color: "white" }}>
                  Are you sure you want to clear your storage? This action is
                  irreversible.
                </p>

                <div className="btn" style={{ marginTop: "20px" }}>
                  <Button
                    text="Cancel"
                    onClick={() => {
                      setClearStorage(false);
                    }}
                  />
                  <Button
                    type="red"
                    text="Confirm"
                    marginLeft
                    onClick={() => {
                      SettingsSender("onClearStorage");

                      setClearStorage(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      <PageDetails pagename="Settings" />
      <div className="grid maingrid">
        <div className="settingsleftsection">
          <UserDetails
            userImg={authData.user.avatar}
            username={authData.user.discord.username}
            userid={"#" + authData.user.discord.discriminator}
          />
          <RenewalDate data={data} authData={authData} />
          <Key lickey={authData.key || ""} />
          <Webhook data={data} />
        </div>
        <div className="settingsrightsection">
          <Captcha data={data} />
          <Sms setopenModal={setopenModal} />
          {openManageProfile && (
            <ProfileModal
              profiles={profileData}
              openManageProfile={openManageProfile}
              setManageProfile={setManageProfile}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "40px",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => setManageProfile(true)}
                text="Profile Information"
              />
            </div>
            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => setClearStorage(true)}
                type="red"
                text="Clear Storage"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
