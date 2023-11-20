//Default values for the bot you should replace this to everything empty in production. For now it has demo values.

const state = {
  dash: {
    accountsFailed: 0,
    accountsCreated: 0,
    smsUsed: 0,
    accountsFailedGraph: {
      year: {
        categories: ["2020", "2021", "2022", "2023"],
        values: [0, 0, 0, 0],
      },
      month: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      week: {
        categories: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        values: [0, 0, 0, 0, 0, 0, 0],
      },
      day: {
        categories: [
          "12:00 AM",
          "01:00 AM",
          "02:00 AM",
          "03:00 AM",
          "04:00 AM",
          "05:00 AM",
          "06:00 AM",
          "07:00 AM",
          "08:00 AM",
          "09:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "01:00 PM",
          "02:00 PM",
          "03:00 PM",
          "04:00 PM",
          "05:00 PM",
          "06:00 PM",
          "07:00 PM",
          "08:00 PM",
          "09:00 PM",
          "10:00 PM",
          "11:00 PM",
        ],
        values: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
      },
    },
    accCreatedGraph: {
      year: {
        categories: ["2020", "2021", "2022", "2023"],
        values: [0, 0, 0, 0],
      },
      month: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      week: {
        categories: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        values: [0, 0, 0, 0, 0, 0, 0],
      },
      day: {
        categories: [
          "12:00 AM",
          "01:00 AM",
          "02:00 AM",
          "03:00 AM",
          "04:00 AM",
          "05:00 AM",
          "06:00 AM",
          "07:00 AM",
          "08:00 AM",
          "09:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "01:00 PM",
          "02:00 PM",
          "03:00 PM",
          "04:00 PM",
          "05:00 PM",
          "06:00 PM",
          "07:00 PM",
          "08:00 PM",
          "09:00 PM",
          "10:00 PM",
          "11:00 PM",
        ],
        values: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
      },
    },
    smsUsedGraph: {
      year: {
        categories: ["2020", "2021", "2022", "2023"],
        values: [0, 0, 0, 0],
      },
      month: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      week: {
        categories: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        values: [0, 0, 0, 0, 0, 0, 0],
      },
      day: {
        categories: [
          "12:00 AM",
          "01:00 AM",
          "02:00 AM",
          "03:00 AM",
          "04:00 AM",
          "05:00 AM",
          "06:00 AM",
          "07:00 AM",
          "08:00 AM",
          "09:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "01:00 PM",
          "02:00 PM",
          "03:00 PM",
          "04:00 PM",
          "05:00 PM",
          "06:00 PM",
          "07:00 PM",
          "08:00 PM",
          "09:00 PM",
          "10:00 PM",
          "11:00 PM",
        ],
        values: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
      },
    },
    latestActivity: [],
  },

  tasks: {},

  proxies: {
    proxyList: {
      "Default Group": {},
    },
    emailList: {
      "Default Group": [],
    },
  },
  profiles: {},
  accounts: {
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
    flx: {
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
    crucial: {
      "Default Group": [],
    },
    krispykreme: {
      "Default Group": [],
    },
    checkers: {
      "Default Group": [],
    },
    wafflehouse: {
      "Default Group": [],
    },
    cinnabon: {
      "Default Group": [],
    },
    newegg: {
      "Default Group": [],
    },
  },

  settings: {
    user: {
      userImg:
        "https://profilepicture7.com/bao/bao_nanshengdongman/1/418219554.jpg",
      usename: "UserName",
      discriminator: "#1111",
    },
    license: {
      daysleft: "0",
      renewalDate: "1 Jan 2000",
      dashLink: "https://www.[removed]/dashboard",
      key: "",
    },
    captcha: {
      twocaptcha: "",
      capmonster: "",
      anticaptcha: "",
      resolved: "",
    },
    sms: {
      smsactivate: "",
      onlinesim: "",
      fivesim: "",
      smspva: "",
      yomiesms: "",
    },
    webhookURL: "",
  },
};

export default state;
