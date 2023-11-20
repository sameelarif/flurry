import InputLabel from "../InputLabel";
import "./Styles/LeftSection.css";
import Switch from "./Switch";
import Select from "../Select";
import Button from "../Button";
import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import Sender from "./../../Sender";
import Screens from "./../../Constants/Screens";
import useScreenData from "./../../Hooks/useScreenData";

let countryList = [
  "Afghanistan",
  "Aland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua And Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas The",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo The Democratic Republic Of The",
  "Cook Islands",
  "Costa Rica",
  "Cote D'Ivoire (Ivory Coast)",
  "Croatia (Hrvatska)",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji Islands",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia The",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey and Alderney",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Honduras",
  "Hong Kong S.A.R.",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "North Korea",
  "South Korea",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau S.A.R.",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Man (Isle of)",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands The",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestinian Territory Occupied",
  "Panama",
  "Papua new Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn Island",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Helena",
  "Saint Kitts And Nevis",
  "Saint Lucia",
  "Saint Pierre and Miquelon",
  "Saint Vincent And The Grenadines",
  "Saint-Barthelemy",
  "Saint-Martin (French part)",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard And Jan Mayen Islands",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad And Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks And Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City State (Holy See)",
  "Venezuela",
  "Vietnam",
  "Virgin Islands (British)",
  "Virgin Islands (US)",
  "Wallis And Futuna Islands",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const capitalize = (item) => {
  if (item.toLowerCase() === "sns") return "SNS";
  if (item.toLowerCase() === "ssense") return "SSENSE";
  if (item.toLowerCase() === "veve") return "VeVe";
  if (item.toLowerCase() === "bestbuy") return "BestBuy";
  if (item.toLowerCase() === "metamask") return "MetaMask";
  if (item.toLowerCase() === "flx") return "FLX";
  if (item.toLowerCase() === "krispykreme") return "KrispyKreme";
  return item.charAt(0).toUpperCase() + item.slice(1);
};

const TaskSender = Sender(Screens.TASKS);
const LeftSection = ({ visibleData, globalData, setEditMode, editMode }) => {
  const data = useScreenData(`${Screens.TASKS}-OPTIONS`, {
    accounts: {
      nike: {},
      google: {},
      walmart: {},
      bestbuy: {},
      target: {},
      sns: {},
      amazon: {},
      outlook: {},
      yahoo: {},
      shopify: {},
      adidas: {},
      ssense: {},
      /*       topps: {}, */
      flx: {},
    },
    emailList: {},
    proxyList: {},
  });

  const selectRegions = (site) => {
    switch (site) {
      case "nike": {
        return [
          "Argentina",
          "Australia",
          "Austria",
          "Belgien",
          "Belgique",
          "Belgium",
          "Brasil",
          "Bulgaria",
          "Canada",
          "Canada",
          "Chile",
          "China",
          "Croatia",
          "Czech Republic",
          "Czechia",
          "Danmark",
          "Denmark",
          "Deutschland",
          "Egypt",
          "Espanya",
          "Finland",
          "France",
          "Greece",
          "Hong Kong",
          "Hungary",
          "India",
          "Indonesia",
          "Ireland",
          "Israel",
          "Italia",
          "Japan",
          "Japan",
          "Luxembourg",
          "Magyarország",
          "Malaysia",
          "Maroc",
          "Morocco",
          "Mexico",
          "Nederland",
          "Netherlands",
          "New Zealand",
          "Norge",
          "Norway",
          "Philippines",
          "Polska",
          "Portugal",
          "Portugal",
          "Puerto Rico",
          "Romania",
          "Russia",
          "Saudi Arabia",
          "Schweiz",
          "Singapore",
          "Slovakia",
          "Slovenia",
          "South Africa",
          "South Korea",
          "Suisse",
          "Sverige",
          "Svizzera",
          "Sweden",
          "Switzerland",
          "Taiwan",
          "Thailand",
          "Turkey",
          "United Arab Emirates",
          "United Kingdom",
          "United States",
          "Uruguay",
          "Vietnam",
        ];
      }
      case "google": {
        return ["United States"];
      }
      case "walmart": {
        return ["United States", "Canada"];
      }
      case "bestbuy": {
        return ["United States"];
      }
      case "target": {
        return ["United States"];
      }
      case "sns": {
        return ["United States"];
      }
      case "amazon": {
        return [
          "United States",
          "Canada",
          "Germany",
          "United Kingdom",
          "Australia",
          "China",
          "France",
          "India",
          "Italy",
          "Japan",
          "Mexico",
          "Turkey",
        ];
      }
      case "outlook": {
        return countryList;
      }
      case "yahoo": {
        return ["United States"];
      }
      case "shopify": {
        return ["United States"];
      }
      case "adidas": {
        return ["United States"];
      }
      case "ssense": {
        return ["United States"];
      }
      case "flx": {
        return ["United States"];
      }
      default: {
        return [];
      }
    }
  };

  const [url, setUrl] = useState();
  const [site, setSite] = useState("adidas");
  const [region, setRegion] = useState();
  const [provider, setProvider] = useState();
  const [captchaProvider, setCaptchaProvider] = useState();
  const [accGroup, setAccGroup] = useState();
  const [catchall, setCatchall] = useState("");
  const [keyPress, setKeyPress] = useState("");
  const [quantity, setQuantity] = useState("");
  const [account, setAccount] = useState();
  const [birth, setBirth] = useState("");
  const [proxyGroup, setProxyGroup] = useState();
  const [emailGroup, setEmailGroup] = useState();
  const [phnRegion, setPhnRegion] = useState();
  const [revBirth, toggleRevBirth] = useState(false);
  const [useProxies, toggleuseProxies] = useState(true);
  const [customEmails, togleCustomEmails] = useState(false);
  const [verifyWIthPhnNum, toggleverifyWIthPhnNum] = useState(false);
  const [receiveEmailFromSite, toggleReceiveEmailFromSite] = useState(false);
  const [autoSolveCaptchas, toggleAutoSolveCaptchas] = useState(true);
  const [invisibleGeneration, toggleinvisibleGeneration] = useState(true);
  const [useCustomBirthday, toggleCustomBirthday] = useState(false);
  const [xboxSignup, toggleXboxSignup] = useState(false);
  const [outlookMode, setOutlookMode] = useState();
  const [nikeMode, setNikeMode] = useState();
  const [setProfileInfo, toggleProfileInfo] = useState(false);
  const [verifyEmail, toggleVerifyEmail] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [generatePoints, toggleGeneratePoints] = useState(false);
  const createTaskRequest = (isEditing) => {
    TaskSender(
      "onCreateTask",
      {
        url,
        site,
        region,
        provider,
        captchaProvider,
        accGroup,
        catchall,
        quantity,
        account,
        birth,
        phnRegion,
        revBirth,
        useProxies,
        customEmails,
        verifyWIthPhnNum,
        receiveEmailFromSite,
        autoSolveCaptchas,
        invisibleGeneration,
        keyPress,
        proxyGroup,
        emailGroup,
        xboxSignup,
        outlookMode,
        setProfileInfo,
        nikeMode,
        verifyEmail,
        zipCode,
        generatePoints,
      },
      isEditing,
    );

    if (editMode) {
      setEditMode(null);
    }
  };

  useEffect(() => {
    let selectedTask = globalData[editMode];
    console.log(globalData);
    if (editMode !== null) {
      setSite(selectedTask.site);
      setRegion(selectedTask.region);
      setProvider(selectedTask.provider);
      setCaptchaProvider(selectedTask.captchaProvider);
      setUrl(selectedTask.url);
      setCatchall(selectedTask.catchall);
      setQuantity(selectedTask.quantity);
      setAccount(selectedTask.account);
      setPhnRegion(selectedTask.phnRegion);
      toggleRevBirth(selectedTask.reverseBirthday);
      toggleuseProxies(selectedTask.useProxies);
      togleCustomEmails(selectedTask.customEmails);
      toggleVerifyEmail(selectedTask.verifyEmail);
      toggleverifyWIthPhnNum(selectedTask.verifyWIthPhnNum);
      toggleReceiveEmailFromSite(selectedTask.receiveEmailFromSite);
      toggleAutoSolveCaptchas(selectedTask.autoSolveCaptchas);
      toggleinvisibleGeneration(selectedTask.invisibleGeneration);
      toggleuseProxies(selectedTask.useProxies);
      setAccGroup(selectedTask.accGroup);
      setProxyGroup(selectedTask.proxyGroup);
      setEmailGroup(selectedTask.emailGroup);
      setKeyPress(selectedTask.keyPress);
      setOutlookMode(selectedTask.outlookMode);
      setNikeMode(selectedTask.nikeMode);
      toggleXboxSignup(selectedTask.xboxSignup);
      toggleProfileInfo(selectedTask.setProfileInfo);
      setZipCode(selectedTask.zipCode);
      toggleGeneratePoints(selectedTask.generatePoints || false);
    } else {
      setRegion();
      setProvider();
      setCaptchaProvider();
      setAccGroup();
      setUrl("");
      setCatchall("");
      setQuantity("");
      setAccount();
      setBirth("");
      setPhnRegion();
      toggleRevBirth("");
      setKeyPress("");
      setProxyGroup();
      setEmailGroup();
      toggleuseProxies(false);
      togleCustomEmails(false);
      toggleverifyWIthPhnNum(false);
      toggleVerifyEmail(false);
      toggleReceiveEmailFromSite(false);
      toggleAutoSolveCaptchas(false);
      toggleinvisibleGeneration(false);
      setOutlookMode();
      setNikeMode();
      toggleXboxSignup(false);
      setZipCode("");
      toggleGeneratePoints(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  return (
    <div className="leftsection">
      <div className="col-2">
        <Select
          placeholder="Select Site"
          label="Site"
          options={Object.keys(visibleData)
            .map((key) => capitalize(key))
            .sort()}
          input={capitalize(site)}
          setInput={(e) => {
            setSite(e.toLowerCase());
            setAccGroup("");
            setAccount("");
          }}
        />

        {visibleData[site]?.outlookModes && (
          <Select
            placeholder="Select Mode"
            label="Mode"
            options={["Phone", "Phone & Email", "Email"]}
            input={outlookMode}
            setInput={setOutlookMode}
          />
        )}

        {visibleData[site]?.nikeModes && (
          <Select
            placeholder="Select Mode"
            label="Mode"
            options={["Safe"]}
            input={nikeMode}
            setInput={setNikeMode}
          />
        )}
        {visibleData[site]?.region && (
          <Select
            placeholder="Select Region"
            label="Region"
            options={selectRegions(site).sort()}
            input={region}
            setInput={setRegion}
          />
        )}
        {((visibleData[site]?.provider &&
          verifyWIthPhnNum === true &&
          ["amazon", "nike", "target", "outlook"].includes(site)) ||
          (site === "outlook" &&
            verifyWIthPhnNum === true &&
            outlookMode?.toLowerCase().includes("phone"))) && (
          <Select
            placeholder="Select SMS Provider"
            label="SMS Provider"
            options={["SMS-Activate", "OnlineSim", "5Sim", "Yomie"]}
            input={provider}
            setInput={setProvider}
          />
        )}

        {visibleData[site]?.provider &&
          !["amazon", "nike", "target"].includes(site) && (
            <Select
              placeholder="Select SMS Provider"
              label="SMS Provider"
              options={["SMS-Activate", "OnlineSim", "5Sim", "Yomie"]}
              input={provider}
              setInput={setProvider}
            />
          )}

        {visibleData[site]?.captchaProvider && autoSolveCaptchas === true && (
          <Select
            placeholder="Select Captcha Provider"
            label="Captcha Provider"
            options={["2Captcha", "CapMonster", "Anti-Captcha", "Resolved"]}
            input={captchaProvider}
            setInput={setCaptchaProvider}
          />
        )}
        {visibleData[site]?.accountGroup && (
          <Select
            label="Account Group"
            placeholder="Select Group"
            options={
              data.accounts[site] ? [...Object.keys(data.accounts[site])] : []
            }
            input={accGroup ? accGroup : null}
            setInput={(e) => {
              setAccGroup(e);
              setAccount("");
            }}
          />
        )}
        {useProxies === true && (
          <Select
            label="Proxy Group"
            placeholder="Select Group"
            options={
              data.proxyList ? ["None", ...Object.keys(data.proxyList)] : []
            }
            input={proxyGroup}
            setInput={(e) => {
              setProxyGroup(e);
            }}
          />
        )}

        {customEmails === true && (
          <Select
            label="Email Group"
            placeholder="Select Group"
            options={
              data.emailList ? ["None", ...Object.keys(data.emailList)] : []
            }
            input={emailGroup}
            setInput={(e) => {
              setEmailGroup(e);
            }}
          />
        )}

        {visibleData[site]?.siteURL && (
          <div>
            <InputLabel
              label={<div>Site URL</div>}
              type="text"
              placeholder="Enter Site URL (e.g., kith.com)"
              input={url}
              setInput={setUrl}
            />
          </div>
        )}
        {visibleData[site]?.quantity && (
          <InputLabel
            label="Quantity"
            type="number"
            placeholder="Enter Quantity"
            input={quantity}
            setInput={setQuantity}
          />
        )}
        {visibleData[site]?.catchAll && customEmails === false && (
          <InputLabel
            label="Catchall"
            type="text"
            placeholder="Enter Catchall"
            input={catchall}
            setInput={setCatchall}
          />
        )}
        {visibleData[site]?.zipCode && (
          <InputLabel
            label="Zip Code"
            placeholder="Enter Zip Code"
            type="number"
            input={zipCode}
            setInput={setZipCode}
            maxLength={5}
          />
        )}
        {visibleData[site]?.phoneRegion && verifyWIthPhnNum === true && (
          <Select
            label="Phone Region"
            showSearch={true}
            placeholder="Select Region"
            options={countryList}
            input={phnRegion}
            setInput={setPhnRegion}
          />
        )}

        {visibleData[site]?.customBirthday && useCustomBirthday === true && (
          <div style={{ marginBottom: "15px" }}>
            <div className="label">Custom Birth</div>
            <DatePicker
              placeholder={"Select Birthday"}
              value={birth}
              onChange={(date) => setBirth(date)}
            />
          </div>
        )}

        {visibleData[site]?.keypressDelay && (
          <InputLabel
            label="Keypress Delay"
            type="number"
            placeholder="Enter Delay"
            input={keyPress}
            setInput={setKeyPress}
          />
        )}
      </div>

      <div className="col-2">
        {visibleData[site]?.reverseBirthday && (
          <Switch
            label="Reverse Birthday"
            highlight={revBirth}
            setHighlight={toggleRevBirth}
          />
        )}

        {visibleData[site]?.customBirthday && (
          <Switch
            label="Use Custom Birthday"
            highlight={useCustomBirthday}
            setHighlight={toggleCustomBirthday}
          />
        )}
        {visibleData[site]?.useProxies && (
          <Switch
            label="Use Proxies"
            highlight={useProxies}
            setHighlight={toggleuseProxies}
          />
        )}
        {visibleData[site]?.useCustomEmail && (
          <Switch
            label="Use Custom Emails"
            highlight={customEmails}
            setHighlight={togleCustomEmails}
          />
        )}
        {(visibleData[site]?.verifyPhoneNumber ||
          (site === "outlook" &&
            outlookMode?.toLowerCase().includes("phone"))) && (
          <Switch
            label="Verify with SMS"
            highlight={verifyWIthPhnNum}
            setHighlight={toggleverifyWIthPhnNum}
          />
        )}
        {visibleData[site]?.verifyEmail && (
          <Switch
            label="Verify Email"
            highlight={verifyEmail}
            setHighlight={toggleVerifyEmail}
          />
        )}

        {visibleData[site]?.generatePoints && verifyEmail && (
          <Switch
            label="Generate Points"
            highlight={generatePoints}
            setHighlight={toggleGeneratePoints}
          />
        )}
        {visibleData[site]?.receiveEmails && (
          <Switch
            label="Receive Emails from Site"
            highlight={receiveEmailFromSite}
            setHighlight={toggleReceiveEmailFromSite}
          />
        )}
        {visibleData[site]?.autoSolveCaptchas && (
          <Switch
            label="Solve Captcha"
            highlight={autoSolveCaptchas}
            setHighlight={toggleAutoSolveCaptchas}
          />
        )}
        {visibleData[site]?.invisibleGeneration && (
          <Switch
            label="Invisible Generation"
            highlight={invisibleGeneration}
            setHighlight={toggleinvisibleGeneration}
          />
        )}

        {visibleData[site]?.xboxSignUp && (
          <Switch
            label="Xbox Signup"
            highlight={xboxSignup}
            setHighlight={toggleXboxSignup}
          />
        )}

        {visibleData[site]?.setProfileInfo && (
          <Switch
            label="Set Profile Information"
            highlight={setProfileInfo}
            setHighlight={toggleProfileInfo}
          />
        )}
      </div>
      <div className="twogrid">
        {editMode ? (
          <Button
            full={true}
            onClick={() => {
              setEditMode(null);
            }}
            type="red"
            text={<div className="flex al-ce jc-ce">Cancel Edit</div>}
          />
        ) : (
          <div />
        )}

        <Button
          full={true}
          onClick={() => {
            createTaskRequest(editMode);
          }}
          text={
            <div className="flex al-ce jc-ce">
              {!editMode ? (
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.33331 8H12.6666"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Add Task
                </span>
              ) : (
                <span>
                  <svg
                    class="edit"
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.3833 1.75009C10.5365 1.59689 10.7184 1.47535 10.9186 1.39244C11.1188 1.30952 11.3333 1.26685 11.55 1.26685C11.7667 1.26685 11.9812 1.30952 12.1814 1.39244C12.3816 1.47535 12.5635 1.59689 12.7167 1.75009C12.8699 1.9033 12.9914 2.08519 13.0743 2.28537C13.1572 2.48554 13.1999 2.70009 13.1999 2.91676C13.1999 3.13343 13.1572 3.34798 13.0743 3.54816C12.9914 3.74833 12.8699 3.93022 12.7167 4.08343L4.84166 11.9584L1.63333 12.8334L2.50833 9.62509L10.3833 1.75009Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Edit Task
                </span>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default LeftSection;
