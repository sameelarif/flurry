import Store from "./../../../store/Store";
import Screens from "./../../constants/screens";
import UI from "./../../UI";

import webhook from "../../../lib/tools/Webhook";

export default function (e, url) {
  webhook({
    content: null,
    embeds: [
      {
        title: "Webhook Successfully Configured",
        description: `If you're reading this, your webhook is ready to go!\n\nNeed help? [Create a ticket]([REDACTED])`,
        color: 12773868,
        footer: {
          text: "FlurryGen",
          icon_url: "https://cdn.discordapp.com/emojis/887810357815566386.gif",
        },
        timestamp: new Date().toISOString(),
      },
    ],
    username: "FlurryGen 3.0",
    avatar_url: "https://www.[removed]/assets/logo.png",
  });
}
